package br.com.udesc.turma_do_gatil_back.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class NoteDto {
    private UUID id;
    private UUID catId;
    private LocalDateTime date;
    private String text;

    // Constructors
    public NoteDto() {}

    public NoteDto(UUID id, UUID catId, LocalDateTime date, String text) {
        this.id = id;
        this.catId = catId;
        this.date = date;
        this.text = text;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getCatId() {
        return catId;
    }

    public void setCatId(UUID catId) {
        this.catId = catId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
