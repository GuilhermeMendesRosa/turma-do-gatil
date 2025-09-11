package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.SterilizationDto;
import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.SterilizationService;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/sterilizations")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RequiredArgsConstructor
public class SterilizationController {

    private final SterilizationService sterilizationService;

    @GetMapping
    public ResponseEntity<Page<SterilizationDto>> getAllSterilizations(
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

        Page<SterilizationDto> sterilizationsDto = EntityMapper.toPage(sterilizations, EntityMapper::toSterilizationDto);
        return ResponseEntity.ok(sterilizationsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SterilizationDto> getSterilizationById(@PathVariable UUID id) {
        Optional<Sterilization> sterilization = sterilizationService.findById(id);
        return sterilization.map(s -> ResponseEntity.ok(EntityMapper.toSterilizationDto(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SterilizationDto> createSterilization(@RequestBody SterilizationDto sterilizationDto) {
        try {
            Sterilization sterilization = EntityMapper.toSterilizationEntity(sterilizationDto);
            Sterilization savedSterilization = sterilizationService.save(sterilization);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toSterilizationDto(savedSterilization));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SterilizationDto> updateSterilization(@PathVariable UUID id, @RequestBody SterilizationDto sterilizationDto) {
        try {
            Sterilization sterilization = EntityMapper.toSterilizationEntity(sterilizationDto);
            Sterilization updatedSterilization = sterilizationService.update(id, sterilization);
            return ResponseEntity.ok(EntityMapper.toSterilizationDto(updatedSterilization));
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
    public ResponseEntity<List<SterilizationDto>> getSterilizationsByCatId(@PathVariable UUID catId) {
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Sterilization> sterilizationsPage = sterilizationService.findByCatId(catId, pageable);
        List<SterilizationDto> sterilizationsDto = EntityMapper.toList(sterilizationsPage.getContent(), EntityMapper::toSterilizationDto);
        return ResponseEntity.ok(sterilizationsDto);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<SterilizationDto>> getSterilizationsByStatus(
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
        Page<SterilizationDto> sterilizationsDto = EntityMapper.toPage(sterilizations, EntityMapper::toSterilizationDto);
        return ResponseEntity.ok(sterilizationsDto);
    }
}
