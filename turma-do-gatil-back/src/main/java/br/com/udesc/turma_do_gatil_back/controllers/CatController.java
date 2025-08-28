package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.CatDto;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.CatService;
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
@RequestMapping("/api/cats")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class CatController {

    @Autowired
    private CatService catService;

    @GetMapping
    public ResponseEntity<Page<CatDto>> getAllCats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Color color,
            @RequestParam(required = false) Sex sex,
            @RequestParam(required = false) Boolean adopted) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Cat> cats;
        if (name != null || color != null || sex != null || adopted != null) {
            cats = catService.findWithFilters(name, color, sex, adopted, pageable);
        } else {
            cats = catService.findAll(pageable);
        }

        Page<CatDto> catsDto = EntityMapper.toPage(cats, EntityMapper::toCatDto);
        return ResponseEntity.ok(catsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CatDto> getCatById(@PathVariable UUID id) {
        Optional<Cat> cat = catService.findById(id);
        return cat.map(c -> ResponseEntity.ok(EntityMapper.toCatDto(c)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CatDto> createCat(@RequestBody CatDto catDto) {
        try {
            Cat cat = EntityMapper.toCatEntity(catDto);
            Cat savedCat = catService.save(cat);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toCatDto(savedCat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CatDto> updateCat(@PathVariable UUID id, @RequestBody CatDto catDto) {
        try {
            Cat cat = EntityMapper.toCatEntity(catDto);
            Cat updatedCat = catService.update(id, cat);
            return ResponseEntity.ok(EntityMapper.toCatDto(updatedCat));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable UUID id) {
        try {
            catService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/adopted/{adopted}")
    public ResponseEntity<Page<CatDto>> getCatsByAdoptionStatus(
            @PathVariable Boolean adopted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Cat> cats = catService.findByAdopted(adopted, pageable);
        Page<CatDto> catsDto = EntityMapper.toPage(cats, EntityMapper::toCatDto);
        return ResponseEntity.ok(catsDto);
    }
}
