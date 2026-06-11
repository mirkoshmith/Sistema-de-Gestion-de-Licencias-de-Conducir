package tp.metodosAgiles.gestionLicencias.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.services.TitularService;

@RestController
@RequestMapping("/api/titulares")
@CrossOrigin(origins = "http://localhost:3000")
public class TitularController {

    private final TitularService titularService;

    public TitularController(TitularService titularService) {
        this.titularService = titularService;
    }

    @PostMapping("/alta")
    public ResponseEntity<?> darDeAltaTitular(@Valid @RequestBody TitularDTO titularDTO) {
        try {
            titularService.registrarNuevoTitular(titularDTO);
            return ResponseEntity.ok("Titular registrado con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}