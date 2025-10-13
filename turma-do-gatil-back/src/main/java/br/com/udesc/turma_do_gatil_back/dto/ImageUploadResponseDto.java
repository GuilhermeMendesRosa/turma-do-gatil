package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponseDto {
    private String fileName;
    private String fileUrl;
    private String fileKey;
    private Long fileSize;
    private String contentType;
}
