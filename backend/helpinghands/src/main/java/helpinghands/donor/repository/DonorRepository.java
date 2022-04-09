package helpinghands.donor.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.donor.entity.Donor;

public interface DonorRepository extends JpaRepository<Donor, Long> {

	Donor findByName(String name);
	
	Optional<Donor> findById(Long id);
	
}
