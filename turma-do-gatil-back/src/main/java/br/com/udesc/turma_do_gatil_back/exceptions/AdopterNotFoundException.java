package br.com.udesc.turma_do_gatil_back.exceptions;

/**
 * Exception thrown when a requested adopter is not found in the system.
 */
public class AdopterNotFoundException extends RuntimeException {
    
    public AdopterNotFoundException(String message) {
        super(message);
    }
    
    public AdopterNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
