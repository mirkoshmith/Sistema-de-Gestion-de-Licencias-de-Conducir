package tp.metodosAgiles.gestionLicencias.dto;

import lombok.Getter;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.GrupoSanguineo;

@Getter
@Setter
public class TitularUpdateDTO {
    private String direccion;
    private GrupoSanguineo grupoSanguineo;
    private Boolean donante;
    private Long idUsuarioAdministrador; // Necesario para la auditoría
}