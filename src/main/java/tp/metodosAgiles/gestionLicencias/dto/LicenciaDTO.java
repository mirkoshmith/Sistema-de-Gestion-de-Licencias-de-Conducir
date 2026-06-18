package tp.metodosAgiles.gestionLicencias.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.EstadoLicencia;

import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LicenciaDTO {
    private Long id;
    private String tipoDocumentoTitular;
    private String nroDocumentoTitular;
    private String apellido;
    private String nombre;
    private String clase;
    private String fechaEmision;
    private String fechaVencimiento;
    private String estado;
    private String grupoSanguineo;
    private String donante;
    private String factorRh;

    public static LicenciaDTO toResponse(Licencia licencia, EstadoLicencia estado) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LicenciaDTO dto = new LicenciaDTO();
        dto.setId(licencia.getId());
        dto.setTipoDocumentoTitular(licencia.getTitular().getTipoDocumento().toString());
        dto.setNroDocumentoTitular(licencia.getTitular().getNroDocumento());
        dto.setApellido(licencia.getTitular().getApellido());
        dto.setNombre(licencia.getTitular().getNombre());
        dto.setClase(licencia.getClase().toString());
        dto.setFechaEmision(licencia.getFechaEmision().format(formatter).toString());
        dto.setFechaVencimiento(licencia.getFechaVencimiento().format(formatter).toString());
        dto.setEstado(estado.toString());
        dto.setGrupoSanguineo(licencia.getTitular().getGrupoSanguineo().toString());
        dto.setDonante(licencia.getTitular().getDonante() ? "SÍ" : "NO");
        dto.setFactorRh(licencia.getTitular().getFactorRh().toString().equals("POSITIVO") ? "+" : "-");
        return dto;
    }
}
