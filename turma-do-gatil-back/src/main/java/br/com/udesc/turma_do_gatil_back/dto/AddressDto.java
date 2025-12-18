package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private UUID id;
    private String street;
    private String neighborhood;
    private String city;
    private String state;
    private String number;
    private String zipCode;
    private String complement;
}
