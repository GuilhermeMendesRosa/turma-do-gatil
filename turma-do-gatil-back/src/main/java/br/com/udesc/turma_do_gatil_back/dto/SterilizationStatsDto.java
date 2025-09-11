package br.com.udesc.turma_do_gatil_back.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class SterilizationStatsDto {

    private Long eligibleCount;
    private Long overdueCount;
    private Long totalNeedingSterilization;

    public SterilizationStatsDto(Long eligibleCount, Long overdueCount) {
        this.eligibleCount = eligibleCount;
        this.overdueCount = overdueCount;
        this.totalNeedingSterilization = eligibleCount + overdueCount;
    }

    public void setEligibleCount(Long eligibleCount) {
        this.eligibleCount = eligibleCount;
        updateTotal();
    }

    public void setOverdueCount(Long overdueCount) {
        this.overdueCount = overdueCount;
        updateTotal();
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
