package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.*;
import br.com.udesc.turma_do_gatil_back.entities.Adopter;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.entities.Sterilization;
import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.AdopterService;
import br.com.udesc.turma_do_gatil_back.services.CatService;
import br.com.udesc.turma_do_gatil_back.services.SterilizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/cats")
@CrossOrigin(origins = "*")
public class CatController {

    @Autowired
    private CatService catService;

    @Autowired
    private SterilizationService sterilizationService;

    @Autowired
    private AdopterService adopterService;

    @GetMapping
    public ResponseEntity<Page<CatDto>> getAllCats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Color color,
            @RequestParam(required = false) Sex sex,
            @RequestParam(required = false) CatAdoptionStatus adoptionStatus) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Cat> cats = catService.findWithFilters(name, color, sex, adoptionStatus, pageable);
        Page<CatDto> catDtos = cats.map(EntityMapper::toCatDto);

        return ResponseEntity.ok(catDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CatDto> getCatById(@PathVariable UUID id) {
        Optional<Cat> cat = catService.findById(id);
        if (cat.isPresent()) {
            CatDto catDto = EntityMapper.toCatDto(cat.get());
            return ResponseEntity.ok(catDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<CatDto> createCat(@RequestBody CatDto catDto) {
        Cat cat = EntityMapper.toCatEntity(catDto);
        Cat savedCat = catService.save(cat);
        CatDto savedCatDto = EntityMapper.toCatDto(savedCat);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCatDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CatDto> updateCat(@PathVariable UUID id, @RequestBody CatDto catDto) {
        if (!catService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Cat cat = EntityMapper.toCatEntity(catDto);
        cat.setId(id);
        Cat savedCat = catService.save(cat);
        CatDto savedCatDto = EntityMapper.toCatDto(savedCat);
        return ResponseEntity.ok(savedCatDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable UUID id) {
        if (!catService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        catService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/needing-sterilization")
    public ResponseEntity<List<CatSterilizationStatusDto>> getCatsNeedingSterilization() {
        try {
            List<CatSterilizationStatusDto> cats = catService.findCatsNeedingSterilization();
            return ResponseEntity.ok(cats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/sterilization-stats")
    public ResponseEntity<SterilizationStatsDto> getSterilizationStats() {
        try {
            SterilizationStatsDto stats = catService.getSterilizationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardSummaryDto> getDashboardSummary() {
        try {
            // Buscar os primeiros 10 gatos disponíveis para adoção
            Pageable catsPageable = PageRequest.of(0, 10, Sort.by("name").ascending());
            Page<Cat> availableCatsPage = catService.findWithFilters(null, null, null, CatAdoptionStatus.NAO_ADOTADO, catsPageable);
            List<CatDto> availableCats = availableCatsPage.getContent()
                    .stream()
                    .map(EntityMapper::toCatDto)
                    .toList();

            // Buscar as primeiras 10 castrações pendentes
            Pageable sterilizationsPageable = PageRequest.of(0, 10, Sort.by("sterilizationDate").ascending());
            Page<Sterilization> pendingSterilizationsPage = sterilizationService.findByStatus(SterilizationStatus.SCHEDULED, sterilizationsPageable);
            List<SterilizationDto> pendingSterilizations = pendingSterilizationsPage.getContent()
                    .stream()
                    .map(EntityMapper::toSterilizationDto)
                    .toList();

            // Buscar os 10 adotantes mais recentes
            Pageable adoptersPageable = PageRequest.of(0, 10, Sort.by("registrationDate").descending());
            Page<Adopter> registeredAdoptersPage = adopterService.findAll(adoptersPageable);
            List<AdopterDto> registeredAdopters = registeredAdoptersPage.getContent()
                    .stream()
                    .map(EntityMapper::toAdopterDto)
                    .toList();

            DashboardSummaryDto summary = new DashboardSummaryDto(
                    availableCats,
                    pendingSterilizations,
                    registeredAdopters
            );

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
