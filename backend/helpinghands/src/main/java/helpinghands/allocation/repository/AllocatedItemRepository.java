package helpinghands.allocation.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.allocation.entity.AllocatedFoodItem;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface AllocatedItemRepository extends JpaRepository<AllocatedFoodItem, Long> {

}
