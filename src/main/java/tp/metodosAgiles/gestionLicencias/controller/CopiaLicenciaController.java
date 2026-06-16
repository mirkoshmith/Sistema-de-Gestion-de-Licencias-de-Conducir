package tp.metodosAgiles.gestionLicencias.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.dto.CopiaLicenciaDTO;
import tp.metodosAgiles.gestionLicencias.services.CopiaLicenciaService;

@RestController
@RequestMapping("/api/copias-licencia")
@CrossOrigin(origins = "http://localhost:3000")
public class CopiaLicenciaController {

    @Autowired
    private CopiaLicenciaService copiaLicenciaService;

    @PostMapping("/emitir")
    public ResponseEntity<?> emitirCopia(
            @RequestParam Long licenciaId,
            @RequestParam Long usuarioId) {
        try {
            CopiaLicenciaDTO copiaDTO = copiaLicenciaService.emitirCopia(licenciaId, usuarioId);
            return ResponseEntity.ok(copiaDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
