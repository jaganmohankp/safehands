package helpinghands.inventory.service;

import java.util.List;

import helpinghands.inventory.dto.BarcodeResponseDTO;
import helpinghands.inventory.dto.DonationItemDTO;
import helpinghands.inventory.entity.DonationItem;

public interface FoodService {
	
	List<DonationItem> retrieveAllFoodItems();
	
	List<DonationItem> retrieveAllFoodItemsInCategory(final String categoryName);
	
	List<DonationItem> retrieveFoodItemsByCategoryAndClassification(final String categoryName, final String classificationName);
	
	void createFoodItem(final DonationItemDTO foodItem);
	
	void overwriteFoodItemQuantity(final DonationItemDTO foodItem);
	
	void modifyFoodItemQuantity(final DonationItemDTO foodItem);
	
	void resetInventoryQuantity();
	
	BarcodeResponseDTO readBarcode(final String barcode);
	
}
