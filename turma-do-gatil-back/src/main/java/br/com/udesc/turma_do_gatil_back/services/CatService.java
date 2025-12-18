package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.dto.CatSterilizationStatusDto;
import br.com.udesc.turma_do_gatil_back.dto.SterilizationStatsDto;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.*;
import br.com.udesc.turma_do_gatil_back.exceptions.CatNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CatService {

    private final CatRepository catRepository;
    private final PropertiesService propertiesService;

    public Page<Cat> findAll(Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding all cats with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        return catRepository.findAll(pageable);
    }

    public Optional<Cat> findById(UUID id) {
        Objects.requireNonNull(id, "Cat ID cannot be null");
        log.debug("Finding cat by ID: {}", id);

        return catRepository.findById(id);
    }

    public Cat save(Cat cat) {
        Objects.requireNonNull(cat, "Cat cannot be null");
        log.info("Saving new cat: {}", cat.getName());
        cat.setAdoptionStatus(CatAdoptionStatus.NAO_ADOTADO);

        Cat savedCat = catRepository.save(cat);
        log.info("Cat saved successfully with ID: {}", savedCat.getId());

        return savedCat;
    }

    public Cat update(UUID id, Cat cat) {
        Objects.requireNonNull(id, "Cat ID cannot be null");
        Objects.requireNonNull(cat, "Cat cannot be null");

        log.debug("Updating cat with ID: {}", id);

        if (!catRepository.existsById(id)) {
            log.warn("Attempt to update non-existent cat with ID: {}", id);
            throw new CatNotFoundException("Cat not found with id: " + id);
        }

        cat.setId(id);
        Cat updatedCat = catRepository.save(cat);
        log.info("Cat updated successfully: {}", updatedCat.getName());

        return updatedCat;
    }

    public void deleteById(UUID id) {
        Objects.requireNonNull(id, "Cat ID cannot be null");
        log.debug("Deleting cat with ID: {}", id);

        if (!catRepository.existsById(id)) {
            log.warn("Attempt to delete non-existent cat with ID: {}", id);
            throw new CatNotFoundException("Cat not found with id: " + id);
        }

        catRepository.deleteById(id);
        log.info("Cat deleted successfully with ID: {}", id);
    }

    public Page<Cat> findByAdoptionStatus(CatAdoptionStatus adoptionStatus, Pageable pageable) {
        Objects.requireNonNull(adoptionStatus, "Adoption status cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding cats by adoption status: {}", adoptionStatus);

        return catRepository.findByAdoptionStatus(adoptionStatus, pageable);
    }

    public Page<Cat> findByColor(Color color, Pageable pageable) {
        Objects.requireNonNull(color, "Color cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding cats by color: {}", color);

        return catRepository.findByColor(color, pageable);
    }

    public Page<Cat> findBySex(Sex sex, Pageable pageable) {
        Objects.requireNonNull(sex, "Sex cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding cats by sex: {}", sex);

        return catRepository.findBySex(sex, pageable);
    }

    public Page<Cat> findByName(String name, Pageable pageable) {
        Objects.requireNonNull(name, "Name cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding cats by name containing: {}", name);

        return catRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Cat> findWithFilters(String name, Color color, Sex sex,
                                     CatAdoptionStatus adoptionStatus, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        String normalizedName = normalizeSearchName(name);
        log.debug("Finding cats with filters - name: {}, color: {}, sex: {}, adoptionStatus: {}",
                normalizedName, color, sex, adoptionStatus);

        return catRepository.findWithFilters(normalizedName, color, sex, adoptionStatus, pageable);
    }

    public long countByAdoptionStatus(CatAdoptionStatus adoptionStatus) {
        Objects.requireNonNull(adoptionStatus, "Adoption status cannot be null");
        log.debug("Counting cats by adoption status: {}", adoptionStatus);
        
        return catRepository.countByAdoptionStatus(adoptionStatus);
    }

    public long countAll() {
        log.debug("Counting all cats");
        return catRepository.count();
    }

    public List<CatSterilizationStatusDto> findCatsNeedingSterilization() {
        log.debug("Finding cats needing sterilization");

        int minimumAgeDays = propertiesService.getMinimumSterilizationAgeDays();
        List<Cat> cats = catRepository.findCatsNeedingSterilization(minimumAgeDays);
        LocalDateTime now = LocalDateTime.now();

        List<CatSterilizationStatusDto> result = cats.stream()
                .map(cat -> mapToCatSterilizationStatusDto(cat, now))
                .collect(Collectors.toList());

        log.info("Found {} cats needing sterilization", result.size());
        return result;
    }

    public Page<CatSterilizationStatusDto> findCatsNeedingSterilization(Pageable pageable) {
        log.debug("Finding cats needing sterilization with pagination");

        int minimumAgeDays = propertiesService.getMinimumSterilizationAgeDays();
        Page<Cat> cats = catRepository.findCatsNeedingSterilization(minimumAgeDays, pageable);
        LocalDateTime now = LocalDateTime.now();

        Page<CatSterilizationStatusDto> result = cats.map(cat -> mapToCatSterilizationStatusDto(cat, now));

        log.info("Found {} cats needing sterilization", result.getTotalElements());
        return result;
    }

    public SterilizationStatsDto getSterilizationStats() {
        log.debug("Calculating sterilization statistics");

        int minimumAgeDays = propertiesService.getMinimumSterilizationAgeDays();
        int overdueAgeDays = propertiesService.getOverdueSterilizationAgeDays();

        long eligibleCount = catRepository.countEligibleForSterilization(minimumAgeDays, overdueAgeDays);
        long overdueCount = catRepository.countOverdueForSterilization(overdueAgeDays);

        SterilizationStatsDto stats = new SterilizationStatsDto(eligibleCount, overdueCount);
        log.info("Sterilization stats calculated - eligible: {}, overdue: {}", eligibleCount, overdueCount);

        return stats;
    }

    private String normalizeSearchName(String name) {
        return (name != null && name.trim().isEmpty()) ? null : name;
    }

    private CatSterilizationStatusDto mapToCatSterilizationStatusDto(Cat cat, LocalDateTime referenceDate) {
        int ageInDays = calculateAgeInDays(cat.getBirthDate(), referenceDate);
        SterilizationEligibilityStatus status = determineEligibilityStatus(ageInDays);

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
    }

    private int calculateAgeInDays(LocalDateTime birthDate, LocalDateTime referenceDate) {
        if (birthDate == null) {
            return -1;
        }
        return (int) ChronoUnit.DAYS.between(birthDate, referenceDate);
    }

    private SterilizationEligibilityStatus determineEligibilityStatus(int ageInDays) {
        return ageInDays >= propertiesService.getOverdueSterilizationAgeDays() ?
                SterilizationEligibilityStatus.OVERDUE :
                SterilizationEligibilityStatus.ELIGIBLE;
    }
}
