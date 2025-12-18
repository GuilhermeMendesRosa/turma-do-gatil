package br.com.udesc.turma_do_gatil_back.mappers;

import br.com.udesc.turma_do_gatil_back.dto.*;
import br.com.udesc.turma_do_gatil_back.entities.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.stream.Collectors;

public class EntityMapper {

    // Cat mappings
    public static CatDto toCatDto(Cat cat) {
        if (cat == null) return null;
        return new CatDto(
            cat.getId(),
            cat.getName(),
            cat.getColor(),
            cat.getSex(),
            cat.getBirthDate(),
            cat.getShelterEntryDate(),
            cat.getPhotoUrl(),
            cat.getAdoptionStatus()
        );
    }

    public static Cat toCatEntity(CatDto catDto) {
        if (catDto == null) return null;
        Cat cat = new Cat();
        cat.setId(catDto.getId());
        cat.setName(catDto.getName());
        cat.setColor(catDto.getColor());
        cat.setSex(catDto.getSex());
        cat.setBirthDate(catDto.getBirthDate());
        cat.setShelterEntryDate(catDto.getShelterEntryDate());
        cat.setPhotoUrl(catDto.getPhotoUrl());
        cat.setAdoptionStatus(catDto.getAdoptionStatus());
        return cat;
    }

    // Address mappings
    public static AddressDto toAddressDto(Address address) {
        if (address == null) return null;
        return new AddressDto(
            address.getId(),
            address.getStreet(),
            address.getNeighborhood(),
            address.getCity(),
            address.getState(),
            address.getNumber(),
            address.getZipCode(),
            address.getComplement()
        );
    }

    public static Address toAddressEntity(AddressDto addressDto) {
        if (addressDto == null) return null;
        Address address = new Address();
        address.setId(addressDto.getId());
        address.setStreet(addressDto.getStreet());
        address.setNeighborhood(addressDto.getNeighborhood());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setNumber(addressDto.getNumber());
        address.setZipCode(addressDto.getZipCode());
        address.setComplement(addressDto.getComplement());
        return address;
    }

    // Adopter mappings
    public static AdopterDto toAdopterDto(Adopter adopter) {
        if (adopter == null) return null;
        return new AdopterDto(
            adopter.getId(),
            adopter.getFirstName(),
            adopter.getLastName(),
            adopter.getBirthDate(),
            adopter.getCpf(),
            adopter.getPhone(),
            adopter.getEmail(),
            adopter.getInstagram(),
            toAddressDto(adopter.getAddress()),
            adopter.getRegistrationDate()
        );
    }

    public static Adopter toAdopterEntity(AdopterDto adopterDto) {
        if (adopterDto == null) return null;
        Adopter adopter = new Adopter();
        adopter.setId(adopterDto.getId());
        adopter.setFirstName(adopterDto.getFirstName());
        adopter.setLastName(adopterDto.getLastName());
        adopter.setBirthDate(adopterDto.getBirthDate());
        adopter.setCpf(adopterDto.getCpf());
        adopter.setPhone(adopterDto.getPhone());
        adopter.setEmail(adopterDto.getEmail());
        adopter.setInstagram(adopterDto.getInstagram());
        
        // Map address
        Address address = toAddressEntity(adopterDto.getAddress());
        if (address != null) {
            address.setAdopter(adopter);
        }
        adopter.setAddress(address);
        
        adopter.setRegistrationDate(adopterDto.getRegistrationDate());
        return adopter;
    }

    // Adoption mappings
    public static AdoptionDto toAdoptionDto(Adoption adoption) {
        if (adoption == null) return null;
        AdoptionDto dto = new AdoptionDto(
            adoption.getId(),
            adoption.getCatId(),
            adoption.getAdopterId(),
            adoption.getAdoptionDate(),
            adoption.getStatus()
        );
        dto.setAdoptionTermPhoto(adoption.getAdoptionTermPhoto());

        // Evitar carregamento lazy se não necessário
        if (adoption.getCat() != null) {
            dto.setCat(toCatDto(adoption.getCat()));
        }
        if (adoption.getAdopter() != null) {
            dto.setAdopter(toAdopterDto(adoption.getAdopter()));
        }

        return dto;
    }

    public static Adoption toAdoptionEntity(AdoptionDto adoptionDto) {
        if (adoptionDto == null) return null;
        Adoption adoption = new Adoption();
        adoption.setId(adoptionDto.getId());
        adoption.setCatId(adoptionDto.getCatId());
        adoption.setAdopterId(adoptionDto.getAdopterId());
        adoption.setAdoptionDate(adoptionDto.getAdoptionDate());
        adoption.setStatus(adoptionDto.getStatus());
        adoption.setAdoptionTermPhoto(adoptionDto.getAdoptionTermPhoto());
        return adoption;
    }

    // Note mappings
    public static NoteDto toNoteDto(Note note) {
        if (note == null) return null;
        return new NoteDto(
            note.getId(),
            note.getCatId(),
            note.getDate(),
            note.getText()
        );
    }

    public static Note toNoteEntity(NoteDto noteDto) {
        if (noteDto == null) return null;
        Note note = new Note();
        note.setId(noteDto.getId());
        note.setCatId(noteDto.getCatId());
        note.setDate(noteDto.getDate());
        note.setText(noteDto.getText());
        return note;
    }

    // Sterilization mappings
    public static SterilizationDto toSterilizationDto(Sterilization sterilization) {
        if (sterilization == null) return null;

        String catName = null;
        String photoUrl = null;

        // Verificar se o relacionamento com Cat está carregado
        if (sterilization.getCat() != null) {
            catName = sterilization.getCat().getName();
            photoUrl = sterilization.getCat().getPhotoUrl();
        }

        return new SterilizationDto(
            sterilization.getId(),
            sterilization.getCatId(),
            catName,
            photoUrl,
            sterilization.getSterilizationDate(),
            sterilization.getStatus(),
            sterilization.getNotes()
        );
    }

    public static Sterilization toSterilizationEntity(SterilizationDto sterilizationDto) {
        if (sterilizationDto == null) return null;
        Sterilization sterilization = new Sterilization();
        sterilization.setId(sterilizationDto.getId());
        sterilization.setCatId(sterilizationDto.getCatId());
        sterilization.setSterilizationDate(sterilizationDto.getSterilizationDate());
        sterilization.setStatus(sterilizationDto.getStatus());
        sterilization.setNotes(sterilizationDto.getNotes());
        return sterilization;
    }

    // Utility methods for collections and pages
    public static <T, D> List<D> toList(List<T> entities, java.util.function.Function<T, D> mapper) {
        return entities.stream().map(mapper).collect(Collectors.toList());
    }

    public static <T, D> Page<D> toPage(Page<T> entityPage, java.util.function.Function<T, D> mapper) {
        List<D> dtoList = entityPage.getContent().stream()
            .map(mapper)
            .collect(Collectors.toList());
        return new PageImpl<>(dtoList, entityPage.getPageable(), entityPage.getTotalElements());
    }
}
