package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.enums.SterilizationEligibilityStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "DTO que representa um gato com informações sobre seu status de castração")
public class CatSterilizationStatusDto {

    @Schema(description = "Identificador único do gato", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;

    @Schema(description = "Nome do gato", example = "Mimi")
    private String name;

    @Schema(description = "Cor do gato")
    private Color color;

    @Schema(description = "Sexo do gato")
    private Sex sex;

    @Schema(description = "Data de nascimento do gato", example = "2024-03-15T10:30:00")
    private LocalDateTime birthDate;

    @Schema(description = "Data de entrada no abrigo", example = "2024-04-01T09:00:00")
    private LocalDateTime shelterEntryDate;

    @Schema(description = "URL da foto do gato", example = "https://example.com/photos/mimi.jpg")
    private String photoUrl;

    @Schema(description = "Idade do gato em dias", example = "120")
    private Integer ageInDays;

    @Schema(
        description = "Status de elegibilidade para castração",
        example = "ELIGIBLE"
    )
    private SterilizationEligibilityStatus sterilizationStatus;

    public CatSterilizationStatusDto() {}

    public CatSterilizationStatusDto(UUID id, String name, Color color, Sex sex,
                                   LocalDateTime birthDate, LocalDateTime shelterEntryDate,
                                   String photoUrl, Integer ageInDays, SterilizationEligibilityStatus sterilizationStatus) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.sex = sex;
        this.birthDate = birthDate;
        this.shelterEntryDate = shelterEntryDate;
        this.photoUrl = photoUrl;
        this.ageInDays = ageInDays;
        this.sterilizationStatus = sterilizationStatus;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public LocalDateTime getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDateTime birthDate) {
        this.birthDate = birthDate;
    }

    public LocalDateTime getShelterEntryDate() {
        return shelterEntryDate;
    }

    public void setShelterEntryDate(LocalDateTime shelterEntryDate) {
        this.shelterEntryDate = shelterEntryDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Integer getAgeInDays() {
        return ageInDays;
    }

    public void setAgeInDays(Integer ageInDays) {
        this.ageInDays = ageInDays;
    }

    public SterilizationEligibilityStatus getSterilizationStatus() {
        return sterilizationStatus;
    }

    public void setSterilizationStatus(SterilizationEligibilityStatus sterilizationStatus) {
        this.sterilizationStatus = sterilizationStatus;
    }
}
