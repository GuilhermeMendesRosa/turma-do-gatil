package br.com.udesc.turma_do_gatil_back.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO que representa as estatísticas de castração dos gatos")
public class SterilizationStatsDto {

    @Schema(description = "Quantidade de gatos elegíveis para castração (90-179 dias)", example = "15")
    private Long eligibleCount;

    @Schema(description = "Quantidade de gatos com castração atrasada (180+ dias)", example = "8")
    private Long overdueCount;

    @Schema(description = "Total de gatos que precisam de castração", example = "23")
    private Long totalNeedingSterilization;

    public SterilizationStatsDto() {}

    public SterilizationStatsDto(Long eligibleCount, Long overdueCount) {
        this.eligibleCount = eligibleCount;
        this.overdueCount = overdueCount;
        this.totalNeedingSterilization = eligibleCount + overdueCount;
    }

    // Getters and Setters
    public Long getEligibleCount() {
        return eligibleCount;
    }

    public void setEligibleCount(Long eligibleCount) {
        this.eligibleCount = eligibleCount;
        updateTotal();
    }

    public Long getOverdueCount() {
        return overdueCount;
    }

    public void setOverdueCount(Long overdueCount) {
        this.overdueCount = overdueCount;
        updateTotal();
    }

    public Long getTotalNeedingSterilization() {
        return totalNeedingSterilization;
    }

    public void setTotalNeedingSterilization(Long totalNeedingSterilization) {
        this.totalNeedingSterilization = totalNeedingSterilization;
    }

    private void updateTotal() {
        if (eligibleCount != null && overdueCount != null) {
            this.totalNeedingSterilization = eligibleCount + overdueCount;
        }
    }
}
