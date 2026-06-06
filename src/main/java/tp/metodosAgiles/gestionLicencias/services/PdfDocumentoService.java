package tp.metodosAgiles.gestionLicencias.services;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;

@Service
public class PdfDocumentoService {

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
    }
}

/*
Cómo funciona:
1. El Context: Funciona como un diccionario. Relaciona los datos de Java (nombreTitular, costoBase) con las etiquetas th:text que pusimos en el archivo HTML.

2. El TemplateEngine: Agarra el HTML crudo, le pega los datos reales, y devuelve un gran texto de código HTML ya personalizado con los datos de Juan Perez o del titular que sea.

3. El PdfRendererBuilder: Es la magia de OpenHTMLToPDF. Toma ese código web, lo dibuja internamente y lo exporta como un arreglo de bytes (byte[]), que es la forma en la que las computadoras procesan los archivos listos para descargar.
*/