package tp.metodosAgiles.gestionLicencias.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.dto.LicenciaDTO;
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

}
