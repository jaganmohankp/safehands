package helpinghands.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.inventory.entity.DonationItem;

public interface FoodRepository extends JpaRepository<DonationItem, Long> {

	List<DonationItem> findByCategory(String category);
	
	List<DonationItem> findByCategoryAndClassification(String category, String classification);
	
	DonationItem findByCategoryAndClassificationAndDescription(String category, String classification, String description);
	
	List<DonationItem> findByValueEquals(Double value);
	
}
