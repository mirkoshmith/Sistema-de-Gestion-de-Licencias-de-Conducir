package tp.metodosAgiles.gestionLicencias.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;

import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.TipoDocumento;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.TitularRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
}