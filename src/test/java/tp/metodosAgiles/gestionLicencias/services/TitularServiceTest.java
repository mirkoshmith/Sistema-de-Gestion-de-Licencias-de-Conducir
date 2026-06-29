package tp.metodosAgiles.gestionLicencias.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.dto.TitularUpdateDTO;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.GrupoSanguineo;
import tp.metodosAgiles.gestionLicencias.entity.enums.TipoDocumento;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.TitularRepository;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias - TitularService")
class TitularServiceTest {

    @Mock
    private TitularRepository titularRepository;

    @Mock
    private LicenciaRepository licenciaRepository;

    @InjectMocks
    private TitularService titularService;

    @Test
    @DisplayName("Alta Titular: Excepciona correctamente si el DNI ya está registrado")
    void testRegistrarNuevoTitular_DocumentoYaExistente() {
        TitularDTO dto = new TitularDTO();
        dto.setTipoDocumento(TipoDocumento.DNI);
        dto.setNroDocumento("40999888");

        when(titularRepository.existsByTipoDocumentoAndNroDocumento(TipoDocumento.DNI, "40999888"))
                .thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            titularService.registrarNuevoTitular(dto);
        });

        assertEquals("Ya existe un titular registrado con ese tipo y número de documento.", exception.getMessage());

        verify(titularRepository, never()).save(any());
    }

    @Test
    @DisplayName("Alta Titular: Flujo mapea campos y persiste exitosamente al no haber duplicados")
    void testRegistrarNuevoTitular_Exito() {
        TitularDTO dto = new TitularDTO();
        dto.setNombre("Carlos");
        dto.setApellido("Sainz");
        dto.setTipoDocumento(TipoDocumento.DNI);
        dto.setNroDocumento("38555444");
        dto.setFechaNacimiento(LocalDate.of(1995, 5, 20));
        dto.setClaseSolicitada(ClaseLicencia.B);

        when(titularRepository.existsByTipoDocumentoAndNroDocumento(TipoDocumento.DNI, "38555444"))
                .thenReturn(false);

        assertDoesNotThrow(() -> titularService.registrarNuevoTitular(dto));

        verify(titularRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Es primera licencia cuando la licencia no posee titular")
    void testEsPrimeraLicenciaSinTitular() {

        Licencia licencia = new Licencia();

        assertTrue(titularService.esPrimeraLicencia(licencia));

        verifyNoInteractions(licenciaRepository);
    }

    @Test
    @DisplayName("Es primera licencia cuando coincide con la primera registrada")
    void testEsPrimeraLicencia() {

        Titular titular = new Titular();
        titular.setId(1L);

        Licencia licencia = new Licencia();
        licencia.setTitular(titular);

        when(licenciaRepository.findFirstByTitularIdOrderByFechaEmisionAsc(1L))
                .thenReturn(Optional.of(licencia));

        assertTrue(titularService.esPrimeraLicencia(licencia));
    }

    @Test
    @DisplayName("No es primera licencia cuando existe una anterior")
    void testNoEsPrimeraLicencia() {

        Titular titular = new Titular();
        titular.setId(1L);

        Licencia licenciaNueva = new Licencia();
        licenciaNueva.setTitular(titular);

        Licencia licenciaVieja = new Licencia();
        licenciaVieja.setTitular(titular);

        when(licenciaRepository.findFirstByTitularIdOrderByFechaEmisionAsc(1L))
                .thenReturn(Optional.of(licenciaVieja));

        assertFalse(titularService.esPrimeraLicencia(licenciaNueva));
    }

    @Test
    @DisplayName("Modificar datos: lanza excepción si el titular no existe")
    void testModificarDatosTitularNoExiste() {

        when(titularRepository.findById(1L))
                .thenReturn(Optional.empty());

        TitularUpdateDTO dto = new TitularUpdateDTO();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> titularService.modificarDatosTitular(1L, dto));

        assertEquals("Titular no encontrado en el sistema.", ex.getMessage());
    }

    @Test
    @DisplayName("Modificar datos: no detecta cambios")
    void testModificarDatosSinCambios() {

        Titular titular = new Titular();
        titular.setDireccion("San Martín");
        titular.setGrupoSanguineo(GrupoSanguineo.A);
        titular.setDonante(true);

        when(titularRepository.findById(1L))
                .thenReturn(Optional.of(titular));

        TitularUpdateDTO dto = new TitularUpdateDTO();
        dto.setDireccion("San Martín");
        dto.setGrupoSanguineo(GrupoSanguineo.A);
        dto.setDonante(true);

        String mensaje = titularService.modificarDatosTitular(1L, dto);

        assertEquals("No se detectaron cambios en los datos enviados.", mensaje);

        verify(titularRepository, never()).save(any());
    }

    @Test
    @DisplayName("Modificar datos: actualiza la dirección")
    void testModificarDireccion() {

        Titular titular = new Titular();
        titular.setNombre("Juan");
        titular.setApellido("Perez");
        titular.setNroDocumento("123");
        titular.setDireccion("Vieja");
        titular.setGrupoSanguineo(GrupoSanguineo.A);
        titular.setDonante(true);

        when(titularRepository.findById(1L))
                .thenReturn(Optional.of(titular));

        TitularUpdateDTO dto = new TitularUpdateDTO();
        dto.setDireccion("Nueva");
        dto.setIdUsuarioAdministrador(10L);

        String mensaje = titularService.modificarDatosTitular(1L, dto);

        assertTrue(mensaje.contains("Datos actualizados"));

        assertEquals("Nueva", titular.getDireccion());

        verify(titularRepository).save(titular);
    }

}