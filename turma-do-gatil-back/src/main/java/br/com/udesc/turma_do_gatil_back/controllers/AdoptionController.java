package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.AdoptionDto;
import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
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
@CrossOrigin(origins = "*")
public class AdoptionController {

    @Autowired
    private AdoptionService adoptionService;

    @GetMapping
    public ResponseEntity<Page<AdoptionDto>> getAllAdoptions(
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

        Page<AdoptionDto> adoptionsDto = EntityMapper.toPage(adoptions, EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdoptionDto> getAdoptionById(@PathVariable UUID id) {
        Optional<Adoption> adoption = adoptionService.findById(id);
        return adoption.map(a -> ResponseEntity.ok(EntityMapper.toAdoptionDto(a)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AdoptionDto> createAdoption(@RequestBody AdoptionDto adoptionDto) {
        try {
            Adoption adoption = EntityMapper.toAdoptionEntity(adoptionDto);
            Adoption savedAdoption = adoptionService.save(adoption);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toAdoptionDto(savedAdoption));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdoptionDto> updateAdoption(@PathVariable UUID id, @RequestBody AdoptionDto adoptionDto) {
        try {
            Adoption adoption = EntityMapper.toAdoptionEntity(adoptionDto);
            Adoption updatedAdoption = adoptionService.update(id, adoption);
            return ResponseEntity.ok(EntityMapper.toAdoptionDto(updatedAdoption));
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

    @GetMapping("/cat/{catId}")
    public ResponseEntity<List<AdoptionDto>> getAdoptionsByCatId(@PathVariable UUID catId) {
        // Como o serviço retorna Page, vamos usar paginação com valores padrão
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Adoption> adoptionsPage = adoptionService.findByCatId(catId, pageable);
        List<AdoptionDto> adoptionsDto = EntityMapper.toList(adoptionsPage.getContent(), EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @GetMapping("/adopter/{adopterId}")
    public ResponseEntity<List<AdoptionDto>> getAdoptionsByAdopterId(@PathVariable UUID adopterId) {
        // Como o serviço retorna Page, vamos usar paginação com valores padrão
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Adoption> adoptionsPage = adoptionService.findByAdopterId(adopterId, pageable);
        List<AdoptionDto> adoptionsDto = EntityMapper.toList(adoptionsPage.getContent(), EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<AdoptionDto>> getAdoptionsByStatus(
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
        Page<AdoptionDto> adoptionsDto = EntityMapper.toPage(adoptions, EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }
}
