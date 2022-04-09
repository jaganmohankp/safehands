package helpinghands.allocation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.allocation.entity.Allocation;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface AllocationRepository extends JpaRepository<Allocation, Long>{
	
	Allocation findByBeneficiaryUserUsername(String beneficiary);
	
	Allocation findById(String id);

}
