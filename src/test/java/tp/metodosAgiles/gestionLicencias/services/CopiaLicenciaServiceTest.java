package tp.metodosAgiles.gestionLicencias.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tp.metodosAgiles.gestionLicencias.dto.CopiaLicenciaDTO;
import tp.metodosAgiles.gestionLicencias.entity.CopiaLicencia;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.entity.Usuario;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.repository.CopiaLicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias - CopiaLicenciaService")
class CopiaLicenciaServiceTest {

    @Mock
    private CopiaLicenciaRepository copiaLicenciaRepository;

    @Mock
    private LicenciaRepository licenciaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private CopiaLicenciaService copiaLicenciaService;

    @Test
    @DisplayName("Emitir copia: genera correctamente una copia de una licencia vigente")
    void testEmitirCopiaExito() {

        Titular titular = new Titular();
        titular.setNombre("Juan");
        titular.setApellido("Perez");

        Licencia licencia = new Licencia();
        licencia.setTitular(titular);
        licencia.setClase(ClaseLicencia.B);
        licencia.setFechaVencimiento(LocalDate.now().plusYears(2));

        Usuario usuario = new Usuario();

        CopiaLicencia copia = new CopiaLicencia();
        copia.setCosto(50);

        when(licenciaRepository.findById(1L))
                .thenReturn(Optional.of(licencia));

        when(usuarioRepository.findById(2L))
                .thenReturn(Optional.of(usuario));

        when(copiaLicenciaRepository.save(any(CopiaLicencia.class)))
                .thenReturn(copia);

        CopiaLicenciaDTO dto = copiaLicenciaService.emitirCopia(1L, 2L);

        assertEquals("Juan Perez", dto.getTitular());
        assertEquals("B", dto.getClase());
        assertEquals("50", String.valueOf(dto.getCosto()));

        verify(copiaLicenciaRepository).save(any(CopiaLicencia.class));
    }

    @Test
    @DisplayName("Emitir copia: lanza excepción si la licencia no existe")
    void testEmitirCopiaLicenciaInexistente() {

        when(licenciaRepository.findById(1L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> copiaLicenciaService.emitirCopia(1L, 2L));

        assertEquals("No se encontró la licencia original con ID 1",
                ex.getMessage());

        verifyNoInteractions(usuarioRepository);
        verify(copiaLicenciaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Emitir copia: lanza excepción si la licencia está vencida")
    void testEmitirCopiaLicenciaVencida() {

        Licencia licencia = new Licencia();
        licencia.setFechaVencimiento(LocalDate.now().minusDays(1));

        when(licenciaRepository.findById(1L))
                .thenReturn(Optional.of(licencia));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> copiaLicenciaService.emitirCopia(1L, 2L));

        assertTrue(ex.getMessage().contains("La licencia no se encuentra vigente"));

        verifyNoInteractions(usuarioRepository);
        verify(copiaLicenciaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Emitir copia: lanza excepción si el usuario no existe")
    void testEmitirCopiaUsuarioInexistente() {

        Licencia licencia = new Licencia();
        licencia.setFechaVencimiento(LocalDate.now().plusYears(1));

        when(licenciaRepository.findById(1L))
                .thenReturn(Optional.of(licencia));

        when(usuarioRepository.findById(2L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> copiaLicenciaService.emitirCopia(1L, 2L));

        assertEquals("No se encontró el usuario operador con ID 2",
                ex.getMessage());

        verify(copiaLicenciaRepository, never()).save(any());
    }

}