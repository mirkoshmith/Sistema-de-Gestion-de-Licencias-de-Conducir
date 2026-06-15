package tp.metodosAgiles.gestionLicencias.entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.FactorRh;
import tp.metodosAgiles.gestionLicencias.entity.enums.GrupoSanguineo;
import tp.metodosAgiles.gestionLicencias.entity.enums.TipoDocumento;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "titulares", uniqueConstraints = {
        @UniqueConstraint(name = "uk_documento", columnNames = { "tipo_documento", "nro_documento" })
})
public class Titular {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(name = "tipo_documento", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    @Column(name = "nro_documento", nullable = false)
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
    @JsonIgnore
    private List<Licencia> licencias;
}
