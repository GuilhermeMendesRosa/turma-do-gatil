package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.services.AdoptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/adoptions")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class AdoptionController {

    @Autowired
    private AdoptionService adoptionService;

    @GetMapping
    public ResponseEntity<Page<Adoption>> getAllAdoptions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) AdoptionStatus status,
            @RequestParam(required = false) UUID catId,
            @RequestParam(required = false) UUID adopterId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Adoption> adoptions;
        if (status != null || catId != null || adopterId != null || startDate != null || endDate != null) {
            adoptions = adoptionService.findWithFilters(status, catId, adopterId, startDate, endDate, pageable);
        } else {
            adoptions = adoptionService.findAll(pageable);
        }

        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Adoption> getAdoptionById(@PathVariable UUID id) {
        Optional<Adoption> adoption = adoptionService.findById(id);
        return adoption.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Adoption> createAdoption(@RequestBody Adoption adoption) {
        try {
            Adoption savedAdoption = adoptionService.save(adoption);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAdoption);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Adoption> updateAdoption(@PathVariable UUID id, @RequestBody Adoption adoption) {
        try {
            Adoption updatedAdoption = adoptionService.update(id, adoption);
            return ResponseEntity.ok(updatedAdoption);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoption(@PathVariable UUID id) {
        try {
            adoptionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Adoption>> getAdoptionsByStatus(
            @PathVariable AdoptionStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Adoption> adoptions = adoptionService.findByStatus(status, pageable);

        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/cat/{catId}")
    public ResponseEntity<Page<Adoption>> getAdoptionsByCatId(
            @PathVariable UUID catId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Adoption> adoptions = adoptionService.findByCatId(catId, pageable);

        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/adopter/{adopterId}")
    public ResponseEntity<Page<Adoption>> getAdoptionsByAdopterId(
            @PathVariable UUID adopterId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Adoption> adoptions = adoptionService.findByAdopterId(adopterId, pageable);

        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/cat/{catId}/status/{status}")
    public ResponseEntity<List<Adoption>> getAdoptionsByCatIdAndStatus(
            @PathVariable UUID catId,
            @PathVariable AdoptionStatus status) {

        List<Adoption> adoptions = adoptionService.findByCatIdAndStatus(catId, status);
        return ResponseEntity.ok(adoptions);
    }
}
