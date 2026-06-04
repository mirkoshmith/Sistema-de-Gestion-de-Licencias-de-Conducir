package tp.metodosAgiles.gestionLicencias.util;

import java.time.LocalDate;
import java.time.Period;

public final class DateUtils {

    private DateUtils() {
        throw new UnsupportedOperationException("Clase utilitaria");
    }

    public static int calcularEdad(LocalDate fechaNacimiento, LocalDate fechaActual) {
        return Period.between(fechaNacimiento, fechaActual).getYears();
    }

    public static LocalDate calcularVencimientoProximoCumpleanios(LocalDate fechaNacimiento, int aniosVigencia) {
        return fechaNacimiento.withYear(LocalDate.now().getYear() + aniosVigencia);
    }
}