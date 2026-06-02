package tp.metodosAgiles.gestionLicencias.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.repository.TitularRepository;

@Service
public class TitularService {

    private final TitularRepository titularRepository;

    public TitularService(TitularRepository titularRepository) {
        this.titularRepository = titularRepository;
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
}