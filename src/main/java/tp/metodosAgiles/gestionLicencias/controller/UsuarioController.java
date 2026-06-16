package tp.metodosAgiles.gestionLicencias.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.dto.UsuarioDTO;
import tp.metodosAgiles.gestionLicencias.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/alta")
    public ResponseEntity<?> altaUsuario(@RequestBody UsuarioDTO dto) {

        try {
            usuarioService.crearUsuario(dto);
            return ResponseEntity.ok("Usuario creado correctamente");

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
