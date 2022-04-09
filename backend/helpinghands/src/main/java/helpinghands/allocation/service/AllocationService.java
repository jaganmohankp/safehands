package helpinghands.allocation.service;

import java.util.List;

import helpinghands.allocation.dto.AllocatedItemDTO;
import helpinghands.allocation.dto.AllocationResponseDTO;
import helpinghands.allocation.dto.AllocationUpdateDTO;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface AllocationService {

	/**
	 * 
	 * @return List of DTO objects wrapped for the client viewing
	 */
	List<AllocationResponseDTO> retrieveAllAllocations();
	
	/**
	 * Retrieves List of AllocatedItemDTO that belongs to the specified Beneficiary
	 * @param beneficiary
	 * @return List of DTO objects wrapped for the client viewing, for the specific Beneficiary
	 */
	List<AllocatedItemDTO> retrieveAllocationByBeneficiary(final String beneficiary);
	
	/**
	 * Generate the Allocation based on all Requests made in the current window
	 */
	void generateAllocationList();
	
	/**
	 * Update the respective allocation as defined in the AllocationUpdateDTO
	 * @param allocation
	 */
	void updateAllocation(final AllocationUpdateDTO allocation);
	
	/**
	 * Update the approval status of all allocations to TRUE
	 */
	void approveAllocations();
	
	/**
	 * Evaluate the overall approval status of all allocations
	 * @return Boolean value that will be TRUE if all allocations have been approved, FALSE otherwise
	 */
	Boolean checkApproveStatus();
	
}
