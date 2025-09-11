package br.com.udesc.turma_do_gatil_back.exceptions;

public class AdoptionNotFoundException extends RuntimeException {
    
    public AdoptionNotFoundException(String message) {
        super(message);
    }
    
    public AdoptionNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
