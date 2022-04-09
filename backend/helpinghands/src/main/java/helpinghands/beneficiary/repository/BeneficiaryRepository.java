package helpinghands.beneficiary.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.beneficiary.entity.Beneficiary;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
		
	Beneficiary findByUserUsername(String username);
		
}
