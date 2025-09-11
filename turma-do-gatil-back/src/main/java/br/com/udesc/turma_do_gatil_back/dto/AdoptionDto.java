package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdoptionDto {
    private UUID id;
    private UUID catId;
    private UUID adopterId;
    private LocalDateTime adoptionDate;
    private AdoptionStatus status;

    private CatDto cat;
    private AdopterDto adopter;

    public AdoptionDto(UUID id, UUID catId, UUID adopterId, LocalDateTime adoptionDate, AdoptionStatus status) {
        this.id = id;
        this.catId = catId;
        this.adopterId = adopterId;
        this.adoptionDate = adoptionDate;
        this.status = status;
    }
}
