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
import tp.metodosAgiles.gestionLicencias.entity.enums.EstadoLicencia;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas Unitarias - LicenciaService")
class LicenciaServiceTest {

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

    @Test
    @DisplayName("Edad mínima: Clase B con 17 años es válida")
    void testValidarEdadMinimaClaseB() {
        LocalDate nacimiento = LocalDate.now().minusYears(17);

        assertTrue(validatorService.validarEdadMinima(nacimiento, "B"));
    }

    @Test
    @DisplayName("Edad mínima: Clase C con 20 años no es válida")
    void testValidarEdadMinimaClaseCInvalida() {
        LocalDate nacimiento = LocalDate.now().minusYears(20);

        assertFalse(validatorService.validarEdadMinima(nacimiento, "C"));
    }

    @Test
    @DisplayName("Edad mínima: Clase E con 21 años es válida")
    void testValidarEdadMinimaClaseEValida() {
        LocalDate nacimiento = LocalDate.now().minusYears(21);

        assertTrue(validatorService.validarEdadMinima(nacimiento, "E"));
    }

    @Test
    @DisplayName("Primera licencia profesional a los 66 años no permitida")
    void testEdadMaximaProfesionalPrimeraVez() {
        LocalDate nacimiento = LocalDate.now().minusYears(66);

        assertFalse(validatorService.validarEdadMaximaProfesionalPrimeraVez(
                nacimiento, "C", true));
    }

    @Test
    @DisplayName("Renovación profesional a los 70 años permitida")
    void testEdadMaximaRenovacion() {
        LocalDate nacimiento = LocalDate.now().minusYears(70);

        assertTrue(validatorService.validarEdadMaximaProfesionalPrimeraVez(
                nacimiento, "C", false));
    }

    @Test
    @DisplayName("Costo inválido cuando la vigencia no existe")
    void testCostoVigenciaInvalida() {
        assertEquals(-1,
                validatorService.calcularCostoLicencia(8, ClaseLicencia.A));
    }

    @Test
    @DisplayName("Costo clase G")
    void testCostoClaseG() {
        assertEquals(40,
                validatorService.calcularCostoLicencia(5, ClaseLicencia.G));
    }

    @Test
    @DisplayName("Historial Profesional: Clase B menor a un año")
    void testHistorialProfesionalMenorAUnAnio() {

        Long titularId = 10L;

        Licencia licencia = new Licencia();
        licencia.setFechaEmision(LocalDate.now().minusMonths(8));

        when(licenciaRepository.findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(
                titularId, ClaseLicencia.B))
                .thenReturn(Optional.of(licencia));

        assertFalse(
                validatorService.validarHistorialProfesional(titularId, "C"));
    }

    @Test
    @DisplayName("No se valida historial para clases no profesionales")
    void testHistorialNoProfesional() {

        assertTrue(
                validatorService.validarHistorialProfesional(1L, "A"));

        verifyNoInteractions(licenciaRepository);
    }

    @Test
    @DisplayName("Estado vigente")
    void testEstadoVigente() {

        Licencia licencia = new Licencia();
        licencia.setFechaVencimiento(LocalDate.now().plusDays(10));

        assertEquals(
                EstadoLicencia.VIGENTE,
                validatorService.obtenerEstadoLicencia(licencia));
    }

    @Test
    @DisplayName("Estado expirada")
    void testEstadoExpirada() {

        Licencia licencia = new Licencia();
        licencia.setFechaVencimiento(LocalDate.now().minusDays(1));

        assertEquals(
                EstadoLicencia.EXPIRADA,
                validatorService.obtenerEstadoLicencia(licencia));
    }
}