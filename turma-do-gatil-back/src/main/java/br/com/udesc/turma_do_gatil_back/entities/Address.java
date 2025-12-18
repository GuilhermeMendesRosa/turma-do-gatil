package br.com.udesc.turma_do_gatil_back.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String neighborhood;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false, length = 2)
    private String state;

    @Column(nullable = false, length = 20)
    private String number;

    @Column(name = "zip_code", nullable = false, length = 10)
    private String zipCode;

    @Column
    private String complement;

    @OneToOne
    @JoinColumn(name = "adopter_id", nullable = false, unique = true)
    private Adopter adopter;
}
