package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.repositories.CatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

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

    public Page<Cat> findByAdopted(Boolean adopted, Pageable pageable) {
        return catRepository.findByAdopted(adopted, pageable);
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

    public Page<Cat> findWithFilters(String name, Color color, Sex sex, Boolean adopted, Pageable pageable) {
        return catRepository.findWithFilters(name, color, sex, adopted, pageable);
    }
}
