package tp.metodosAgiles.gestionLicencias.services;

import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class ClockService {

    public LocalDate getFechaActual() {
        return LocalDate.now();
    }
}
