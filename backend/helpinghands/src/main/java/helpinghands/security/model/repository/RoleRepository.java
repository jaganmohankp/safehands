package helpinghands.security.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.security.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findById(Long beneficiary);

}
