package helpinghands.allocation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.allocation.dto.AllocatedItemDTO;
import helpinghands.allocation.dto.AllocationResponseDTO;
import helpinghands.allocation.dto.AllocationUpdateDTO;
import helpinghands.allocation.service.AllocationService;
import helpinghands.util.MessageConstants;
import helpinghands.util.ResponseDTO;
import helpinghands.util.MessageConstants.ErrorMessages;

/**
 * 
 *
 * @version 1.0
 *
 */
@RestController
@CrossOrigin
@RequestMapping("/rest/allocation")
public class AllocationController {
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private AllocationService allocationService;
	
	/**
	 * REST API exposed to retrieve all allocations from server
	 * @return ResponseDTO with the result being the List of Allocations that have been generated in the current window
	 */
	@GetMapping("/display-all")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO retrieveAllocations() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ALLOCATION_GET_SUCCESS);
		try {
			List<AllocationResponseDTO> result = allocationService.retrieveAllAllocations();
			responseDTO.setResult(result);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.ALLOCATION_GET_FAIL);
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to retrieve the DTOs of all allocated food items for the specified beneficiary
	 * @param beneficiary
	 * @return ResponseDTO with the result being the List of AllocatedFoodItemDTOs for the specified beneficiary
	 */
	@GetMapping("/display-allocations")
	public ResponseDTO retrieveFoodItemsAllocatedToBeneficiary(@RequestParam(value = "beneficiary", required = true) String beneficiary) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ALLOCATION_GET_SUCCESS);
		try {
			List<AllocatedItemDTO> results = allocationService.retrieveAllocationByBeneficiary(beneficiary);
			responseDTO.setResult(results);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.ALLOCATION_GET_FAIL);
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to generate allocations for the current window
	 * @return ResponseDTO with the status specifying the operation outcome
	 */
	@PostMapping("/generate-allocations")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO generateAllocations() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ALLOCATION_GENERATE_SUCCESS);
		try {
			allocationService.generateAllocationList();
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed for ADMIN_USERS to modify the allocation data if they do not agree with the system generation
	 * @param allocation
	 * @return ResponseDTO with the status specifying the operation outcome
	 */
	@PostMapping("/update-allocation")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO updateAllocation(@RequestBody AllocationUpdateDTO allocation) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ALLOCATION_UPDATE_SUCCESS);
		try {
			allocationService.updateAllocation(allocation);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed for ADMIN_USERS to approve all allocations if they are agreeable with the system generation
	 * @return ResponseDTO with the status specifying the operation outcome
	 */
	@PostMapping("/approve-allocations")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO approveAllocations() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ALLOCATION_APPROVE_SUCCESS);
		try {
			allocationService.approveAllocations();
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to evaluate if ADMIN_USERS have approved the allocation
	 * This is used for client validation to determine if window is pending or approved
	 * @return ResponseDTO with result being TRUE if all allocations have been approved, FALSE otherwise
	 */
	@GetMapping("/approval-status")
	public ResponseDTO getApproveStatus() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ADMIN_GET_SUCCESS);
		try {
			Boolean result = allocationService.checkApproveStatus();
			responseDTO.setResult(result);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.ADMIN_GET_FAIL);
		}
		return responseDTO;
	}
	
}