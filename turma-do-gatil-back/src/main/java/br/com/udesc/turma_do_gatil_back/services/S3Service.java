package br.com.udesc.turma_do_gatil_back.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public String uploadImage(MultipartFile file) throws IOException {
        validateImage(file);

        String key = generateUniqueFileName(file.getOriginalFilename());
        
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putObjectRequest, 
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            log.info("Arquivo {} enviado com sucesso para o S3", key);
            return key;
        } catch (S3Exception e) {
            log.error("Erro ao fazer upload do arquivo para o S3: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao fazer upload da imagem: " + e.getMessage());
        }
    }

    public String getObjectUrl(String key) {
        return getPresignedUrl(key, Duration.ofDays(7));
    }

    public String getPresignedUrl(String key) {
        return getPresignedUrl(key, Duration.ofDays(7));
    }

    private String getPresignedUrl(String key, Duration duration) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(duration)
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            
            String url = presignedRequest.url().toString();
            log.debug("URL pré-assinada gerada para {}: {}", key, url);
            return url;
        } catch (Exception e) {
            log.error("Erro ao gerar URL pré-assinada: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao gerar URL da imagem: " + e.getMessage());
        }
    }

    public void deleteObject(String key) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            log.info("Arquivo {} deletado com sucesso do S3", key);
        } catch (S3Exception e) {
            log.error("Erro ao deletar arquivo do S3: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao deletar imagem: " + e.getMessage());
        }
    }

    public boolean objectExists(String key) {
        try {
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (S3Exception e) {
            log.error("Erro ao verificar existência do arquivo: {}", e.getMessage(), e);
            return false;
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo não pode ser vazio");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("O arquivo é muito grande. Tamanho máximo: %d MB", MAX_FILE_SIZE / (1024 * 1024))
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Tipo de arquivo não permitido. Permitidos: " + String.join(", ", ALLOWED_CONTENT_TYPES)
            );
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return "images/" + UUID.randomUUID().toString() + extension;
    }
}
