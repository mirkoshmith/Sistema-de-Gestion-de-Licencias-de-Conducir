package tp.metodosAgiles.gestionLicencias.util;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;

public final class DateUtils {

    private static final DateTimeFormatter FORMATO = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private DateUtils() {
        throw new UnsupportedOperationException("Clase utilitaria");
    }

    public static int calcularEdad(LocalDate fechaNacimiento, LocalDate fechaActual) {
        return Period.between(fechaNacimiento, fechaActual).getYears();
    }

    public static LocalDate calcularVencimientoProximoCumpleanios(LocalDate fechaNacimiento, int aniosVigencia) {
        return fechaNacimiento.withYear(LocalDate.now().getYear() + aniosVigencia);
    }

    public static String formatearFecha(LocalDate fecha) {
        if (fecha == null) {
            return null;
        }
        return fecha.format(FORMATO);
    }
}