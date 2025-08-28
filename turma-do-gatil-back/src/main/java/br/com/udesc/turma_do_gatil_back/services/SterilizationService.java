package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.repositories.SterilizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class SterilizationService {

    @Autowired
    private SterilizationRepository sterilizationRepository;

    public Page<Sterilization> findAll(Pageable pageable) {
        return sterilizationRepository.findAll(pageable);
    }

    public Optional<Sterilization> findById(UUID id) {
        return sterilizationRepository.findById(id);
    }

    public Sterilization save(Sterilization sterilization) {
        return sterilizationRepository.save(sterilization);
    }

    public Sterilization update(UUID id, Sterilization sterilization) {
        if (!sterilizationRepository.existsById(id)) {
            throw new RuntimeException("Sterilization not found with id: " + id);
        }
        sterilization.setId(id);
        return sterilizationRepository.save(sterilization);
    }

    public void deleteById(UUID id) {
        if (!sterilizationRepository.existsById(id)) {
            throw new RuntimeException("Sterilization not found with id: " + id);
        }
        sterilizationRepository.deleteById(id);
    }

    public Page<Sterilization> findByCatId(UUID catId, Pageable pageable) {
        return sterilizationRepository.findByCatId(catId, pageable);
    }

    public Page<Sterilization> findByStatus(SterilizationStatus status, Pageable pageable) {
        return sterilizationRepository.findByStatus(status, pageable);
    }

    public Page<Sterilization> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return sterilizationRepository.findBySterilizationDateBetween(startDate, endDate, pageable);
    }

    public Page<Sterilization> findWithFilters(UUID catId, SterilizationStatus status,
                                              LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return sterilizationRepository.findWithFilters(catId, status, startDate, endDate, pageable);
    }
}
