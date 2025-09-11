package br.com.udesc.turma_do_gatil_back.exceptions;

import java.util.UUID;

public class SterilizationNotFoundException extends RuntimeException {

    public SterilizationNotFoundException(UUID id) {
        super("Sterilization not found with id: " + id);
    }
}
