package br.com.udesc.turma_do_gatil_back.exceptions;

import java.util.UUID;

public class NoteNotFoundException extends RuntimeException {

    public NoteNotFoundException(UUID id) {
        super("Note not found with id: " + id);
    }
}
