package tp.metodosAgiles.gestionLicencias.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.dto.LicenciaDTO;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.services.LicenciaService;

@RestController
@RequestMapping("/api/licencias")
@CrossOrigin(origins = "http://localhost:3000")
public class LicenciaController {

    @Autowired
    private LicenciaService licenciaService;

    @GetMapping("/buscar")
    public List<LicenciaDTO> buscarLicencia(
            @RequestParam(required = false) String nroDocumento,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String clase) {
        return licenciaService.buscarLicencia(nroDocumento, apellido, estado, clase);
    }

    @GetMapping("/titular")
    public LicenciaDTO buscarLicenciaPorTitular(@RequestParam String nroDocumento) {
        return licenciaService.buscarLicenciaPorTitular(nroDocumento);
    }

    @PostMapping("/renovar")
    public ResponseEntity<?> renovarLicencia(
            @RequestParam String nroDocumento,
            @RequestParam boolean modificacionDatos) {
        try {
            Licencia licenciaRenovada = licenciaService.renovarLicencia(nroDocumento, modificacionDatos);

            // Reutilizamos el método toResponse y obtenerEstadoLicencia
            LicenciaDTO responseDTO = LicenciaDTO.toResponse(
                    licenciaRenovada,
                    licenciaService.obtenerEstadoLicencia(licenciaRenovada));

            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/expiradas")
    public List<LicenciaDTO> obtenerLicenciasExpiradas() {
        return licenciaService.obtenerLicenciasExpiradas();
    }

    @GetMapping("/vigentes")
    public List<LicenciaDTO> buscarLicenciasVigentes(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String grupoSanguineo,
            @RequestParam(required = false) String factorRh,
            @RequestParam(required = false) Boolean donante) {
        return licenciaService.buscarLicenciasVigentesConFiltros(nombre, apellido, grupoSanguineo, factorRh, donante);
    }

    @GetMapping("/nuevaVigencia")
    public String obtenerNuevaFechaVigencia(@RequestParam String nroDocumento) {
        return licenciaService.obtenerNuevaFechaVigencia(nroDocumento);
    }

}
