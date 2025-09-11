package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.exceptions.AdopterNotFoundException;
import br.com.udesc.turma_do_gatil_back.exceptions.CpfAlreadyExistsException;
import br.com.udesc.turma_do_gatil_back.exceptions.EmailAlreadyExistsException;
import br.com.udesc.turma_do_gatil_back.repositories.AdopterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdopterService {

    private final AdopterRepository adopterRepository;

    public Page<Adopter> findAll(Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding all adopters with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Adopter> result = adopterRepository.findAll(pageable);

        log.debug("Found {} adopters", result.getTotalElements());
        return result;
    }

    public Optional<Adopter> findById(UUID id) {
        Objects.requireNonNull(id, "Adopter ID cannot be null");

        log.debug("Finding adopter by id: {}", id);

        Optional<Adopter> result = adopterRepository.findById(id);

        if (result.isPresent()) {
            log.debug("Found adopter with id: {}", id);
        } else {
            log.debug("No adopter found with id: {}", id);
        }

        return result;
    }

    public Optional<Adopter> findByCpf(String cpf) {
        Objects.requireNonNull(cpf, "CPF cannot be null");

        log.debug("Finding adopter by CPF: {}", maskCpf(cpf));

        Optional<Adopter> result = adopterRepository.findByCpf(cpf);

        if (result.isPresent()) {
            log.debug("Found adopter with CPF: {}", maskCpf(cpf));
        } else {
            log.debug("No adopter found with CPF: {}", maskCpf(cpf));
        }

        return result;
    }

    public Optional<Adopter> findByEmail(String email) {
        Objects.requireNonNull(email, "Email cannot be null");

        log.debug("Finding adopter by email: {}", maskEmail(email));

        Optional<Adopter> result = adopterRepository.findByEmail(email);

        if (result.isPresent()) {
            log.debug("Found adopter with email: {}", maskEmail(email));
        } else {
            log.debug("No adopter found with email: {}", maskEmail(email));
        }

        return result;
    }

    public Adopter save(Adopter adopter) {
        Objects.requireNonNull(adopter, "Adopter cannot be null");
        Objects.requireNonNull(adopter.getCpf(), "CPF cannot be null");
        Objects.requireNonNull(adopter.getEmail(), "Email cannot be null");

        log.info("Saving new adopter with CPF: {} and email: {}",
                maskCpf(adopter.getCpf()), maskEmail(adopter.getEmail()));

        validateCpfNotExists(adopter.getCpf());
        validateEmailNotExists(adopter.getEmail());

        Adopter savedAdopter = adopterRepository.save(adopter);

        log.info("Successfully saved adopter with id: {}", savedAdopter.getId());
        return savedAdopter;
    }

    public Adopter update(UUID id, Adopter adopter) {
        Objects.requireNonNull(id, "Adopter ID cannot be null");
        Objects.requireNonNull(adopter, "Adopter cannot be null");
        Objects.requireNonNull(adopter.getCpf(), "CPF cannot be null");
        Objects.requireNonNull(adopter.getEmail(), "Email cannot be null");

        log.info("Updating adopter with id: {}", id);

        validateAdopterExists(id);
        validateCpfNotExistsForOtherAdopter(adopter.getCpf(), id);
        validateEmailNotExistsForOtherAdopter(adopter.getEmail(), id);

        adopter.setId(id);
        Adopter updatedAdopter = adopterRepository.save(adopter);

        log.info("Successfully updated adopter with id: {}", id);
        return updatedAdopter;
    }

    public void deleteById(UUID id) {
        Objects.requireNonNull(id, "Adopter ID cannot be null");

        log.info("Deleting adopter with id: {}", id);

        validateAdopterExists(id);
        adopterRepository.deleteById(id);

        log.info("Successfully deleted adopter with id: {}", id);
    }

    public Page<Adopter> findByName(String name, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        if (!StringUtils.hasText(name)) {
            log.debug("Empty name provided, returning empty page");
            return Page.empty(pageable);
        }

        log.debug("Finding adopters by name containing: {}", name);

        Page<Adopter> result = adopterRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                name, name, pageable);

        log.debug("Found {} adopters matching name: {}", result.getTotalElements(), name);
        return result;
    }

    public Page<Adopter> findByEmailContaining(String email, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        if (!StringUtils.hasText(email)) {
            log.debug("Empty email provided, returning empty page");
            return Page.empty(pageable);
        }

        log.debug("Finding adopters by email containing: {}", maskEmail(email));

        Page<Adopter> result = adopterRepository.findByEmailContainingIgnoreCase(email, pageable);

        log.debug("Found {} adopters matching email pattern", result.getTotalElements());
        return result;
    }

    public Page<Adopter> findWithFilters(String name, String email, String cpf, Pageable pageable) {
        Objects.requireNonNull(pageable, "Pageable cannot be null");

        log.debug("Finding adopters with filters - name: {}, email: {}, cpf: {}",
                name, maskEmail(email), maskCpf(cpf));

        Page<Adopter> result = adopterRepository.findWithFilters(name, email, cpf, pageable);

        log.debug("Found {} adopters matching filters", result.getTotalElements());
        return result;
    }

    private void validateAdopterExists(UUID id) {
        if (!adopterRepository.existsById(id)) {
            String message = String.format("Adopter not found with id: %s", id);
            log.warn(message);
            throw new AdopterNotFoundException(message);
        }
    }

    private void validateCpfNotExists(String cpf) {
        if (adopterRepository.findByCpf(cpf).isPresent()) {
            String message = String.format("CPF already registered: %s", maskCpf(cpf));
            log.warn(message);
            throw new CpfAlreadyExistsException(message);
        }
    }

    private void validateEmailNotExists(String email) {
        if (adopterRepository.findByEmail(email).isPresent()) {
            String message = String.format("Email already registered: %s", maskEmail(email));
            log.warn(message);
            throw new EmailAlreadyExistsException(message);
        }
    }

    private void validateCpfNotExistsForOtherAdopter(String cpf, UUID currentAdopterId) {
        Optional<Adopter> existingByCpf = adopterRepository.findByCpf(cpf);
        if (existingByCpf.isPresent() && !existingByCpf.get().getId().equals(currentAdopterId)) {
            String message = String.format("CPF already registered for another adopter: %s", maskCpf(cpf));
            log.warn(message);
            throw new CpfAlreadyExistsException(message);
        }
    }

    private void validateEmailNotExistsForOtherAdopter(String email, UUID currentAdopterId) {
        Optional<Adopter> existingByEmail = adopterRepository.findByEmail(email);
        if (existingByEmail.isPresent() && !existingByEmail.get().getId().equals(currentAdopterId)) {
            String message = String.format("Email already registered for another adopter: %s", maskEmail(email));
            log.warn(message);
            throw new EmailAlreadyExistsException(message);
        }
    }

    private String maskCpf(String cpf) {
        if (cpf == null || cpf.length() < 6) {
            return "***";
        }
        return cpf.substring(0, 3) + "***" + cpf.substring(cpf.length() - 2);
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        String[] parts = email.split("@");
        if (parts[0].length() <= 2) {
            return "***@" + parts[1];
        }
        return parts[0].substring(0, 2) + "***@" + parts[1];
    }
}
