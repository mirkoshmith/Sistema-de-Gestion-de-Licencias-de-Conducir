package tp.metodosAgiles.gestionLicencias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tp.metodosAgiles.gestionLicencias.entity.CopiaLicencia;

@Repository
public interface CopiaLicenciaRepository extends JpaRepository<CopiaLicencia, Long> {
}
