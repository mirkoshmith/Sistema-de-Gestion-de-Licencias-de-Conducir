package tp.metodosAgiles.gestionLicencias.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tp.metodosAgiles.gestionLicencias.dto.UsuarioDTO;
import tp.metodosAgiles.gestionLicencias.entity.Usuario;
import tp.metodosAgiles.gestionLicencias.entity.enums.RolUsuario;
import tp.metodosAgiles.gestionLicencias.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias - UsuarioService")
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    @DisplayName("Crear Usuario: lanza excepción si el username ya existe")
    void testCrearUsuarioUsernameDuplicado() {

        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("admin");

        when(usuarioRepository.existsByUsername("admin")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.crearUsuario(dto));

        assertEquals("Ya existe un usuario con ese username", ex.getMessage());

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    @DisplayName("Crear Usuario: guarda correctamente un usuario nuevo")
    void testCrearUsuarioExito() {

        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("juan");
        dto.setPassword("1234");
        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setRol(RolUsuario.ADMINISTRADOR);

        when(usuarioRepository.existsByUsername("juan")).thenReturn(false);

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setUsername("juan");

        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        Usuario resultado = usuarioService.crearUsuario(dto);

        assertEquals("juan", resultado.getUsername());

        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    @DisplayName("Buscar por username: retorna correctamente el usuario")
    void testBuscarPorUsername() {

        Usuario usuario = new Usuario();
        usuario.setUsername("admin");
        usuario.setNombre("Administrador");

        when(usuarioRepository.findByUsername("admin"))
                .thenReturn(Optional.of(usuario));

        UsuarioDTO dto = usuarioService.buscarPorUsername("admin");

        assertEquals("admin", dto.getUsername());
    }

    @Test
    @DisplayName("Buscar por username: lanza excepción si no existe")
    void testBuscarPorUsernameNoExiste() {

        when(usuarioRepository.findByUsername("pepe"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.buscarPorUsername("pepe"));

        assertEquals("No se encontró ningún usuario con ese username en el sistema.",
                ex.getMessage());
    }

    @Test
    @DisplayName("Autenticar: usuario y contraseña correctos")
    void testAutenticarExito() {

        Usuario usuario = new Usuario();
        usuario.setUsername("juan");
        usuario.setPassword("1234");

        when(usuarioRepository.findByUsername("juan"))
                .thenReturn(Optional.of(usuario));

        UsuarioDTO dto = usuarioService.autenticar("juan", "1234");

        assertEquals("juan", dto.getUsername());
    }

    @Test
    @DisplayName("Autenticar: contraseña incorrecta")
    void testAutenticarPasswordIncorrecta() {

        Usuario usuario = new Usuario();
        usuario.setUsername("juan");
        usuario.setPassword("1234");

        when(usuarioRepository.findByUsername("juan"))
                .thenReturn(Optional.of(usuario));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.autenticar("juan", "abcd"));

        assertEquals("Contraseña incorrecta.", ex.getMessage());
    }

    @Test
    @DisplayName("Autenticar: usuario inexistente")
    void testAutenticarUsuarioInexistente() {

        when(usuarioRepository.findByUsername("juan"))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.autenticar("juan", "1234"));

        assertEquals("Usuario no encontrado.", ex.getMessage());
    }

    @Test
    @DisplayName("Eliminar Usuario: administrador elimina correctamente")
    void testEliminarUsuarioExito() {

        Usuario admin = new Usuario();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setRol(RolUsuario.ADMINISTRADOR);

        Usuario usuario = new Usuario();
        usuario.setId(2L);
        usuario.setUsername("juan");

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuario));

        assertDoesNotThrow(() -> usuarioService.eliminarUsuario(2L, 1L));

        verify(usuarioRepository).delete(usuario);
    }

    @Test
    @DisplayName("Eliminar Usuario: falla si quien elimina no es administrador")
    void testEliminarUsuarioSinPermisos() {

        Usuario operador = new Usuario();
        operador.setRol(RolUsuario.OPERADOR);

        when(usuarioRepository.findById(1L))
                .thenReturn(Optional.of(operador));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> usuarioService.eliminarUsuario(2L, 1L));

        assertEquals("Permisos denegados: Solo un administrador puede eliminar usuarios.",
                ex.getMessage());

        verify(usuarioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Modificar Usuario: modifica correctamente")
    void testModificarUsuarioExito() {

        Usuario admin = new Usuario();
        admin.setId(1L);
        admin.setUsername("admin");
        admin.setRol(RolUsuario.ADMINISTRADOR);

        Usuario usuario = new Usuario();
        usuario.setId(2L);
        usuario.setUsername("juan");

        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("juanNuevo");
        dto.setPassword("123");
        dto.setNombre("Juan");
        dto.setApellido("Perez");
        dto.setRol(RolUsuario.OPERADOR);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(usuarioRepository.findById(2L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.existsByUsername("juanNuevo")).thenReturn(false);
        when(usuarioRepository.save(any())).thenReturn(usuario);

        Usuario resultado = usuarioService.modificarUsuario(2L, 1L, dto);

        assertEquals("juanNuevo", resultado.getUsername());

        verify(usuarioRepository).save(usuario);
    }
}