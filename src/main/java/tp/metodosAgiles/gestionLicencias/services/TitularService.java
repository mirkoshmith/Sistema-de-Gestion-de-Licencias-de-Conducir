package tp.metodosAgiles.gestionLicencias.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
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

}