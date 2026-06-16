package tp.metodosAgiles.gestionLicencias.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import tp.metodosAgiles.gestionLicencias.dto.TitularDTO;
import tp.metodosAgiles.gestionLicencias.dto.TitularUpdateDTO;
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

    @PutMapping("/modificar/{id}")
    public ResponseEntity<?> modificarTitular(
            @PathVariable Long id, 
            @RequestBody TitularUpdateDTO dto) {
        try {
            // El servicio nos devuelve el texto con la notificación de renovación
            String mensaje = titularService.modificarDatosTitular(id, dto);
            return ResponseEntity.ok(mensaje);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}