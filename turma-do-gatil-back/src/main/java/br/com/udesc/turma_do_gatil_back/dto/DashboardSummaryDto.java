package br.com.udesc.turma_do_gatil_back.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "DTO que contém um resumo do dashboard com gatos disponíveis, castrações pendentes e adotantes")
public class DashboardSummaryDto {
    
    @Schema(description = "Lista de gatos disponíveis para adoção")
    private List<CatDto> availableCats;
    
    @Schema(description = "Lista de castrações pendentes (agendadas)")
    private List<SterilizationDto> pendingSterilizations;
    
    @Schema(description = "Lista de adotantes cadastrados")
    private List<AdopterDto> registeredAdopters;

    // Constructors
    public DashboardSummaryDto() {}

    public DashboardSummaryDto(List<CatDto> availableCats, List<SterilizationDto> pendingSterilizations, List<AdopterDto> registeredAdopters) {
        this.availableCats = availableCats;
        this.pendingSterilizations = pendingSterilizations;
        this.registeredAdopters = registeredAdopters;
    }

    // Getters and Setters
    public List<CatDto> getAvailableCats() {
        return availableCats;
    }

    public void setAvailableCats(List<CatDto> availableCats) {
        this.availableCats = availableCats;
    }

    public List<SterilizationDto> getPendingSterilizations() {
        return pendingSterilizations;
    }

    public void setPendingSterilizations(List<SterilizationDto> pendingSterilizations) {
        this.pendingSterilizations = pendingSterilizations;
    }

    public List<AdopterDto> getRegisteredAdopters() {
        return registeredAdopters;
    }

    public void setRegisteredAdopters(List<AdopterDto> registeredAdopters) {
        this.registeredAdopters = registeredAdopters;
    }
}
