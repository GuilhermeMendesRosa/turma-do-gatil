package br.com.udesc.turma_do_gatil_back.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "adopters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adopter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "birth_date", nullable = true)
    private LocalDateTime birthDate;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(nullable = false)
    private String phone;

    @Column(unique = true)
    private String email;

    @Column
    private String instagram;

    @Column(nullable = false)
    private String address;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @OneToMany(mappedBy = "adopter", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Adoption> adoptions;
}
