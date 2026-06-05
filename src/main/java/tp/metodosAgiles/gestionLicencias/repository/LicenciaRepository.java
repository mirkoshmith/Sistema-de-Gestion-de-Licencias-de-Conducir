package tp.metodosAgiles.gestionLicencias.repository;

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

    //H1 -> (T-03): Busca la licencia más antigua de una clase específica para un titular
    Optional<Licencia> findFirstByTitularIdAndClaseOrderByFechaEmisionAsc(Long titularId, ClaseLicencia clase);
}