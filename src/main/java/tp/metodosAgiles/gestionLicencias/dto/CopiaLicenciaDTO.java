package tp.metodosAgiles.gestionLicencias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CopiaLicenciaDTO {
    private String titular;
    private String clase;
    private String vencimiento;
    private Integer costo;
}
