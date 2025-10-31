package br.com.udesc.turma_do_gatil_back.exceptions;

public class CatAlreadyInAdoptionProcessException extends RuntimeException {

    public CatAlreadyInAdoptionProcessException(String message) {
        super(message);
    }

    public CatAlreadyInAdoptionProcessException(String message, Throwable cause) {
        super(message, cause);
    }
}
