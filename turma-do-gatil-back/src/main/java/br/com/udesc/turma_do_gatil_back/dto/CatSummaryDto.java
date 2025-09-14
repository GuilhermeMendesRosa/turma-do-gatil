package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatSummaryDto {
    private Long availableCatsCount;
    private Long adoptedCatsCount;
    private Long inProcessCatsCount;
    private Long totalCatsCount;
}