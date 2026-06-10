package tp.metodosAgiles.gestionLicencias.services;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;

@Service
public class LicenciaService {

    private final TitularService titularService = new TitularService();

    // Inyecto el Repositorio de Licencias para (T-03) [Mirko]
    @Autowired
    private LicenciaRepository licenciaRepository;
    // --------------------------------------------------

    public boolean validarEdadMinima(LocalDate fechaNacimiento, String claseSolicitada) {
        int edad = calcularEdad(fechaNacimiento);

        // Lógica para Clases C, D y E (mínimo 21 años)
        if (claseSolicitada.matches("[CDE]")) {
            return edad >= 21;
        }

        // Lógica para el resto de las clases (mínimo 17 años)
        return edad >= 17;
    }

    public boolean validarEdadMaximaProfesionalPrimeraVez(LocalDate fechaNacimiento, String claseSolicitada,
            boolean esPrimeraVez) {
        int edad = calcularEdad(fechaNacimiento);

        // Lógica para no otorgar profesional por primera vez a mayores de 65
        if (claseSolicitada.matches("[CDE]") && esPrimeraVez) {
            return edad <= 65;
        }

        return true;
    }

    private int calcularEdad(LocalDate fechaNacimiento) {
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    // Metodo para calcular la vigencia de la Licencia
    public int calcularVigencia(Licencia licencia) {
        Titular titular = licencia.getTitular();
        LocalDate fechaNacimiento = titular.getFechaNacimiento();
        int edad = calcularEdad(fechaNacimiento);

        boolean esPrimeraVez = titularService.esPrimeraLicencia(licencia);

        // caso imposible
        if (edad < 17)
            return -1;

        // casos reales
        if (edad >= 17 && edad <= 21) {
            if (esPrimeraVez)
                return 1;
            else
                return 3;
        } else if (edad <= 46)
            return 5;
        else if (edad <= 60)
            return 4;
        else if (edad <= 70)
            return 3;
        else
            return 1;

    }

    public int calcularCostoLicencia(int vigencia, ClaseLicencia clase) {
        if (clase == null) {
            return -1;
        }
        return switch (clase) {
            case A, B, G -> switch (vigencia) {
                case 5 -> 40;
                case 4 -> 30;
                case 3 -> 25;
                case 1 -> 20;
                default -> -1;
            };
            case C -> switch (vigencia) {
                case 5 -> 47;
                case 4 -> 35;
                case 3 -> 30;
                case 1 -> 23;
                default -> -1;
            };
            case E -> switch (vigencia) {
                case 5 -> 59;
                case 4 -> 44;
                case 3 -> 39;
                case 1 -> 29;
                default -> -1;
            };
            default -> -1;
        };
    }

    // H1 -> (T-03): Método para validar historial Clase B [Mirko]
    public boolean validarHistorialProfesional(Long titularId, String claseSolicitada) {
        if (!claseSolicitada.matches("[CDE]")) {
            return true;
        }

        java.util.Optional<Licencia> licenciaB = licenciaRepository
                .findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(titularId, ClaseLicencia.B);

        if (licenciaB.isPresent()) {
            java.time.LocalDate fechaEmisionB = licenciaB.get().getFechaEmision();
            java.time.LocalDate haceUnAnioExacto = java.time.LocalDate.now().minusYears(1);

            return !fechaEmisionB.isAfter(haceUnAnioExacto);
        }

        return false;
    }

}