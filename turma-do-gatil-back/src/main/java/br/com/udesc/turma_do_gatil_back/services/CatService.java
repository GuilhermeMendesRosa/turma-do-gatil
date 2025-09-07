package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.dto.CatSterilizationStatusDto;
import br.com.udesc.turma_do_gatil_back.dto.SterilizationStatsDto;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationEligibilityStatus;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CatService {

    @Autowired
    private CatRepository catRepository;

    public Page<Cat> findAll(Pageable pageable) {
        return catRepository.findAll(pageable);
    }

    public Optional<Cat> findById(UUID id) {
        return catRepository.findById(id);
    }

    public Cat save(Cat cat) {
        return catRepository.save(cat);
    }

    public Cat update(UUID id, Cat cat) {
        if (!catRepository.existsById(id)) {
            throw new RuntimeException("Cat not found with id: " + id);
        }
        cat.setId(id);
        return catRepository.save(cat);
    }

    public void deleteById(UUID id) {
        if (!catRepository.existsById(id)) {
            throw new RuntimeException("Cat not found with id: " + id);
        }
        catRepository.deleteById(id);
    }

    public Page<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus, Pageable pageable) {
        return catRepository.findByAdoptionStatus(adoptionStatus, pageable);
    }

    public Page<Cat> findByColor(Color color, Pageable pageable) {
        return catRepository.findByColor(color, pageable);
    }

    public Page<Cat> findBySex(Sex sex, Pageable pageable) {
        return catRepository.findBySex(sex, pageable);
    }

    public Page<Cat> findByName(String name, Pageable pageable) {
        return catRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Cat> findWithFilters(String name, Color color, Sex sex, CatAdoptionStatus adoptionStatus, Pageable pageable) {
        // Garantir que strings vazias sejam tratadas como null
        String safeName = (name != null && name.trim().isEmpty()) ? null : name;
        String colorStr = color != null ? color.name() : null;
        String sexStr = sex != null ? sex.name() : null;
        String adoptionStatusStr = adoptionStatus != null ? adoptionStatus.name() : null;
        
        return catRepository.findWithFiltersJPQL(safeName, colorStr, sexStr, adoptionStatusStr, pageable);
    }

    public List<CatSterilizationStatusDto> findCatsNeedingSterilization() {
        List<Cat> allCats = catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO);
        LocalDateTime now = LocalDateTime.now();

        return allCats.stream()
                .filter(this::needsSterilization)
                .map(cat -> {
                    int ageInDays = (int) ChronoUnit.DAYS.between(cat.getBirthDate(), now);
                    SterilizationEligibilityStatus status = ageInDays >= 180 ?
                        SterilizationEligibilityStatus.OVERDUE :
                        SterilizationEligibilityStatus.ELIGIBLE;

                    return new CatSterilizationStatusDto(
                            cat.getId(),
                            cat.getName(),
                            cat.getColor(),
                            cat.getSex(),
                            cat.getBirthDate(),
                            cat.getShelterEntryDate(),
                            cat.getPhotoUrl(),
                            ageInDays,
                            status
                    );
                })
                .collect(Collectors.toList());
    }

    public SterilizationStatsDto getSterilizationStats() {
        List<Cat> allCats = catRepository.findByAdoptionStatusList(CatAdoptionStatus.NAO_ADOTADO);
        LocalDateTime now = LocalDateTime.now();

        long eligibleCount = 0;
        long overdueCount = 0;

        for (Cat cat : allCats) {
            if (needsSterilization(cat)) {
                int ageInDays = (int) ChronoUnit.DAYS.between(cat.getBirthDate(), now);
                if (ageInDays >= 180) {
                    overdueCount++;
                } else {
                    eligibleCount++;
                }
            }
        }

        return new SterilizationStatsDto(eligibleCount, overdueCount);
    }

    private boolean needsSterilization(Cat cat) {
        LocalDateTime now = LocalDateTime.now();
        int ageInDays = (int) ChronoUnit.DAYS.between(cat.getBirthDate(), now);

        // Deve ter pelo menos 90 dias
        if (ageInDays < 90) {
            return false;
        }

        // Verifica se já foi castrado ou tem castração agendada
        if (cat.getSterilizations() != null && !cat.getSterilizations().isEmpty()) {
            for (Sterilization sterilization : cat.getSterilizations()) {
                // Se já foi castrado (COMPLETED) ou tem castração agendada (SCHEDULED), não precisa
                if (sterilization.getStatus() == SterilizationStatus.COMPLETED ||
                    sterilization.getStatus() == SterilizationStatus.SCHEDULED) {
                    return false;
                }
            }
        }

        return true;
    }
}
