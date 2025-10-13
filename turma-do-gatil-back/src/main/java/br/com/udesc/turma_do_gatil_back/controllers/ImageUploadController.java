package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.ImageUploadResponseDto;
import br.com.udesc.turma_do_gatil_back.services.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class ImageUploadController {

    private final S3Service s3Service;

    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            log.info("Recebendo requisição de upload de imagem: {}", file.getOriginalFilename());
            
            String fileKey = s3Service.uploadImage(file);
            
            String fileUrl = s3Service.getObjectUrl(fileKey);
            
            ImageUploadResponseDto response = new ImageUploadResponseDto(
                    file.getOriginalFilename(),
                    fileUrl,
                    fileKey,
                    file.getSize(),
                    file.getContentType()
            );
            
            log.info("Upload realizado com sucesso. URL: {}", fileUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("Erro de validação no upload: {}", e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            log.error("Erro ao fazer upload da imagem: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao fazer upload da imagem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/presigned-url")
    public ResponseEntity<?> getPresignedUrl(@RequestParam("key") String key) {
        try {
            if (!s3Service.objectExists(key)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imagem não encontrada");
                return ResponseEntity.notFound().build();
            }
            
            String presignedUrl = s3Service.getPresignedUrl(key);
            
            Map<String, String> response = new HashMap<>();
            response.put("url", presignedUrl);
            response.put("key", key);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Erro ao gerar URL pré-assinada: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao gerar URL de acesso: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteImage(@RequestParam("key") String key) {
        try {
            if (!s3Service.objectExists(key)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imagem não encontrada");
                return ResponseEntity.notFound().build();
            }
            
            s3Service.deleteObject(key);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Imagem deletada com sucesso");
            response.put("key", key);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Erro ao deletar imagem: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao deletar imagem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<?> checkImageExists(@RequestParam("key") String key) {
        try {
            boolean exists = s3Service.objectExists(key);
            
            Map<String, Object> response = new HashMap<>();
            response.put("exists", exists);
            response.put("key", key);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Erro ao verificar existência da imagem: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Erro ao verificar imagem: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
