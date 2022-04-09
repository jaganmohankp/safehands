package helpinghands.allocation.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import helpinghands.beneficiary.dto.BeneficiaryDTO;


/**
 * 
 *
 * @version 1.0
 *
 */
public class AllocationResponseDTO {
	
	/**
	 * Represents the beneficiary that is the recipient of the allocation in its DTO structure
	 */
	@JsonProperty("beneficiary")
	private BeneficiaryDTO beneficiary;
	
	/**
	 * Represents the list of all allocated food items in its DTO structure for client viewing
	 */
	@JsonProperty("allocatedItems")
	private List<AllocatedItemDTO> allocatedItems;
	
	/**
	 * Represents the approval status of the allocation list
	 */
	@JsonProperty("approvalStatus")
	private Boolean approvalStatus;

	/**
	 * Empty constructor that should not be used in most instances
	 */
	protected AllocationResponseDTO() {}
	
	/**
	 * Constructor that allows creation of the DTO with all required variables
	 * @param beneficiary
	 * @param allocatedItems
	 * @param approvalStatus
	 */
	public AllocationResponseDTO(BeneficiaryDTO beneficiary, List<AllocatedItemDTO> allocatedItems,
			Boolean approvalStatus) {
		this.beneficiary = beneficiary;
		this.allocatedItems = allocatedItems;
		this.approvalStatus = approvalStatus;
	}
	
	/**
	 * 
	 * @return BeneficiaryDTO that specifies the details of the beneficiary recipient of the allocation
	 */
	public BeneficiaryDTO getBeneficiary() {
		return beneficiary;
	}
	
	/**
	 * Setter method for the BeneficiaryDTO
	 * @param beneficiary
	 */
	public void setBeneficiary(BeneficiaryDTO beneficiary) {
		this.beneficiary = beneficiary;
	}
	
	/**
	 * 
	 * @return List of all AllocatedFoodItemDTOs that specifies the details of the allocated food items
	 */
	public List<AllocatedItemDTO> getAllocatedItems() {
		return allocatedItems;
	}
	
	/**
	 * Setter method for the List of AllocatedFoodItemDTOs
	 * @param allocatedItems
	 */
	public void setAllocatedItems(List<AllocatedItemDTO> allocatedItems) {
		this.allocatedItems = allocatedItems;
	}
	
	/**
	 * 
	 * @return Boolean value that specifies the approval status of the entire allocation, TRUE if allocation is approved, FALSE otherwise
	 */
	public Boolean getApprovalStatus() {
		return approvalStatus;
	}
	
	/**
	 * Setter method for the approval status of the allocation
	 * @param approvalStatus
	 */
	public void setApprovalStatus(Boolean approvalStatus) {
		this.approvalStatus = approvalStatus;
	}

}
