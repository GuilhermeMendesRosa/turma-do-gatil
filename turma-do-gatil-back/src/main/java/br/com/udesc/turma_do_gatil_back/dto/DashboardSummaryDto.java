package br.com.udesc.turma_do_gatil_back.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO que contém um resumo do dashboard com gatos disponíveis, castrações pendentes e adotantes")
public class DashboardSummaryDto {
    
    @Schema(description = "Lista de gatos disponíveis para adoção")
    private List<CatDto> availableCats;
    
    @Schema(description = "Lista de castrações pendentes (agendadas)")
    private List<SterilizationDto> pendingSterilizations;
    
    @Schema(description = "Lista de adotantes cadastrados")
    private List<AdopterDto> registeredAdopters;
}
