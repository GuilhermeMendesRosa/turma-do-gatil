package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {

    private Long availableCatsCount;
    private Long pendingSterilizationsCount;
    private Long registeredAdoptersCount;
}
