package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdopterDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private LocalDateTime birthDate;
    private String cpf;
    private String phone;
    private String email;
    private String instagram;
    private AddressDto address;
    private LocalDateTime registrationDate;
}
