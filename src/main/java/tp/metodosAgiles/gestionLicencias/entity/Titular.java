package tp.metodosAgiles.gestionLicencias.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "titulares", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "tipoDocumento", "nroDocumento" })
})
public class Titular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @Column(nullable = false)
    private String nroDocumento;

    private String direccion;

    @Enumerated(EnumType.STRING)
    private GrupoSanguineo grupoSanguineo;

    @Enumerated(EnumType.STRING)
    private FactorRh factorRh;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    private Boolean donante;

    @Enumerated(EnumType.STRING)
    private ClaseLicencia claseSolicitada;

    @OneToMany(mappedBy = "titular")
    private List<Licencia> licencias;
}
