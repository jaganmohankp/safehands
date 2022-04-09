package helpinghands.packing.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.packing.entity.PackingList;

public interface PackingRepository extends JpaRepository<PackingList, Long> {

	PackingList findByBeneficiaryUserUsername(String beneficiary);
	
	Optional<PackingList> findById(Long id);
	
	List<PackingList> findListById(Long id);
	
	List<PackingList> findByPackingStatusFalse();
	
	List<PackingList> findByCreationDateBetween(Date startDate, Date endDate);
	
}
