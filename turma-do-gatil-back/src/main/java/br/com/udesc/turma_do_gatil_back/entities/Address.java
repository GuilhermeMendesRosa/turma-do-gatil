package br.com.udesc.turma_do_gatil_back.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE addresses SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Address extends BaseAuditableEntity {

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
