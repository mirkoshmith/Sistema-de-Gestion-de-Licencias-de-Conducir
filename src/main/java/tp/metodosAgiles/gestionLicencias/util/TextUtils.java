package tp.metodosAgiles.gestionLicencias.util;

import java.text.Normalizer;

public class TextUtils {

    public static String normalizarString(String s) {
        if (s == null)
            return "";
        String normalizado = Normalizer.normalize(s.toLowerCase(), Normalizer.Form.NFD);
        return normalizado.replaceAll("\\p{M}", "");
    }

    public static String capitalizarTexto(String texto) {
        if (texto == null || texto.isEmpty()) {
            return texto;
        }
        texto = texto.trim();
        if (texto.isEmpty()) {
            return texto;
        }

        return texto.substring(0, 1).toUpperCase() + texto.substring(1).toLowerCase();
    }
}
