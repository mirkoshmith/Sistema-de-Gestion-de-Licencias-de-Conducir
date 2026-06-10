package tp.metodosAgiles.gestionLicencias.services;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Optional;

import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias - LicenciaValidatorService")
class LicenciaValidatorServiceTest {

    @Mock
    private LicenciaRepository licenciaRepository;

    @InjectMocks
    private LicenciaService validatorService;

    @Test
    @DisplayName("Historial Profesional: Retorna true si tiene licencia B con más de un año de antigüedad")
    void testValidarHistorialProfesional_Valido() {
        Long titularId = 1L;
        Licencia licenciaBExistente = new Licencia();
        // Emitida hace 2 años: cumple con el requisito de antigüedad de un año
        licenciaBExistente.setFechaEmision(LocalDate.now().minusYears(2));

        when(licenciaRepository.findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(titularId, ClaseLicencia.B))
                .thenReturn(Optional.of(licenciaBExistente));

        boolean aptoParaProfesional = validatorService.validarHistorialProfesional(titularId, "C");

        assertTrue(aptoParaProfesional);
        verify(licenciaRepository).findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(titularId, ClaseLicencia.B);
    }

    @Test
    @DisplayName("Historial Profesional: Retorna false si no posee una licencia Clase B previa")
    void testValidarHistorialProfesional_InvalidoSinClaseB() {
        Long titularId = 2L;

        when(licenciaRepository.findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(titularId, ClaseLicencia.B))
                .thenReturn(Optional.empty());

        boolean aptoParaProfesional = validatorService.validarHistorialProfesional(titularId, "D");

        assertFalse(aptoParaProfesional);
    }

    @Test
    @DisplayName("Matriz de costos: Cálculos de valores límite fijos")
    void testCalcularCostoLicencia_VerificarLimites() {
        assertEquals(40, validatorService.calcularCostoLicencia(5, ClaseLicencia.A));
        assertEquals(47, validatorService.calcularCostoLicencia(5, ClaseLicencia.C));
        assertEquals(29, validatorService.calcularCostoLicencia(1, ClaseLicencia.E));
        assertEquals(-1, validatorService.calcularCostoLicencia(3, null));
    }
}