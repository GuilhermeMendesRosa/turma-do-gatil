package br.com.udesc.turma_do_gatil_back.exceptions;

public class CatNotFoundException extends RuntimeException {
    
    public CatNotFoundException(String message) {
        super(message);
    }
    
    public CatNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
