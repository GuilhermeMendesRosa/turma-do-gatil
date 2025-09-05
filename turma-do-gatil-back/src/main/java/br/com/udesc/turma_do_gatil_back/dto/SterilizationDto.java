package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.SterilizationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "DTO que representa uma esterilização/castração")
public class SterilizationDto {
    @Schema(description = "ID único da esterilização", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "ID do gato", example = "550e8400-e29b-41d4-a716-446655440001")
    private UUID catId;

    @Schema(description = "Nome do gato", example = "Mimi")
    private String cat;

    @Schema(description = "URL da foto do gato", example = "https://example.com/photos/mimi.jpg")
    private String photoUrl;

    @Schema(description = "Data da esterilização", example = "2024-03-15T10:30:00")
    private LocalDateTime sterilizationDate;

    @Schema(description = "Status da esterilização")
    private SterilizationStatus status;

    @Schema(description = "Observações sobre a esterilização", example = "Procedimento realizado sem complicações")
    private String notes;

    // Constructors
    public SterilizationDto() {}

    public SterilizationDto(UUID id, UUID catId, String cat, String photoUrl,
                           LocalDateTime sterilizationDate, SterilizationStatus status, String notes) {
        this.id = id;
        this.catId = catId;
        this.cat = cat;
        this.photoUrl = photoUrl;
        this.sterilizationDate = sterilizationDate;
        this.status = status;
        this.notes = notes;
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

    public String getCat() {
        return cat;
    }

    public void setCat(String cat) {
        this.cat = cat;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getSterilizationDate() {
        return sterilizationDate;
    }

    public void setSterilizationDate(LocalDateTime sterilizationDate) {
        this.sterilizationDate = sterilizationDate;
    }

    public SterilizationStatus getStatus() {
        return status;
    }

    public void setStatus(SterilizationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
