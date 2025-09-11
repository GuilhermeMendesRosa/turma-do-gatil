package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO para transferência de dados de adoção")
public class AdoptionDto {

    @Schema(description = "ID único da adoção", example = "123e4567-e89b-12d3-a456-426614174000", accessMode = Schema.AccessMode.READ_ONLY)
    private UUID id;

    @Schema(description = "ID do gato a ser adotado", example = "123e4567-e89b-12d3-a456-426614174001", required = true)
    private UUID catId;

    @Schema(description = "ID do adotante", example = "123e4567-e89b-12d3-a456-426614174002", required = true)
    private UUID adopterId;

    @Schema(description = "Data e hora da adoção", example = "2025-08-28T10:30:00", required = true)
    private LocalDateTime adoptionDate;

    @Schema(description = "Status atual da adoção", example = "PENDING", required = true,
            allowableValues = {"PENDING", "COMPLETED", "CANCELED"})
    private AdoptionStatus status;

    @Schema(description = "Dados do gato (preenchido automaticamente)", accessMode = Schema.AccessMode.READ_ONLY)
    private CatDto cat;

    @Schema(description = "Dados do adotante (preenchido automaticamente)", accessMode = Schema.AccessMode.READ_ONLY)
    private AdopterDto adopter;

    // Construtor customizado para uso específico
    public AdoptionDto(UUID id, UUID catId, UUID adopterId, LocalDateTime adoptionDate, AdoptionStatus status) {
        this.id = id;
        this.catId = catId;
        this.adopterId = adopterId;
        this.adoptionDate = adoptionDate;
        this.status = status;
    }
}
