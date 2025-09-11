package br.com.udesc.turma_do_gatil_back.exceptions;

/**
 * Exception thrown when attempting to register an adopter with an email that already exists.
 */
public class EmailAlreadyExistsException extends RuntimeException {
    
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
    
    public EmailAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
