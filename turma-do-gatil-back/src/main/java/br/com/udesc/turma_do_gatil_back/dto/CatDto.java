package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatDto {
    private UUID id;
    private String name;
    private Color color;
    private Sex sex;
    private LocalDateTime birthDate;
    private LocalDateTime shelterEntryDate;
    private String photoUrl;
    private CatAdoptionStatus adoptionStatus;
}
