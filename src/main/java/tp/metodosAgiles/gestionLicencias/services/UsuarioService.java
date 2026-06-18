package tp.metodosAgiles.gestionLicencias.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp.metodosAgiles.gestionLicencias.dto.UsuarioDTO;
import tp.metodosAgiles.gestionLicencias.entity.Usuario;
import tp.metodosAgiles.gestionLicencias.entity.enums.RolUsuario;
import tp.metodosAgiles.gestionLicencias.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    private static final Logger log = LoggerFactory.getLogger(UsuarioService.class);

    public Usuario crearUsuario(UsuarioDTO dto) {

        if (usuarioRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException(
                    "Ya existe un usuario con ese username");
        }

        Usuario usuario = new Usuario();

        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setRol(dto.getRol());

        return usuarioRepository.save(usuario);
    }

    public Usuario modificarUsuario(Long idUsuarioAEditar, Long idAdmin, UsuarioDTO dtoNuevo) {

        // 1. Validar permisos de administrador
        Usuario admin = usuarioRepository.findById(idAdmin)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado."));

        if (admin.getRol() != RolUsuario.ADMINISTRADOR) {
            throw new RuntimeException("Permisos denegados: Solo un administrador puede modificar usuarios.");
        }

        // 2. Buscar el usuario que queremos modificar
        Usuario usuarioEditado = usuarioRepository.findById(idUsuarioAEditar)
                .orElseThrow(() -> new RuntimeException("El usuario a modificar no existe."));

        // Validar que si le cambian el username, no le pongan uno que ya está en uso
        if (!usuarioEditado.getUsername().equals(dtoNuevo.getUsername()) &&
                usuarioRepository.existsByUsername(dtoNuevo.getUsername())) {
            throw new RuntimeException("Ya existe otro usuario utilizando ese username.");
        }

        // 3. Actualizar datos del usuario
        usuarioEditado.setUsername(dtoNuevo.getUsername());
        usuarioEditado.setPassword(dtoNuevo.getPassword());
        usuarioEditado.setNombre(dtoNuevo.getNombre());
        usuarioEditado.setApellido(dtoNuevo.getApellido());
        usuarioEditado.setRol(dtoNuevo.getRol());

        // 4. Registrar auditoría de modificaciones
        log.info(
                "AUDITORÍA - Modificación: El administrador '{}' (ID: {}) modificó los datos del usuario '{}' (ID: {})",
                admin.getUsername(), admin.getId(), usuarioEditado.getUsername(), usuarioEditado.getId());

        // Guardamos los cambios
        return usuarioRepository.save(usuarioEditado);
    }

    public UsuarioDTO buscarPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("No se encontró ningún usuario con ese username en el sistema."));
        return UsuarioDTO.toResponse(usuario);
    }

    
    public UsuarioDTO autenticar(String username, String contrasenia) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
        if (!usuario.getPassword().equals(contrasenia)) {
            throw new RuntimeException("Contraseña incorrecta.");
        }
        return UsuarioDTO.toResponse(usuario);
    }

}
