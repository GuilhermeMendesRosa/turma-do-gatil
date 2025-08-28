package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.repositories.AdopterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AdopterService {

    @Autowired
    private AdopterRepository adopterRepository;

    public Page<Adopter> findAll(Pageable pageable) {
        return adopterRepository.findAll(pageable);
    }

    public Optional<Adopter> findById(UUID id) {
        return adopterRepository.findById(id);
    }

    public Optional<Adopter> findByCpf(String cpf) {
        return adopterRepository.findByCpf(cpf);
    }

    public Optional<Adopter> findByEmail(String email) {
        return adopterRepository.findByEmail(email);
    }

    public Adopter save(Adopter adopter) {
        // Verificar se CPF já existe
        if (adopterRepository.findByCpf(adopter.getCpf()).isPresent()) {
            throw new RuntimeException("CPF já cadastrado: " + adopter.getCpf());
        }
        // Verificar se email já existe
        if (adopterRepository.findByEmail(adopter.getEmail()).isPresent()) {
            throw new RuntimeException("Email já cadastrado: " + adopter.getEmail());
        }
        return adopterRepository.save(adopter);
    }

    public Adopter update(UUID id, Adopter adopter) {
        if (!adopterRepository.existsById(id)) {
            throw new RuntimeException("Adopter not found with id: " + id);
        }

        // Verificar se CPF já existe para outro adotante
        Optional<Adopter> existingByCpf = adopterRepository.findByCpf(adopter.getCpf());
        if (existingByCpf.isPresent() && !existingByCpf.get().getId().equals(id)) {
            throw new RuntimeException("CPF já cadastrado para outro adotante: " + adopter.getCpf());
        }

        // Verificar se email já existe para outro adotante
        Optional<Adopter> existingByEmail = adopterRepository.findByEmail(adopter.getEmail());
        if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(id)) {
            throw new RuntimeException("Email já cadastrado para outro adotante: " + adopter.getEmail());
        }

        adopter.setId(id);
        return adopterRepository.save(adopter);
    }

    public void deleteById(UUID id) {
        if (!adopterRepository.existsById(id)) {
            throw new RuntimeException("Adopter not found with id: " + id);
        }
        adopterRepository.deleteById(id);
    }

    public Page<Adopter> findByName(String name, Pageable pageable) {
        return adopterRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                name, name, pageable);
    }

    public Page<Adopter> findByEmailContaining(String email, Pageable pageable) {
        return adopterRepository.findByEmailContainingIgnoreCase(email, pageable);
    }

    public Page<Adopter> findWithFilters(String name, String email, String cpf, Pageable pageable) {
        return adopterRepository.findWithFilters(name, email, cpf, pageable);
    }
}
