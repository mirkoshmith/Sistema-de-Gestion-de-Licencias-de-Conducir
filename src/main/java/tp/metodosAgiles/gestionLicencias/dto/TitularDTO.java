package tp.metodosAgiles.gestionLicencias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.*;

@Getter
@Setter
public class TitularDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotNull(message = "El tipo de documento es obligatorio")
    private TipoDocumento tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    private String nroDocumento;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotNull(message = "El grupo sanguíneo es obligatorio")
    private GrupoSanguineo grupoSanguineo;

    @NotNull(message = "El factor RH es obligatorio")
    private FactorRh factorRh;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser en el pasado")
    private LocalDate fechaNacimiento;

    @NotNull(message = "Debe especificar si es donante de órganos")
    private Boolean donante;

    @NotNull(message = "La clase solicitada es obligatoria")
    private ClaseLicencia claseSolicitada;
}