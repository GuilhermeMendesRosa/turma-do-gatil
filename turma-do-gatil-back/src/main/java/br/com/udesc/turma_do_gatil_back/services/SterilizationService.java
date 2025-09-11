package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.exceptions.SterilizationNotFoundException;
import br.com.udesc.turma_do_gatil_back.repositories.SterilizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class SterilizationService {

    private final SterilizationRepository sterilizationRepository;

    /**
     * Retrieves all sterilizations with pagination support.
     */
    public Page<Sterilization> findAll(Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding all sterilizations with pageable: {}", pageable);
        return sterilizationRepository.findAll(pageable);
    }

    /**
     * Finds a sterilization by its ID.
     */
    public Optional<Sterilization> findById(UUID id) {
        Objects.requireNonNull(id, "ID cannot be null");
        log.debug("Finding sterilization by id: {}", id);
        return sterilizationRepository.findById(id);
    }

    /**
     * Saves a new sterilization record.
     */
    public Sterilization save(Sterilization sterilization) {
        Objects.requireNonNull(sterilization, "Sterilization cannot be null");
        validateSterilization(sterilization);
        
        log.info("Saving new sterilization for cat: {} with status: {}", 
                sterilization.getCatId(), sterilization.getStatus());
        
        Sterilization savedSterilization = sterilizationRepository.save(sterilization);
        log.debug("Sterilization saved with id: {}", savedSterilization.getId());
        return savedSterilization;
    }

    /**
     * Updates an existing sterilization record.
     */
    public Sterilization update(UUID id, Sterilization sterilization) {
        Objects.requireNonNull(id, "ID cannot be null");
        Objects.requireNonNull(sterilization, "Sterilization cannot be null");
        validateSterilization(sterilization);

        log.info("Updating sterilization with id: {}", id);
        
        if (!existsById(id)) {
            throw new SterilizationNotFoundException(id);
        }
        
        sterilization.setId(id);
        Sterilization updatedSterilization = sterilizationRepository.save(sterilization);
        log.debug("Sterilization updated successfully: {}", id);
        return updatedSterilization;
    }

    /**
     * Deletes a sterilization by its ID.
     */
    public void deleteById(UUID id) {
        Objects.requireNonNull(id, "ID cannot be null");
        log.info("Deleting sterilization with id: {}", id);
        
        if (!existsById(id)) {
            throw new SterilizationNotFoundException(id);
        }
        
        sterilizationRepository.deleteById(id);
        log.debug("Sterilization deleted successfully: {}", id);
    }

    public Page<Sterilization> findByCatId(UUID catId, Pageable pageable) {
        Objects.requireNonNull(catId, "Cat ID cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding sterilizations by cat id: {}", catId);
        return sterilizationRepository.findByCatId(catId, pageable);
    }

    public Page<Sterilization> findByStatus(SterilizationStatus status, Pageable pageable) {
        Objects.requireNonNull(status, "Status cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        log.debug("Finding sterilizations by status: {}", status);
        return sterilizationRepository.findByStatus(status, pageable);
    }

    public Page<Sterilization> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(startDate, "Start date cannot be null");
        Objects.requireNonNull(endDate, "End date cannot be null");
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        
        validateDateRange(startDate, endDate);
        log.debug("Finding sterilizations by date range: {} to {}", startDate, endDate);
        return sterilizationRepository.findBySterilizationDateBetween(startDate, endDate, pageable);
    }

    public Page<Sterilization> findWithFilters(UUID catId, SterilizationStatus status,
                                              LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");
        
        if (startDate != null && endDate != null) {
            validateDateRange(startDate, endDate);
        }
        
        log.debug("Finding sterilizations with filters - catId: {}, status: {}, dateRange: {} to {}", 
                catId, status, startDate, endDate);
        return sterilizationRepository.findWithFilters(catId, status, startDate, endDate, pageable);
    }

    private boolean existsById(UUID id) {
        return sterilizationRepository.existsById(id);
    }

    private void validateSterilization(Sterilization sterilization) {
        Objects.requireNonNull(sterilization.getCatId(), "Cat ID cannot be null");
        Objects.requireNonNull(sterilization.getSterilizationDate(), "Sterilization date cannot be null");
        Objects.requireNonNull(sterilization.getStatus(), "Status cannot be null");
        
        if (sterilization.getSterilizationDate().isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Sterilization date cannot be in the future");
        }
        
        if (sterilization.getNotes() != null && sterilization.getNotes().trim().length() > 1000) {
            throw new IllegalArgumentException("Notes cannot exceed 1000 characters");
        }
    }

    private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date cannot be before start date");
        }
    }
}
