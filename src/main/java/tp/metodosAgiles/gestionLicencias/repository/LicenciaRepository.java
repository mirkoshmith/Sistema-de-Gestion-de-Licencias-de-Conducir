package tp.metodosAgiles.gestionLicencias.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tp.metodosAgiles.gestionLicencias.entity.Licencia;

@Repository
public interface LicenciaRepository extends JpaRepository<Licencia, Long> {
    List<Licencia> findByTitularId(Long id);

    Optional<Licencia> findFirstByTitularIdOrderByFechaEmisionAsc(Long titularId);
}
