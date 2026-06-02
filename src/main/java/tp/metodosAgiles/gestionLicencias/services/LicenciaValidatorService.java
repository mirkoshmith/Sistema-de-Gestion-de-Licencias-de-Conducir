import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;

@Service
public class LicenciaValidatorService {

    public boolean validarEdadMinima(LocalDate fechaNacimiento, String claseSolicitada) {
        int edad = calcularEdad(fechaNacimiento);
        
        // Lógica para Clases C, D y E (mínimo 21 años)
        if (claseSolicitada.matches("[CDE]")) {
            return edad >= 21;
        }
        
        // Lógica para el resto de las clases (mínimo 17 años)
        return edad >= 17;
    }

    public boolean validarEdadMaximaProfesionalPrimeraVez(LocalDate fechaNacimiento, String claseSolicitada, boolean esPrimeraVez) {
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
}