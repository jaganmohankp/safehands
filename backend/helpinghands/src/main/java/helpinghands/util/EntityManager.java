package helpinghands.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import helpinghands.allocation.dto.AllocatedItemDTO;
import helpinghands.allocation.dto.AllocationResponseDTO;
import helpinghands.allocation.entity.AllocatedFoodItem;
import helpinghands.allocation.entity.Allocation;
import helpinghands.beneficiary.dto.BeneficiaryDTO;
import helpinghands.beneficiary.entity.Beneficiary;
import helpinghands.history.dto.PastRequestDTO;
import helpinghands.history.dto.RequestHistoryDTO;
import helpinghands.history.entity.PastRequest;
import helpinghands.history.entity.RequestHistory;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.packing.dto.PackedItemDTO;
import helpinghands.packing.dto.PackingListDTO;
import helpinghands.packing.entity.PackedFoodItem;
import helpinghands.packing.entity.PackingList;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;

/**
 * 
 *
 * @version 1.0
 * 
 */
public class EntityManager {
	
	/**
	 * 
	 *
	 * @version 1.0
	 * 
	 */
	public enum DTOKey {
		BeneficiaryDTO, UserDTO, AllocationResponseDTO, PackingListDTO, RequestHistoryDTO
	}
	
	/**
	 * Data transformation from a DTO to an Entity class
	 * @param userDTO
	 * @return A User object with the parameters as specified within the DTO
	 */
	public static User transformUserDTO(UserDTO userDTO) {
		String username = userDTO.getUsername().toLowerCase();
		String password = userDTO.getPassword();
		String usertype = userDTO.getUsertype();
		String name = userDTO.getName();
		String email = userDTO.getEmail();
		return new User(username, password, usertype, name, email);
	}
	
	/**
	 * Data transformation from a DTO to an Entity class
	 * @param beneficiaryDTO
	 * @return A Beneficiary object with the parameters as specified within the DTO
	 */
	public static Beneficiary transformBeneficiaryDTO(BeneficiaryDTO beneficiaryDTO) {
		String username = beneficiaryDTO.getUsername().toLowerCase();
		String password = beneficiaryDTO.getPassword();
		String usertype = beneficiaryDTO.getUsertype();
		String name = beneficiaryDTO.getName();
		String email = beneficiaryDTO.getEmail();
		Integer numBeneficiaries = beneficiaryDTO.getNumBeneficiary();
		String address = beneficiaryDTO.getAddress();
		Double score = beneficiaryDTO.getScore();
		Boolean hasTransport = beneficiaryDTO.getHasTransport();
		String memberType = beneficiaryDTO.getMemberType();
		String contactPerson = beneficiaryDTO.getContactPerson();
		String contactNumber = beneficiaryDTO.getContactNumber();
		Beneficiary newBeneficiary = new Beneficiary(numBeneficiaries, 
				address, score, contactPerson, contactNumber, memberType, 
				hasTransport);
		newBeneficiary.setUser(new User(username, password, usertype, name, email));
		return newBeneficiary;
	}
	
	/**
	 * Converting an Object into the respective DTOs based on the input key
	 * @param dtoKey
	 * @param object
	 * @return A entity that has to be class-casted depending on the input DTO key that manages the transformation
	 */
	public static Object convertToDTO(DTOKey dtoKey, Object object) {
		Object result = null;
		if(dtoKey == DTOKey.BeneficiaryDTO) {
			Beneficiary beneficiary = (Beneficiary)object;
			User user = beneficiary.getUser();
			result = new BeneficiaryDTO(user.getUsername(), user.getName(), 
					user.getEmail(), beneficiary.getNumBeneficiary(), 
					beneficiary.getAddress(), beneficiary.getScore(), 
					beneficiary.getContactPerson(), 
					beneficiary.getContactNumber(), 
					beneficiary.getMemberType(), 
					beneficiary.getTransportationStatus());
		} else if (dtoKey == DTOKey.AllocationResponseDTO) {
			Allocation allocation = (Allocation)object;
			Beneficiary beneficiary = allocation.getBeneficiary();
			List<AllocatedFoodItem> allocatedItems = allocation.getAllocatedItems();
			result = new AllocationResponseDTO(
					(BeneficiaryDTO)convertToDTO(DTOKey.BeneficiaryDTO, beneficiary), 
					convertAllocatedFoodItemListToDTOList(allocatedItems), 
					allocation.getApprovalStatus());
		} else if (dtoKey == DTOKey.PackingListDTO) {
			PackingList packingList = (PackingList)object;
			Beneficiary beneficiary = packingList.getBeneficiary();
			List<PackedFoodItem> packedItems = packingList.getPackedItems();
			result = new PackingListDTO(packingList.getId(),
					(BeneficiaryDTO)convertToDTO(DTOKey.BeneficiaryDTO, beneficiary),
					convertPackedItemListToDTOList(packedItems),
					packingList.getPackingStatus());
		} else if (dtoKey == DTOKey.RequestHistoryDTO) {
			RequestHistory requestHistory = (RequestHistory)object;
			Beneficiary beneficiary = requestHistory.getBeneficiary();
			List<PastRequest> pastRequests = requestHistory.getPastRequests();
			result = new RequestHistoryDTO(
					(BeneficiaryDTO)convertToDTO(DTOKey.BeneficiaryDTO, beneficiary),
					convertPastRequestListToDTOList(pastRequests));
		}
		return result;
	}
	
	/**
	 * Data transformation from an Entity into a DTO
	 * @param allocatedItems
	 * @return A List of AllocatedItemDTO
	 */
	public static List<AllocatedItemDTO> convertAllocatedFoodItemListToDTOList(List<AllocatedFoodItem> allocatedItems) {
		List<AllocatedItemDTO> result = new ArrayList<AllocatedItemDTO>();
		for(AllocatedFoodItem allocatedItem : allocatedItems) {
			DonationItem foodItem = allocatedItem.getFoodItem();
			String category = foodItem.getCategory();
			String classification = foodItem.getClassification();
			String description = foodItem.getDescription();
			Integer inventoryQuantity = foodItem.getQuantity();
			Integer requestedQuantity = allocatedItem.getRequestedQuantity();
			Integer allocatedQuantity = allocatedItem.getAllocatedQuantity();
			result.add(new AllocatedItemDTO(category, classification, description, inventoryQuantity, requestedQuantity, allocatedQuantity));
		}
		return result;
	}
	
	/**
	 * Data transformation from an Entity into a DTO
	 * @param packedItems
	 * @return A List of PackedItemDTO
	 */
	public static List<PackedItemDTO> convertPackedItemListToDTOList(List<PackedFoodItem> packedItems) {
		List<PackedItemDTO> results = new ArrayList<PackedItemDTO>();
		for(PackedFoodItem packedItem : packedItems) {
			DonationItem foodItem = packedItem.getPackedFoodItem();
			String category = foodItem.getCategory();
			String classification = foodItem.getClassification();
			String description = foodItem.getDescription();
			Integer inventoryQuantity = foodItem.getQuantity();
			Integer allocatedQuantity = packedItem.getAllocatedQuantity();
			Integer packedQuantity = packedItem.getPackedQuantity();
			results.add(new PackedItemDTO(category, classification, description, inventoryQuantity, allocatedQuantity, packedQuantity));
		}
		return results;
	}
	
	/**
	 * Data transformation from an Entity into a DTO
	 * @param pastRequests
	 * @return A List of PastRequestDTO
	 */
	public static List<PastRequestDTO> convertPastRequestListToDTOList(List<PastRequest> pastRequests) {
		List<PastRequestDTO> results = new ArrayList<PastRequestDTO>();
		for(PastRequest pastRequest : pastRequests) {
			DonationItem foodItem = pastRequest.getPreviouslyRequestedItem();
			String category = foodItem.getCategory();
			String classification = foodItem.getClassification();
			String description = foodItem.getDescription();
			Integer requestedQuantity = pastRequest.getRequestedQuantity();
			Integer allocatedQuantity = pastRequest.getAllocatedQuantity();
			Date requestCreationDate = pastRequest.getRequestCreationDate();
			results.add(new PastRequestDTO(category, classification, description, requestedQuantity, allocatedQuantity, requestCreationDate));
		}
		return results;
	}
	
	/**
	 * Helper method that evaluates if there is an intent to update specific fields within the conversion process
	 * @param object
	 * @return Boolean value: True if the intent exists, False otherwise
	 */
	public static Boolean checkForUpdateIntent(Object object) {
		return object == null ? Boolean.FALSE : Boolean.TRUE;
	}

}
