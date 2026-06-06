package tp.metodosAgiles.gestionLicencias.services;

import java.time.LocalDate;
import java.time.Period;
import org.springframework.stereotype.Service;

@Service
public class LicenciaService {

    public int calcularVigenciaAnios(LocalDate fechaNacimiento, boolean esPrimeraVez) {
        if (fechaNacimiento == null) {
            return -1;
        }
        
        int edad = Period.between(fechaNacimiento, LocalDate.now()).getYears();

        if (edad < 17) {
            return -1;
        }
        if (edad <= 21) {
            return esPrimeraVez ? 1 : 3;
        }
        if (edad <= 46) {
            return 5;
        }
        if (edad <= 60) {
            return 4;
        }
        if (edad <= 70) {
            return 3;
        }
        return 1;
    }
}
