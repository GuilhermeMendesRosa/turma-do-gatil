package br.com.udesc.turma_do_gatil_back.exceptions;

public class AdopterNotFoundException extends RuntimeException {
    
    public AdopterNotFoundException(String message) {
        super(message);
    }
    
    public AdopterNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
