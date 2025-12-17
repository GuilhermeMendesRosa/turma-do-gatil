package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.ImageUploadResponseDto;
import br.com.udesc.turma_do_gatil_back.services.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
            
            String imageUrl = s3Service.uploadImage(file);
            
            ImageUploadResponseDto response = new ImageUploadResponseDto(
                    file.getOriginalFilename(),
                    imageUrl,
                    file.getSize(),
                    file.getContentType()
            );
            
            log.info("Upload realizado com sucesso. URL: {}", imageUrl);
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
}
