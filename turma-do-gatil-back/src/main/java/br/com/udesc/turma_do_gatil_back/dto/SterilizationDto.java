package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO que representa uma esterilização/castração")
public class SterilizationDto {
    @Schema(description = "ID único da esterilização", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "ID do gato", example = "550e8400-e29b-41d4-a716-446655440001")
    private UUID catId;

    @Schema(description = "Nome do gato", example = "Mimi")
    private String cat;

    @Schema(description = "URL da foto do gato", example = "https://example.com/photos/mimi.jpg")
    private String photoUrl;

    @Schema(description = "Data da esterilização", example = "2024-03-15T10:30:00")
    private LocalDateTime sterilizationDate;

    @Schema(description = "Status da esterilização")
    private SterilizationStatus status;

    @Schema(description = "Observações sobre a esterilização", example = "Procedimento realizado sem complicações")
    private String notes;
}
