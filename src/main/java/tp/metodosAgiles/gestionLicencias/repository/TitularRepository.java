package tp.metodosAgiles.gestionLicencias.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tp.metodosAgiles.gestionLicencias.entity.Titular;
import tp.metodosAgiles.gestionLicencias.entity.enums.TipoDocumento;

@Repository
public interface TitularRepository extends JpaRepository<Titular, Long> {
    Optional<Titular> findByTipoDocumentoAndNroDocumento(TipoDocumento tipoDocumento, String nroDocumento);

    boolean existsByTipoDocumentoAndNroDocumento(TipoDocumento tipoDocumento, String nroDocumento);
}
