package tp.metodosAgiles.gestionLicencias.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tp.metodosAgiles.gestionLicencias.entity.Licencia;
import tp.metodosAgiles.gestionLicencias.entity.enums.ClaseLicencia;

@Repository
public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByTitularId(Long id);

    Optional<Licencia> findFirstByTitularIdOrderByFechaEmisionAsc(Long titularId);

    // H1 -> (T-03): Busca la licencia más antigua de una clase específica para un
    // titular
    Optional<Licencia> findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(Long titularId, ClaseLicencia clase);

    Optional<Licencia> findByTitular_NroDocumento(String nroDocumento);

    Optional<Licencia> findByTitularAndNroDocumentoOrderByFechaVencimientoDesc(String nroDocumento);

    List<Licencia> findByFechaVencimientoBeforeOrderByFechaVencimientoDesc(LocalDate fecha);

    @org.springframework.data.jpa.repository.Query("SELECT l FROM Licencia l JOIN l.titular t WHERE l.fechaVencimiento >= :hoy " +
           "AND (:nombre IS NULL OR t.nombre LIKE %:nombre%) " +
           "AND (:apellido IS NULL OR t.apellido LIKE %:apellido%) " +
           "AND (:grupoSanguineo IS NULL OR CAST(t.grupoSanguineo as string) = :grupoSanguineo) " +
           "AND (:factorRh IS NULL OR CAST(t.factorRh as string) = :factorRh) " +
           "AND (:donante IS NULL OR t.donante = :donante)")
    List<Licencia> findLicenciasVigentesByFiltros(
            @org.springframework.data.repository.query.Param("hoy") java.time.LocalDate hoy,
            @org.springframework.data.repository.query.Param("nombre") String nombre,
            @org.springframework.data.repository.query.Param("apellido") String apellido,
            @org.springframework.data.repository.query.Param("grupoSanguineo") String grupoSanguineo,
            @org.springframework.data.repository.query.Param("factorRh") String factorRh,
            @org.springframework.data.repository.query.Param("donante") Boolean donante
    );
}