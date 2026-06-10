package tp.metodosAgiles.gestionLicencias.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.services.LicenciaService;
import tp.metodosAgiles.gestionLicencias.services.PdfDocumentoService;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pruebas de Controlador - DocumentoController")
public class DocumentoControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PdfDocumentoService pdfDocumentoService;

    @Mock
    private LicenciaService licenciaValidatorService;

    @InjectMocks
    private DocumentoController documentoController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(documentoController).build();
    }

    @Test
    @DisplayName("Caso exitoso: Descargar comprobante genera PDF con headers correctos")
    void testDescargarComprobante_Ok() throws Exception {
        byte[] pdfMockeado = new byte[] { 1, 2, 3, 4 };

        when(licenciaValidatorService.calcularCostoLicencia(5, ClaseLicencia.B)).thenReturn(40);
        when(pdfDocumentoService.generarComprobantePago("Juan Perez", "12345678", "B", 40))
                .thenReturn(pdfMockeado);

        mockMvc.perform(get("/api/documentos/comprobante")
                .param("nombre", "Juan Perez")
                .param("dni", "12345678")
                .param("clase", "B")
                .param("vigencia", "5"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition", "inline; filename=\"comprobante-12345678.pdf\""))
                .andExpect(content().bytes(pdfMockeado));
    }

    @Test
    @DisplayName("Caso alternativo: Retorna 400 Bad Request si la combinación de la matriz no es válida")
    void testDescargarComprobante_MatrizInvalida() throws Exception {
        when(licenciaValidatorService.calcularCostoLicencia(2, ClaseLicencia.A)).thenReturn(-1);

        mockMvc.perform(get("/api/documentos/comprobante")
                .param("nombre", "Ana Gomez")
                .param("dni", "87654321")
                .param("clase", "A")
                .param("vigencia", "2"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(pdfDocumentoService);
    }
}