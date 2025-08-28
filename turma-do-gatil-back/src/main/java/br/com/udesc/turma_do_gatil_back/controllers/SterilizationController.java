package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.services.SterilizationService;
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
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/sterilizations")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class SterilizationController {

    @Autowired
    private SterilizationService sterilizationService;

    @GetMapping
    public ResponseEntity<Page<Sterilization>> getAllSterilizations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sterilizationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) UUID catId,
            @RequestParam(required = false) SterilizationStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Sterilization> sterilizations;
        if (catId != null || status != null || startDate != null || endDate != null) {
            sterilizations = sterilizationService.findWithFilters(catId, status, startDate, endDate, pageable);
        } else {
            sterilizations = sterilizationService.findAll(pageable);
        }

        return ResponseEntity.ok(sterilizations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sterilization> getSterilizationById(@PathVariable UUID id) {
        Optional<Sterilization> sterilization = sterilizationService.findById(id);
        return sterilization.map(ResponseEntity::ok)
                           .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sterilization> createSterilization(@RequestBody Sterilization sterilization) {
        try {
            Sterilization savedSterilization = sterilizationService.save(sterilization);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedSterilization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sterilization> updateSterilization(@PathVariable UUID id, @RequestBody Sterilization sterilization) {
        try {
            Sterilization updatedSterilization = sterilizationService.update(id, sterilization);
            return ResponseEntity.ok(updatedSterilization);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSterilization(@PathVariable UUID id) {
        try {
            sterilizationService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cat/{catId}")
    public ResponseEntity<Page<Sterilization>> getSterilizationsByCatId(
            @PathVariable UUID catId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sterilizationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Sterilization> sterilizations = sterilizationService.findByCatId(catId, pageable);

        return ResponseEntity.ok(sterilizations);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Sterilization>> getSterilizationsByStatus(
            @PathVariable SterilizationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sterilizationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Sterilization> sterilizations = sterilizationService.findByStatus(status, pageable);

        return ResponseEntity.ok(sterilizations);
    }

    @GetMapping("/date-range")
    public ResponseEntity<Page<Sterilization>> getSterilizationsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "sterilizationDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Sterilization> sterilizations = sterilizationService.findByDateRange(startDate, endDate, pageable);

        return ResponseEntity.ok(sterilizations);
    }
}
