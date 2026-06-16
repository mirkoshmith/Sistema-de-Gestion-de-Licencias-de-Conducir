package tp.metodosAgiles.gestionLicencias.services;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tp.metodosAgiles.gestionLicencias.dto.CopiaLicenciaDTO;
import tp.metodosAgiles.gestionLicencias.entity.CopiaLicencia;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.Usuario;
import tp.metodosAgiles.gestionLicencias.repository.CopiaLicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.UsuarioRepository;

@Service
public class CopiaLicenciaService {

    @Autowired
    private CopiaLicenciaRepository copiaLicenciaRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public CopiaLicenciaDTO emitirCopia(Long licenciaId, Long usuarioId) {
        // Buscar la licencia y verificar que exista
        Licencia licencia = licenciaRepository.findById(licenciaId)
                .orElseThrow(() -> new RuntimeException("No se encontró la licencia original con ID " + licenciaId));

        // Verificar que esté vigente
        if (licencia.getFechaVencimiento().isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "La licencia no se encuentra vigente. Fecha de vencimiento: " + licencia.getFechaVencimiento());
        }

        // Buscar el usuario operador
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("No se encontró el usuario operador con ID " + usuarioId));

        // Crear objeto CopiaLicencia
        CopiaLicencia copia = new CopiaLicencia();
        copia.setLicenciaOriginal(licencia);
        copia.setUsuarioEmisor(usuario);
        copia.setFechaHoraEmision(LocalDateTime.now());
        copia.setCosto(50);

        // Guardar la copia
        CopiaLicencia copiaGuardada = copiaLicenciaRepository.save(copia);

        // Retornar DTO con titular, clase, vencimiento, costo
        CopiaLicenciaDTO dto = new CopiaLicenciaDTO();
        String nombreCompleto = licencia.getTitular().getNombre() + " " + licencia.getTitular().getApellido();
        dto.setTitular(nombreCompleto);
        dto.setClase(licencia.getClase().toString());
        dto.setVencimiento(licencia.getFechaVencimiento().toString());
        dto.setCosto(copiaGuardada.getCosto());

        return dto;
    }
}
