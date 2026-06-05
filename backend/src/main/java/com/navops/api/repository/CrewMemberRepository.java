package com.navops.api.repository;

import com.navops.api.domain.entity.CrewMember;
import com.navops.api.domain.enums.CrewMemberStatusEnum;
import com.navops.api.domain.enums.PeopleStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CrewMemberRepository extends JpaRepository<CrewMember, UUID> {

    Optional<CrewMember> findByIdAndDeletedAtIsNull(UUID id);

    // Consulta nativa para obtener el valor de la secuencia
    @Query(value = "SELECT nextval('personnel_file_seq')", nativeQuery = true)
    Long getNextFileSequenceValue();

    boolean existsByFileNumber(String fileNumber);
    boolean existsByMaritimeBookNumber(String maritimeBookNumber);
    boolean existsByFileNumberAndIdNot(String fileNumber, UUID id);
    boolean existsByMaritimeBookNumberAndIdNot(String maritimeBookNumber, UUID id);
    long countByStatus(CrewMemberStatusEnum status);

    // 1. Contar todos los usuarios en el sistema
    @Query("SELECT COUNT(u) FROM User u")
    long countTotalUsers();

    // 2. Contar usuarios activos
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    // 3. Contar tripulantes disponibles (Que no estén en la tabla travel_plan_crew de un viaje en curso)
    // Asumimos que un viaje está "en curso" si su status no es 'COMPLETED' ni 'CANCELLED'
   /* @Query("SELECT COUNT(cm) FROM CrewMember cm " +
            "WHERE cm.status = 'ACTIVE' " + // Solo si están activos laboralmente
            "AND cm.id NOT IN (SELECT tpc.crew_members.id FROM travel_plan_crew tpc " +
            "JOIN tpc.plan tp WHERE tp.status NOT IN ('COMPLETED', 'CANCELLED'))")
    long countAvailableCrew();*/
}
