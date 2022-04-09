package helpinghands.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.admin.entity.AdminSettings;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface AdminRepository extends JpaRepository<AdminSettings, Long>{
	
	/**
	 * Retrieves the admin settings with the assistance of JPA Repository's find by id function
	 * @param id
	 * @return Admin Settings that have been stored in the database
	 */
	Optional<AdminSettings> findById(Long id);
	
}
