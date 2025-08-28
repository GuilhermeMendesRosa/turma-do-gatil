package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.repositories.AdoptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdoptionService {

    @Autowired
    private AdoptionRepository adoptionRepository;

    public Page<Adoption> findAll(Pageable pageable) {
        return adoptionRepository.findAll(pageable);
    }

    public Optional<Adoption> findById(UUID id) {
        return adoptionRepository.findById(id);
    }

    public Adoption save(Adoption adoption) {
        return adoptionRepository.save(adoption);
    }

    public Adoption update(UUID id, Adoption adoption) {
        if (!adoptionRepository.existsById(id)) {
            throw new RuntimeException("Adoption not found with id: " + id);
        }
        adoption.setId(id);
        return adoptionRepository.save(adoption);
    }

    public void deleteById(UUID id) {
        if (!adoptionRepository.existsById(id)) {
            throw new RuntimeException("Adoption not found with id: " + id);
        }
        adoptionRepository.deleteById(id);
    }

    public Page<Adoption> findByStatus(AdoptionStatus status, Pageable pageable) {
        return adoptionRepository.findByStatus(status, pageable);
    }

    public Page<Adoption> findByCatId(UUID catId, Pageable pageable) {
        return adoptionRepository.findByCatId(catId, pageable);
    }

    public Page<Adoption> findByAdopterId(UUID adopterId, Pageable pageable) {
        return adoptionRepository.findByAdopterId(adopterId, pageable);
    }

    public Page<Adoption> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return adoptionRepository.findByAdoptionDateBetween(startDate, endDate, pageable);
    }

    public List<Adoption> findByCatIdAndStatus(UUID catId, AdoptionStatus status) {
        return adoptionRepository.findByCatIdAndStatus(catId, status);
    }

    public Page<Adoption> findWithFilters(AdoptionStatus status, UUID catId, UUID adopterId,
                                         LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return adoptionRepository.findWithFilters(status, catId, adopterId, startDate, endDate, pageable);
    }
}
