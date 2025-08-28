package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.AdopterDto;
import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.AdopterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/adopters")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class AdopterController {

    @Autowired
    private AdopterService adopterService;

    @GetMapping
    public ResponseEntity<Page<AdopterDto>> getAllAdopters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String cpf) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Adopter> adopters;
        if (name != null || email != null || cpf != null) {
            adopters = adopterService.findWithFilters(name, email, cpf, pageable);
        } else {
            adopters = adopterService.findAll(pageable);
        }

        Page<AdopterDto> adoptersDto = EntityMapper.toPage(adopters, EntityMapper::toAdopterDto);
        return ResponseEntity.ok(adoptersDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdopterDto> getAdopterById(@PathVariable UUID id) {
        Optional<Adopter> adopter = adopterService.findById(id);
        return adopter.map(a -> ResponseEntity.ok(EntityMapper.toAdopterDto(a)))
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<AdopterDto> getAdopterByCpf(@PathVariable String cpf) {
        Optional<Adopter> adopter = adopterService.findByCpf(cpf);
        return adopter.map(a -> ResponseEntity.ok(EntityMapper.toAdopterDto(a)))
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AdopterDto> getAdopterByEmail(@PathVariable String email) {
        Optional<Adopter> adopter = adopterService.findByEmail(email);
        return adopter.map(a -> ResponseEntity.ok(EntityMapper.toAdopterDto(a)))
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAdopter(@RequestBody AdopterDto adopterDto) {
        try {
            Adopter adopter = EntityMapper.toAdopterEntity(adopterDto);
            Adopter savedAdopter = adopterService.save(adopter);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toAdopterDto(savedAdopter));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdopter(@PathVariable UUID id, @RequestBody AdopterDto adopterDto) {
        try {
            Adopter adopter = EntityMapper.toAdopterEntity(adopterDto);
            Adopter updatedAdopter = adopterService.update(id, adopter);
            return ResponseEntity.ok(EntityMapper.toAdopterDto(updatedAdopter));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdopter(@PathVariable UUID id) {
        try {
            adopterService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
