package tp.metodosAgiles.gestionLicencias.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tp.metodosAgiles.gestionLicencias.dto.UsuarioDTO;
import tp.metodosAgiles.gestionLicencias.entity.Usuario;
import tp.metodosAgiles.gestionLicencias.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

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
}
