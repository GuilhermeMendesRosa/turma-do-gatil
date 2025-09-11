package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {

    private List<CatDto> availableCats;
    private List<SterilizationDto> pendingSterilizations;
    private List<AdopterDto> registeredAdopters;
}
