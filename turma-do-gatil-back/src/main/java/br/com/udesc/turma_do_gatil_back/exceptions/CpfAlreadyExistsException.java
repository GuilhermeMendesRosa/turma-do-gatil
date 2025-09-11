package br.com.udesc.turma_do_gatil_back.exceptions;

/**
 * Exception thrown when attempting to register an adopter with a CPF that already exists.
 */
public class CpfAlreadyExistsException extends RuntimeException {
    
    public CpfAlreadyExistsException(String message) {
        super(message);
    }
    
    public CpfAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
