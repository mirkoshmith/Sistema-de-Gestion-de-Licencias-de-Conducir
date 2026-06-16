package tp.metodosAgiles.gestionLicencias.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.dto.TitularUpdateDTO;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.repository.LicenciaRepository;
import tp.metodosAgiles.gestionLicencias.repository.TitularRepository;


@Service
public class TitularService {

    @Autowired
    private TitularRepository titularRepository;

    @Autowired
    private LicenciaRepository licenciaRepository;

    private static final Logger log = LoggerFactory.getLogger(TitularService.class);

    public TitularService() {
    }

    @Transactional
    public void registrarNuevoTitular(TitularDTO dto) {
        // Validación de regla de negocio: no duplicar documentos
        if (titularRepository.existsByTipoDocumentoAndNroDocumento(dto.getTipoDocumento(), dto.getNroDocumento())) {
            throw new IllegalArgumentException("Ya existe un titular registrado con ese tipo y número de documento.");
        }

        // Mapeo manual de DTO a Entidad
        Titular titular = new Titular();
        titular.setNombre(dto.getNombre());
        titular.setApellido(dto.getApellido());
        titular.setTipoDocumento(dto.getTipoDocumento());
        titular.setNroDocumento(dto.getNroDocumento());
        titular.setDireccion(dto.getDireccion());
        titular.setGrupoSanguineo(dto.getGrupoSanguineo());
        titular.setFactorRh(dto.getFactorRh());
        titular.setFechaNacimiento(dto.getFechaNacimiento());
        titular.setDonante(dto.getDonante());
        titular.setClaseSolicitada(dto.getClaseSolicitada());

        // Guardar en la base de datos
        titularRepository.save(titular);
    }

    public boolean esPrimeraLicencia(Licencia licencia) {
        Titular titular = licencia.getTitular();
        if (titular == null)
            return true;
        Licencia primera = licenciaRepository
                .findFirstByTitularIdOrderByFechaEmisionAsc(titular.getId())
                .orElse(null);
        if (licencia.equals(primera)) {
            return true;
        } else
            return false;
    }

    @Transactional
    public String modificarDatosTitular(Long idTitular, TitularUpdateDTO dto) {
        // Buscamos al titular
        Titular titular = titularRepository.findById(idTitular)
                .orElseThrow(() -> new RuntimeException("Titular no encontrado en el sistema."));

        boolean huboCambios = false;

        // Actualizamos solo los campos permitidos si vienen con datos nuevos
        if (dto.getDireccion() != null && !dto.getDireccion().equals(titular.getDireccion())) {
            titular.setDireccion(dto.getDireccion());
            huboCambios = true;
        }
        if (dto.getGrupoSanguineo() != null && !dto.getGrupoSanguineo().equals(titular.getGrupoSanguineo())) {
            titular.setGrupoSanguineo(dto.getGrupoSanguineo());
            huboCambios = true;
        }
        if (dto.getDonante() != null && !dto.getDonante().equals(titular.getDonante())) {
            titular.setDonante(dto.getDonante());
            huboCambios = true;
        }

        if (!huboCambios) {
            return "No se detectaron cambios en los datos enviados.";
        }

        // Guardamos los cambios
        titularRepository.save(titular);

        // Registramos en auditoría (quién y cuándo)
        log.info("AUDITORÍA - Modificación Titular: El usuario administrador con ID {} modificó los datos del titular {} {} (DNI: {}) el día {}", 
                dto.getIdUsuarioAdministrador(), titular.getNombre(), titular.getApellido(), titular.getNroDocumento(), java.time.LocalDate.now());

        // Notificamos la posibilidad de renovación
        return "Datos actualizados correctamente. Atención: Debido a la modificación de sus datos personales, el titular ahora se encuentra habilitado para solicitar la renovación de su licencia.";
    }

}