package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.repositories.AdoptionRepository;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdoptionService {

    @Autowired
    private AdoptionRepository adoptionRepository;

    @Autowired
    private CatRepository catRepository;

    public Page<Adoption> findAll(Pageable pageable) {
        return adoptionRepository.findAll(pageable);
    }

    public Optional<Adoption> findById(UUID id) {
        return adoptionRepository.findById(id);
    }

    @Transactional
    public Adoption save(Adoption adoption) {
        Adoption savedAdoption = adoptionRepository.save(adoption);
        updateCatAdoptedStatus(adoption.getCatId());
        return savedAdoption;
    }

    @Transactional
    public Adoption update(UUID id, Adoption adoption) {
        if (!adoptionRepository.existsById(id)) {
            throw new RuntimeException("Adoption not found with id: " + id);
        }
        adoption.setId(id);
        Adoption updatedAdoption = adoptionRepository.save(adoption);
        updateCatAdoptedStatus(adoption.getCatId());
        return updatedAdoption;
    }

    @Transactional
    public void deleteById(UUID id) {
        Optional<Adoption> adoption = adoptionRepository.findById(id);
        if (adoption.isEmpty()) {
            throw new RuntimeException("Adoption not found with id: " + id);
        }

        UUID catId = adoption.get().getCatId();
        adoptionRepository.deleteById(id);

        // Recalcular o status do gato após deletar a adoção
        updateCatAdoptedStatus(catId);
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

    /**
     * Atualiza o status de adoção do gato baseado em todas as adoções existentes
     * @param catId ID do gato
     */
    private void updateCatAdoptedStatus(UUID catId) {
        Optional<Cat> catOptional = catRepository.findById(catId);
        if (catOptional.isPresent()) {
            Cat cat = catOptional.get();

            // Buscar adoções por status para este gato
            List<Adoption> completedAdoptions = adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.COMPLETED);
            List<Adoption> pendingAdoptions = adoptionRepository.findByCatIdAndStatus(catId, AdoptionStatus.PENDING);

            // Determinar o novo status baseado nas adoções
            CatAdoptionStatus newStatus;
            if (!completedAdoptions.isEmpty()) {
                newStatus = CatAdoptionStatus.ADOTADO;
            } else if (!pendingAdoptions.isEmpty()) {
                newStatus = CatAdoptionStatus.EM_PROCESSO;
            } else {
                newStatus = CatAdoptionStatus.NAO_ADOTADO;
            }

            // Só atualiza se o status for diferente do atual
            if (!cat.getAdoptionStatus().equals(newStatus)) {
                cat.setAdoptionStatus(newStatus);
                catRepository.save(cat);
            }
        }
    }
}
