package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SterilizationDto {
    private UUID id;
    private UUID catId;
    private String cat;
    private String photoUrl;
    private LocalDateTime sterilizationDate;
    private SterilizationStatus status;
    private String notes;
}
