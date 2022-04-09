package helpinghands.inventory.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import helpinghands.donor.entity.DonatedNPItem;
import helpinghands.donor.entity.Donor;
import helpinghands.donor.repository.DonorRepository;
import helpinghands.inventory.dto.BarcodeResponseDTO;
import helpinghands.inventory.dto.DonationItemDTO;
import helpinghands.inventory.entity.Barcode;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.inventory.repository.BarcodeRepository;
import helpinghands.inventory.repository.FoodRepository;
import helpinghands.inventory.service.FoodService;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.InvalidFoodException;

@Service
public class FoodServiceImpl implements FoodService {

	@Autowired
	private FoodRepository foodRepository;
	
	@Autowired
	private BarcodeRepository barcodeRepository;
	
	@Autowired
	private DonorRepository donorRepository;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@Override
	public List<DonationItem> retrieveAllFoodItems() {
		// TODO Auto-generated method stub
		return foodRepository.findAll();
	}

	@Override
	public List<DonationItem> retrieveAllFoodItemsInCategory(String categoryName) {
		// TODO Auto-generated method stub
		return foodRepository.findByCategory(categoryName);
	}

	@Override
	public List<DonationItem> retrieveFoodItemsByCategoryAndClassification(String categoryName, String classificationName) {
		// TODO Auto-generated method stub
		return foodRepository.findByCategoryAndClassification(categoryName, classificationName);
	}

	@Override
	public void createFoodItem(DonationItemDTO foodItem) {
		// TODO Auto-generated method stub
		String category = foodItem.getCategory();
		String classification = foodItem.getClassification();
		String description = foodItem.getDescription();
		Integer quantity = foodItem.getQuantity();
		Double value = foodItem.getValue();
		DonationItem dbFoodItem = foodRepository.findByCategoryAndClassificationAndDescription(category, classification, description);
		if(dbFoodItem != null) {
			throw new InvalidFoodException(ErrorMessages.DUPLICATE_ITEM);
		}
		foodRepository.save(new DonationItem(category, classification, description, quantity, value));
	}

	@Override
	public void overwriteFoodItemQuantity(DonationItemDTO foodItem) {
		// TODO Auto-generated method stub
		// This method overwrites the existing quantity (e.g. 3 -> 0)
		String category = foodItem.getCategory();
		String classification = foodItem.getClassification();
		String description = foodItem.getDescription();
		DonationItem dbFoodItem = foodRepository.findByCategoryAndClassificationAndDescription(category, classification, description);
		if(dbFoodItem == null) {
			throw new InvalidFoodException(ErrorMessages.NO_SUCH_ITEM);
		}
		dbFoodItem.setQuantity(foodItem.getQuantity());
		dbFoodItem.setValue(foodItem.getValue());
		foodRepository.save(dbFoodItem);
	}

	@Override
	public void modifyFoodItemQuantity(DonationItemDTO foodItem) {
		// TODO Auto-generated method stub
		// This method adds/subtracts the existing quantity (e.g. 3 -> 4)
		// This method is used in stocktaking, but may entail creation of new item due to weight differences
		DonationItem dbFoodItem = null;
		String category = foodItem.getCategory();
		String classification = foodItem.getClassification();
		String description = foodItem.getDescription();
		String barcode = foodItem.getBarcode();
		Integer quantity = foodItem.getQuantity();
		if(barcode != null && !barcode.isEmpty()) {
			Barcode dbBarcode = barcodeRepository.findByBarcode(barcode);
			if(dbBarcode != null) {
				dbFoodItem = dbBarcode.getScannedItem();
				dbFoodItem.setQuantity(dbFoodItem.getQuantity() + quantity);
				foodRepository.save(dbFoodItem);
			} else {
				dbFoodItem = foodRepository.findByCategoryAndClassificationAndDescription(category, classification, description);
				if(dbFoodItem == null) {
					dbFoodItem = new DonationItem(category, classification, description, Integer.valueOf(0), Double.valueOf(0));
					this.template.convertAndSend("/client/notifications", Boolean.TRUE);
				}
				dbFoodItem.setQuantity(dbFoodItem.getQuantity() + quantity);
				Barcode newBarcode = new Barcode(barcode, dbFoodItem);
				barcodeRepository.save(newBarcode);
			}
		} else {
			dbFoodItem = foodRepository.findByCategoryAndClassificationAndDescription(category, classification, description);
			if(dbFoodItem == null) {
				dbFoodItem = new DonationItem(category, classification, description, Integer.valueOf(0), Double.valueOf(0));
			}
			dbFoodItem.setQuantity(dbFoodItem.getQuantity() + quantity);
			foodRepository.save(dbFoodItem);
		}
		if(foodItem.getDonorName() != null && !foodItem.getDonorName().isEmpty()) {
			Donor dbDonor = donorRepository.findByName(foodItem.getDonorName());
			if(dbDonor == null) {
				dbDonor = new Donor(foodItem.getDonorName());
			}
			List<DonatedNPItem> npDonations = dbDonor.getNonperishableDonations();
			Boolean foundPreviouslyDonatedItem = Boolean.FALSE;
			for(DonatedNPItem donation : npDonations) {
				DonationItem donatedItem = donation.getDonatedItem();
				String donatedItemCategory = donatedItem.getCategory();
				String donatedItemClassification = donatedItem.getClassification();
				String donatedItemDescription = donatedItem.getDescription();
				if(donatedItemCategory.equals(category) && donatedItemClassification.equals(classification)
						&& donatedItemDescription.equals(description)) {
					donation.setDonatedQuantity(donation.getDonatedQuantity() + quantity);
					foundPreviouslyDonatedItem = Boolean.TRUE;
					break;
				}
			}
			if(!foundPreviouslyDonatedItem) {
				DonatedNPItem newDonation = new DonatedNPItem(dbFoodItem, quantity, new Date());
				newDonation.setDonor(dbDonor);
				npDonations.add(newDonation);
			}
			donorRepository.save(dbDonor);
		}
	}

	@Override
	public void resetInventoryQuantity() {
		// TODO Auto-generated method stub
		List<DonationItem> dbFoodItems = foodRepository.findAll();
		for(DonationItem dbFoodItem : dbFoodItems) {	
			dbFoodItem.setQuantity(0);
		}
		foodRepository.saveAll(dbFoodItems);
	}

	@Override
	public BarcodeResponseDTO readBarcode(String barcode) {
		// TODO Auto-generated method stub
		DonationItem dbFoodItem = barcodeRepository.findByBarcode(barcode).getScannedItem();
		if(dbFoodItem != null) {
			String category = dbFoodItem.getCategory();
			String classification = dbFoodItem.getClassification();
			String description = dbFoodItem.getDescription();
			return new BarcodeResponseDTO(category, classification, description);
		}
		return null;
	}
	
}
