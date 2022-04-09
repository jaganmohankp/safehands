package helpinghands.request.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.request.entity.Request;

public interface RequestRepository extends JpaRepository<Request, Long>{
	
	List<Request> findByBeneficiaryUserUsername(String beneficiary);
	
	Optional<Request> findById(Long id);
	
}
