package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
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
@CrossOrigin(origins = "*")
public class CatController {

    @Autowired
    private CatService catService;

    @GetMapping
    public ResponseEntity<Page<Cat>> getAllCats(
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

        return ResponseEntity.ok(cats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cat> getCatById(@PathVariable UUID id) {
        Optional<Cat> cat = catService.findById(id);
        return cat.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cat> createCat(@RequestBody Cat cat) {
        try {
            Cat savedCat = catService.save(cat);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cat> updateCat(@PathVariable UUID id, @RequestBody Cat cat) {
        try {
            Cat updatedCat = catService.update(id, cat);
            return ResponseEntity.ok(updatedCat);
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
    public ResponseEntity<Page<Cat>> getCatsByAdoptionStatus(
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

        return ResponseEntity.ok(cats);
    }

    @GetMapping("/color/{color}")
    public ResponseEntity<Page<Cat>> getCatsByColor(
            @PathVariable Color color,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Cat> cats = catService.findByColor(color, pageable);

        return ResponseEntity.ok(cats);
    }

    @GetMapping("/sex/{sex}")
    public ResponseEntity<Page<Cat>> getCatsBySex(
            @PathVariable Sex sex,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Cat> cats = catService.findBySex(sex, pageable);

        return ResponseEntity.ok(cats);
    }
}
