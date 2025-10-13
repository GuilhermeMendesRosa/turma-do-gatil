package br.com.udesc.turma_do_gatil_back.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.net.URL;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("S3Service Tests")
class S3ServiceTest {

    @Mock
    private S3Client s3Client;

    @Mock
    private S3Presigner s3Presigner;

    @InjectMocks
    private S3Service s3Service;

    private static final String BUCKET_NAME = "test-bucket";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(s3Service, "bucketName", BUCKET_NAME);
        ReflectionTestUtils.setField(s3Service, "urlExpirationMinutes", 60);
    }

    @Test
    @DisplayName("Should upload image successfully")
    void shouldUploadImageSuccessfully() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        when(s3Client.putObject(any(PutObjectRequest.class), any())).thenReturn(null);

        // Act
        String result = s3Service.uploadImage(file);

        // Assert
        assertNotNull(result);
        assertTrue(result.startsWith("images/"));
        assertTrue(result.endsWith(".jpg"));
        verify(s3Client, times(1)).putObject(any(PutObjectRequest.class), any());
    }

    @Test
    @DisplayName("Should throw exception when file is empty")
    void shouldThrowExceptionWhenFileIsEmpty() {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                new byte[0]
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> s3Service.uploadImage(emptyFile)
        );

        assertEquals("O arquivo não pode ser vazio", exception.getMessage());
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any());
    }

    @Test
    @DisplayName("Should throw exception when file is too large")
    void shouldThrowExceptionWhenFileIsTooLarge() {
        // Arrange
        byte[] largeContent = new byte[11 * 1024 * 1024]; // 11MB
        MockMultipartFile largeFile = new MockMultipartFile(
                "file",
                "test.jpg",
                "image/jpeg",
                largeContent
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> s3Service.uploadImage(largeFile)
        );

        assertTrue(exception.getMessage().contains("muito grande"));
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any());
    }

    @Test
    @DisplayName("Should throw exception for invalid content type")
    void shouldThrowExceptionForInvalidContentType() {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                "test content".getBytes()
        );

        // Act & Assert
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> s3Service.uploadImage(invalidFile)
        );

        assertTrue(exception.getMessage().contains("Tipo de arquivo não permitido"));
        verify(s3Client, never()).putObject(any(PutObjectRequest.class), any());
    }

    @Test
    @DisplayName("Should generate correct object URL")
    void shouldGenerateCorrectObjectUrl() {
        // Arrange
        String key = "images/test.jpg";

        // Act
        String url = s3Service.getObjectUrl(key);

        // Assert
        assertEquals(String.format("https://%s.s3.amazonaws.com/%s", BUCKET_NAME, key), url);
    }

    @Test
    @DisplayName("Should generate public URL successfully (getPresignedUrl returns public URL)")
    void shouldGeneratePresignedUrlSuccessfully() throws Exception {
        // Arrange
        String key = "images/test.jpg";
        String expectedUrl = "https://test-bucket.s3.amazonaws.com/images/test.jpg";

        // Act
        String result = s3Service.getPresignedUrl(key);

        // Assert
        assertNotNull(result);
        assertEquals(expectedUrl, result);
        assertTrue(result.contains(key));
    }

    @Test
    @DisplayName("Should delete object successfully")
    void shouldDeleteObjectSuccessfully() {
        // Arrange
        String key = "images/test.jpg";
        when(s3Client.deleteObject(any(DeleteObjectRequest.class))).thenReturn(null);

        // Act
        assertDoesNotThrow(() -> s3Service.deleteObject(key));

        // Assert
        verify(s3Client, times(1)).deleteObject(any(DeleteObjectRequest.class));
    }

    @Test
    @DisplayName("Should return true when object exists")
    void shouldReturnTrueWhenObjectExists() {
        // Arrange
        String key = "images/test.jpg";
        when(s3Client.headObject(any(HeadObjectRequest.class)))
                .thenReturn(HeadObjectResponse.builder().build());

        // Act
        boolean exists = s3Service.objectExists(key);

        // Assert
        assertTrue(exists);
        verify(s3Client, times(1)).headObject(any(HeadObjectRequest.class));
    }

    @Test
    @DisplayName("Should return false when object does not exist")
    void shouldReturnFalseWhenObjectDoesNotExist() {
        // Arrange
        String key = "images/nonexistent.jpg";
        when(s3Client.headObject(any(HeadObjectRequest.class)))
                .thenThrow(NoSuchKeyException.builder().message("Not found").build());

        // Act
        boolean exists = s3Service.objectExists(key);

        // Assert
        assertFalse(exists);
        verify(s3Client, times(1)).headObject(any(HeadObjectRequest.class));
    }

    @Test
    @DisplayName("Should accept all valid image types")
    void shouldAcceptAllValidImageTypes() throws IOException {
        // Arrange & Act & Assert
        String[] validTypes = {"image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"};
        
        for (String contentType : validTypes) {
            MockMultipartFile file = new MockMultipartFile(
                    "file",
                    "test." + contentType.split("/")[1],
                    contentType,
                    "test content".getBytes()
            );

            when(s3Client.putObject(any(PutObjectRequest.class), any())).thenReturn(null);

            assertDoesNotThrow(() -> s3Service.uploadImage(file),
                    "Should accept " + contentType);
        }
    }
}
