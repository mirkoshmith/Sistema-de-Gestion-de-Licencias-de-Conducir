package tp.metodosAgiles.gestionLicencias.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.dto.UsuarioDTO;
import tp.metodosAgiles.gestionLicencias.services.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PutMapping("/modificar/{id}")
    public ResponseEntity<?> modificarUsuario(
            @PathVariable Long id,
            @RequestParam Long idAdmin,
            @RequestBody UsuarioDTO dto) {

        try {
            usuarioService.modificarUsuario(id, idAdmin, dto);
            return ResponseEntity.ok("Usuario modificado correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/auth")
    public ResponseEntity<?> autenticar(@RequestParam String usuario, @RequestParam String contrasenia) {
        System.out.println(usuario + " " + contrasenia);
        try {
            UsuarioDTO usuarioAutenticado = usuarioService.autenticar(usuario, contrasenia);
            return ResponseEntity.ok(usuarioAutenticado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
