package br.com.udesc.turma_do_gatil_back.dto;

import br.com.udesc.turma_do_gatil_back.enums.CatAdoptionStatus;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;

import java.time.LocalDateTime;
import java.util.UUID;

public class CatDto {
    private UUID id;
    private String name;
    private Color color;
    private Sex sex;
    private LocalDateTime birthDate;
    private LocalDateTime shelterEntryDate;
    private String photoUrl;
    private CatAdoptionStatus adoptionStatus;

    // Constructors
    public CatDto() {}

    public CatDto(UUID id, String name, Color color, Sex sex, LocalDateTime birthDate,
                  LocalDateTime shelterEntryDate, String photoUrl, CatAdoptionStatus adoptionStatus) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.sex = sex;
        this.birthDate = birthDate;
        this.shelterEntryDate = shelterEntryDate;
        this.photoUrl = photoUrl;
        this.adoptionStatus = adoptionStatus;
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

    public CatAdoptionStatus getAdoptionStatus() {
        return adoptionStatus;
    }

    public void setAdoptionStatus(CatAdoptionStatus adoptionStatus) {
        this.adoptionStatus = adoptionStatus;
    }
}
