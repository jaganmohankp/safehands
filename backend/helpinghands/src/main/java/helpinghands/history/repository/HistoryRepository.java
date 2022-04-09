package helpinghands.history.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.history.entity.RequestHistory;

public interface HistoryRepository extends JpaRepository<RequestHistory, Long> {

	RequestHistory findByBeneficiaryUserUsername(final String username);
	
}
