package tp.metodosAgiles.gestionLicencias.services;

import java.io.ByteArrayOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

@Service
public class PdfDocumentoService {
    @Autowired
    private tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository licenciaRepository;

    @Autowired
    private TemplateEngine templateEngine; // Thymeleaf nos provee esto automáticamente

    public byte[] generarComprobantePago(String nombreTitular, String dni, String clase, int costoBase) throws Exception {
        
        // 1. Preparar las variables que Thymeleaf va a inyectar en el HTML
        Context context = new Context();
        context.setVariable("nombreTitular", nombreTitular);
        context.setVariable("dniTitular", dni);
        context.setVariable("clase", clase);
        context.setVariable("costoBase", costoBase);
        
        // Sumamos los $8 fijos de gastos administrativos requeridos por la cátedra
        context.setVariable("costoTotal", costoBase + 8); 

        // 2. Procesar la plantilla (busca el archivo "comprobante-pago.html" en la carpeta templates)
        String htmlContent = templateEngine.process("comprobante-pago", context);

        // 3. Convertir el HTML renderizado a un archivo PDF (formato byte array)
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null); // Renderiza el PDF basado en nuestro HTML
            builder.toStream(outputStream);
            builder.run();
            
            return outputStream.toByteArray();
        }

        /*
        Cómo funciona:
        1. El Context: Funciona como un diccionario. Relaciona los datos de Java (nombreTitular, costoBase) con las etiquetas th:text que pusimos en el archivo HTML.

        2. El TemplateEngine: Agarra el HTML crudo, le pega los datos reales, y devuelve un gran texto de código HTML ya personalizado con los datos de Juan Perez o del titular que sea.

        3. El PdfRendererBuilder: Es la magia de OpenHTMLToPDF. Toma ese código web, lo dibuja internamente y lo exporta como un arreglo de bytes (byte[]), que es la forma en la que las computadoras procesan los archivos listos para descargar.
        */
    }

    // Método para la T-10: Generar un PDF con el detalle de la licencia (nombre, DNI, clase, vigencia, fecha de emisión)
    public byte[] generarLicenciaFisica(Long licenciaId) throws Exception {
        
        // 1. Buscar la licencia en la base de datos (y su titular asociado)
        // Usamos la clase completa y manejamos la excepción si no existe
        tp.metodosAgiles.gestionLicencias.entity.Licencia licencia = licenciaRepository.findById(licenciaId)
                .orElseThrow(() -> new RuntimeException("Licencia no encontrada"));
        
        tp.metodosAgiles.gestionLicencias.entity.Titular titular = licencia.getTitular();

        // 2. Preparar el contexto con TODOS los datos para el frente y el dorso
        Context context = new Context();
        
        // DATOS DEL FRENTE
        context.setVariable("nombre", titular.getNombre());
        context.setVariable("apellido", titular.getApellido());
        context.setVariable("dni", titular.getNroDocumento()); // Corregido
        context.setVariable("direccion", titular.getDireccion() != null ? titular.getDireccion() : "");
        context.setVariable("fechaNacimiento", titular.getFechaNacimiento().toString());
        
        context.setVariable("clase", licencia.getClase().name());
        context.setVariable("fechaEmision", licencia.getFechaEmision().toString());
        context.setVariable("fechaVencimiento", licencia.getFechaVencimiento().toString());
        
        // DATOS DEL DORSO
        // Armamos el grupo sanguíneo completo concatenando los dos Enums (Ej: "A+" o "O POSITIVO")
        String sangre = (titular.getGrupoSanguineo() != null ? titular.getGrupoSanguineo().name() : "") + " " +
                        (titular.getFactorRh() != null ? titular.getFactorRh().name() : "");
        context.setVariable("grupoSanguineo", sangre.trim()); 
        
        // Corregido "Donante" y agregamos validación por si el Boolean viene nulo
        context.setVariable("donante", (titular.getDonante() != null && titular.getDonante()) ? "SI" : "NO");
        
        // Corregido el nombre de las limitaciones
        context.setVariable("observaciones", licencia.getObservacionesLimitaciones() != null ? licencia.getObservacionesLimitaciones() : "Ninguna");

        // 3. Procesar la plantilla HTML (buscaremos el archivo "licencia-fisica.html")
        String htmlContent = templateEngine.process("licencia-fisica", context);

        // 4. Convertir a PDF
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();
            
            return outputStream.toByteArray();
        }
    }
}