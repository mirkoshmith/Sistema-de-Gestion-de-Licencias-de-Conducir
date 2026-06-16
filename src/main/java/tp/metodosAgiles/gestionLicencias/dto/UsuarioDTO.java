package tp.metodosAgiles.gestionLicencias.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import tp.metodosAgiles.gestionLicencias.entity.enums.RolUsuario;

@Getter
@Setter
public class UsuarioDTO {
    @NotBlank(message = "El usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotNull(message = "El rol es obligatorio")
    private RolUsuario rol;
}
