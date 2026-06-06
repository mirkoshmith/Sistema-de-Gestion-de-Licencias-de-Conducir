package tp.metodosAgiles.gestionLicencias.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.metodosAgiles.gestionLicencias.services.PdfDocumentoService;
import tp.metodosAgiles.gestionLicencias.services.LicenciaValidatorService;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    // Inyecto el servicio que genera el PDF
    @Autowired
    private PdfDocumentoService pdfDocumentoService;

    // Inyecto el servicio que contiene la matriz de costos
    @Autowired
    private LicenciaValidatorService licenciaValidatorService;

    @GetMapping("/comprobante")
    public ResponseEntity<byte[]> descargarComprobante(
            @RequestParam String nombre,
            @RequestParam String dni,
            @RequestParam String clase,
            @RequestParam int vigencia) {
        
        try {
            // Convertimos el texto de la URL (ej. "B") al Enum de Java
            ClaseLicencia claseEnum = ClaseLicencia.valueOf(clase.toUpperCase());

            // Para utilizar la Matriz de Costos llamo al método que cruza la clase y la vigencia en la matriz
            int costoBaseCalculado = licenciaValidatorService.calcularCostoLicencia(vigencia, claseEnum);

            // Si la matriz devuelve -1, significa que enviaron una vigencia o clase inválida
            if (costoBaseCalculado == -1) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            
            // Llamamos al servicio que creaste en el paso anterior
            byte[] pdfBytes = pdfDocumentoService.generarComprobantePago(nombre, dni, clase, costoBaseCalculado);

            // Configuramos los encabezados HTTP para que el navegador sepa que es un PDF descargable
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);

            // Le dice al navegador explícitamente "Soy un archivo, descárgame"
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"comprobante-" + dni + ".pdf\"");

            // Agrego esta línea para decirle al navegador exactamente cuánto pesa el archivo y así no haya problemas en al descarga
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Agrego un Endpoint nuevo para la T-10: Descargar un PDF con el detalle de la licencia (nombre, DNI, clase, vigencia, fecha de emisión)
    @GetMapping("/licencia/{id}")
    public ResponseEntity<byte[]> descargarLicenciaFisica(@PathVariable("id") Long id) {
        try {
            // Llamamos al nuevo método pasándole el ID de la URL
            byte[] pdfBytes = pdfDocumentoService.generarLicenciaFisica(id);

            // Configuramos los encabezados (Usamos 'inline' igual que en el ticket)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"licencia-" + id + ".pdf\"");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            // Si el ID no existe o hay un error, devolvemos un 404 o 500
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}