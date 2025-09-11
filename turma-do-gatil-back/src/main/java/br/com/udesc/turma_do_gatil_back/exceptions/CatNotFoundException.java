package br.com.udesc.turma_do_gatil_back.exceptions;

/**
 * Exception thrown when a requested cat is not found in the system.
 */
public class CatNotFoundException extends RuntimeException {
    
    public CatNotFoundException(String message) {
        super(message);
    }
    
    public CatNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
