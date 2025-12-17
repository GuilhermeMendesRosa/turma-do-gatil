package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.exceptions.AdoptionNotFoundException;
import br.com.udesc.turma_do_gatil_back.exceptions.CatAlreadyInAdoptionProcessException;
import br.com.udesc.turma_do_gatil_back.repositories.AdoptionRepository;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdoptionService {

    private final AdoptionRepository adoptionRepository;
    private final CatRepository catRepository;

    public Page<Adoption> findAll(Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding all adoptions with pagination - page: {}, size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Adoption> adoptions = adoptionRepository.findAll(pageable);

        log.debug("Found {} adoptions", adoptions.getTotalElements());
        return adoptions;
    }

    public Optional<Adoption> findById(UUID id) {
        Objects.requireNonNull(id, "Adoption ID cannot be null");

        log.debug("Finding adoption by ID: {}", id);

        Optional<Adoption> adoption = adoptionRepository.findById(id);

        if (adoption.isPresent()) {
            log.debug("Found adoption with ID: {}", id);
        } else {
            log.debug("No adoption found with ID: {}", id);
        }

        return adoption;
    }

    @Transactional
    public Adoption save(Adoption adoption) {
        Objects.requireNonNull(adoption, "Adoption cannot be null");
        Objects.requireNonNull(adoption.getCatId(), "Cat ID cannot be null");
        Objects.requireNonNull(adoption.getAdopterId(), "Adopter ID cannot be null");
        Objects.requireNonNull(adoption.getStatus(), "Adoption status cannot be null");

        log.info("Creating new adoption for cat ID: {} and adopter ID: {} with status: {}", adoption.getCatId(), adoption.getAdopterId(), adoption.getStatus());

        Optional<Cat> catOptional = catRepository.findById(adoption.getCatId());
        if (catOptional.isEmpty()) {
            throw new RuntimeException("Cat not found with id: " + adoption.getCatId());
        }
        Cat cat = catOptional.get();
        if (cat.getAdoptionStatus() == CatAdoptionStatus.EM_PROCESSO || cat.getAdoptionStatus() == CatAdoptionStatus.ADOTADO) {
            throw new CatAlreadyInAdoptionProcessException("Cat is already in adoption process or adopted");
        }


        Adoption savedAdoption = adoptionRepository.save(adoption);
        updateCatAdoptionStatus(adoption.getCatId());

        log.info("Successfully created adoption with ID: {}", savedAdoption.getId());
        return savedAdoption;
    }

    @Transactional
    public Adoption update(UUID id, Adoption adoption) {
        Objects.requireNonNull(id, "Adoption ID cannot be null");
        Objects.requireNonNull(adoption, "Adoption cannot be null");
        Objects.requireNonNull(adoption.getCatId(), "Cat ID cannot be null");
        Objects.requireNonNull(adoption.getAdopterId(), "Adopter ID cannot be null");
        Objects.requireNonNull(adoption.getStatus(), "Adoption status cannot be null");

        log.info("Updating adoption with ID: {}", id);

        if (!adoptionRepository.existsById(id)) {
            log.warn("Attempted to update non-existent adoption with ID: {}", id);
            throw new AdoptionNotFoundException("Adoption not found with id: " + id);
        }

        adoption.setId(id);
        Adoption updatedAdoption = adoptionRepository.save(adoption);
        updateCatAdoptionStatus(adoption.getCatId());

        log.info("Successfully updated adoption with ID: {}", id);
        return updatedAdoption;
    }

    @Transactional
    public void deleteById(UUID id) {
        Objects.requireNonNull(id, "Adoption ID cannot be null");

        log.info("Deleting adoption with ID: {}", id);

        Adoption adoption = adoptionRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Attempted to delete non-existent adoption with ID: {}", id);
                    return new AdoptionNotFoundException("Adoption not found with id: " + id);
                });

        UUID catId = adoption.getCatId();
        adoptionRepository.deleteById(id);
        updateCatAdoptionStatus(catId);

        log.info("Successfully deleted adoption with ID: {} for cat ID: {}", id, catId);
    }

    public Page<Adoption> findByStatus(AdoptionStatus status, Pageable pageable) {
        Objects.requireNonNull(status, "Adoption status cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding adoptions by status: {}", status);

        Page<Adoption> adoptions = adoptionRepository.findByStatus(status, pageable);

        log.debug("Found {} adoptions with status: {}", adoptions.getTotalElements(), status);
        return adoptions;
    }

    public Page<Adoption> findByCatId(UUID catId, Pageable pageable) {
        Objects.requireNonNull(catId, "Cat ID cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding adoptions by cat ID: {}", catId);

        Page<Adoption> adoptions = adoptionRepository.findByCatId(catId, pageable);

        log.debug("Found {} adoptions for cat ID: {}", adoptions.getTotalElements(), catId);
        return adoptions;
    }

    public Page<Adoption> findByAdopterId(UUID adopterId, Pageable pageable) {
        Objects.requireNonNull(adopterId, "Adopter ID cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding adoptions by adopter ID: {}", adopterId);

        Page<Adoption> adoptions = adoptionRepository.findByAdopterId(adopterId, pageable);

        log.debug("Found {} adoptions for adopter ID: {}", adoptions.getTotalElements(), adopterId);
        return adoptions;
    }

    public Page<Adoption> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(startDate, "Start date cannot be null");
        Objects.requireNonNull(endDate, "End date cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        log.debug("Finding adoptions between dates: {} and {}", startDate, endDate);

        Page<Adoption> adoptions = adoptionRepository.findByAdoptionDateBetween(startDate, endDate, pageable);

        log.debug("Found {} adoptions between dates", adoptions.getTotalElements());
        return adoptions;
    }

    public List<Adoption> findByCatIdAndStatus(UUID catId, AdoptionStatus status) {
        Objects.requireNonNull(catId, "Cat ID cannot be null");
        Objects.requireNonNull(status, "Adoption status cannot be null");

        log.debug("Finding adoptions for cat ID: {} with status: {}", catId, status);

        List<Adoption> adoptions = adoptionRepository.findByCatIdAndStatus(catId, status);

        log.debug("Found {} adoptions for cat ID: {} with status: {}", adoptions.size(), catId, status);
        return adoptions;
    }

    public Page<Adoption> findWithFilters(AdoptionStatus status, UUID catId, UUID adopterId,
                                          String catName, String adopterName,
                                          LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        log.debug("Finding adoptions with filters - status: {}, catId: {}, adopterId: {}, catName: {}, adopterName: {}, dateRange: {} to {}",
                status, catId, adopterId, catName, adopterName, startDate, endDate);

        Page<Adoption> adoptions = adoptionRepository.findWithFilters(status, catId, adopterId, catName, adopterName, startDate, endDate, pageable);

        log.debug("Found {} adoptions with applied filters", adoptions.getTotalElements());
        return adoptions;
    }

    private void updateCatAdoptionStatus(UUID catId) {
        Objects.requireNonNull(catId, "Cat ID cannot be null");

        log.debug("Updating adoption status for cat ID: {}", catId);

        Optional<Cat> catOptional = catRepository.findById(catId);
        if (catOptional.isEmpty()) {
            log.warn("Cat not found with ID: {} when updating adoption status", catId);
            return;
        }

        Cat cat = catOptional.get();
        CatAdoptionStatus currentStatus = cat.getAdoptionStatus();
        CatAdoptionStatus newStatus = calculateCatAdoptionStatus(catId);

        if (!currentStatus.equals(newStatus)) {
            cat.setAdoptionStatus(newStatus);
            catRepository.save(cat);

            log.info("Updated cat ID: {} adoption status from {} to {}",
                    catId, currentStatus, newStatus);
        } else {
            log.debug("Cat ID: {} adoption status remains unchanged: {}", catId, currentStatus);
        }
    }

    private CatAdoptionStatus calculateCatAdoptionStatus(UUID catId) {
        boolean hasCompletedAdoptions = hasAdoptionsWithStatus(catId, AdoptionStatus.COMPLETED);
        if (hasCompletedAdoptions) {
            return CatAdoptionStatus.ADOTADO;
        }

        boolean hasPendingAdoptions = hasAdoptionsWithStatus(catId, AdoptionStatus.PENDING);
        if (hasPendingAdoptions) {
            return CatAdoptionStatus.EM_PROCESSO;
        }

        return CatAdoptionStatus.NAO_ADOTADO;
    }

    private boolean hasAdoptionsWithStatus(UUID catId, AdoptionStatus status) {
        List<Adoption> adoptions = adoptionRepository.findByCatIdAndStatus(catId, status);
        return !adoptions.isEmpty();
    }
}
