package tp.metodosAgiles.gestionLicencias.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "licencias")
public class Licencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "titular_id", nullable = false)
    private Titular titular;

    @Enumerated(EnumType.STRING)
    private ClaseLicencia clase;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuarioAdministrador;

    private LocalDate fechaEmision;

    private LocalDate fechaVencimiento;

    private String observacionesLimitaciones;
}