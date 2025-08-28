package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.NoteDto;
import br.com.udesc.turma_do_gatil_back.entities.Note;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.NoteService;
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
@RequestMapping("/api/notes")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ResponseEntity<Page<NoteDto>> getAllNotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) UUID catId,
            @RequestParam(required = false) String text,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Note> notes;
        if (catId != null || text != null || startDate != null || endDate != null) {
            notes = noteService.findWithFilters(catId, text, startDate, endDate, pageable);
        } else {
            notes = noteService.findAll(pageable);
        }

        Page<NoteDto> notesDto = EntityMapper.toPage(notes, EntityMapper::toNoteDto);
        return ResponseEntity.ok(notesDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> getNoteById(@PathVariable UUID id) {
        Optional<Note> note = noteService.findById(id);
        return note.map(n -> ResponseEntity.ok(EntityMapper.toNoteDto(n)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody NoteDto noteDto) {
        try {
            Note note = EntityMapper.toNoteEntity(noteDto);
            Note savedNote = noteService.save(note);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toNoteDto(savedNote));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> updateNote(@PathVariable UUID id, @RequestBody NoteDto noteDto) {
        try {
            Note note = EntityMapper.toNoteEntity(noteDto);
            Note updatedNote = noteService.update(id, note);
            return ResponseEntity.ok(EntityMapper.toNoteDto(updatedNote));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable UUID id) {
        try {
            noteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cat/{catId}")
    public ResponseEntity<List<NoteDto>> getNotesByCatId(@PathVariable UUID catId) {
        // Como o serviço retorna Page, vamos usar paginação com valores padrão
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Note> notesPage = noteService.findByCatId(catId, pageable);
        List<NoteDto> notesDto = EntityMapper.toList(notesPage.getContent(), EntityMapper::toNoteDto);
        return ResponseEntity.ok(notesDto);
    }
}
