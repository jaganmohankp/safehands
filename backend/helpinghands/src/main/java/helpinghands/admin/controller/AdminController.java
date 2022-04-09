package helpinghands.admin.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.admin.dto.AdminSettingsDTO;
import helpinghands.admin.dto.WindowDataDTO;
import helpinghands.admin.service.AdminService;
import helpinghands.allocation.service.AllocationService;
import helpinghands.user.dto.UserDTO;
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
@RequestMapping("/rest/admin-settings")
public class AdminController {
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private AdminService adminService;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private AllocationService allocationService;
	
	/**
	 * REST API exposed to retrieve the admin settings
	 * @return ResponseDTO with the result being that of the existing admin settings that are stored in the database
	 */
	@GetMapping("/display-all")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO getAdminSettings() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ADMIN_GET_SUCCESS);
		try {
			WindowDataDTO result = adminService.retrieveWindowData();
			responseDTO.setResult(result);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.ADMIN_GET_FAIL);
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to retrieve the existing window status
	 * @return ResponseDTO with the result being that of the current window status, TRUE if window is open, FALSE otherwise
	 */
	@GetMapping("/display/window-status")
	public ResponseDTO getWindowStatus() {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.ADMIN_GET_SUCCESS);
		try {
			Map<String, Boolean> map = Collections.singletonMap("windowStatus", adminService.getWindowStatus());
			responseDTO.setResult(map);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.ADMIN_GET_FAIL);
		}
		return responseDTO;
	}

	/**
	 * REST API exposed allowing ADMIN_USERS to update the existing window status of the admin settings that are stored in the database
	 * The method will also invoke the automated emailer, clearing of requests made in the current window, and resets the current window data to a new state
	 * @param adminSettings
	 * @return ResponseDTO with the respective message detail on whether the window was successfully opened/closed
	 */
	@PostMapping("/update/window-status")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO toggleWindowStatus(@RequestBody AdminSettingsDTO adminSettings) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, null);
		try {
			String message = adminService.toggleWindow(adminSettings);
			if(message.equals(MessageConstants.WINDOW_CLOSE_SUCCESS)) {
				allocationService.generateAllocationList();
				adminService.generateClosingEmails();
			} else if (message.equals(MessageConstants.WINDOW_OPEN_SUCCESS)) {
				adminService.updateScores();
				adminService.generateEmails();
				adminService.insertPastRequests();
				adminService.clearWindowData();
			}
			responseDTO.setMessage(message);
		} catch (Exception e) {
			e.printStackTrace();
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to allow ADMIN_USERS to update the existing decay rate of the admin settings that are stored in the database, and used for the updating of beneficiary score
	 * @param adminSettings
	 * @return ResponseDTO with the message detailing the operation's success/failure
	 */
	@PostMapping("/update/decay-rate")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO updateDecayRate(@RequestBody AdminSettingsDTO adminSettings) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.DECAY_RATE_UPDATE_SUCCESS);
		try {
			adminService.modifyDecayRate(adminSettings);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to allow ADMIN_USERS to update the existing multiplier rate of the admin settings that are stored in the database, and used for the updating of beneficiary score
	 * @param adminSettings
	 * @return ResponseDTO with the message detailing the operation's success/failure
	 */
	@PostMapping("/update/multiplier-rate")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO updateMultiplierRate(@RequestBody AdminSettingsDTO adminSettings) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.MULTIPLIER_RATE_UPDATE_SUCCESS);
		try {
			adminService.modifyMultiplierRate(adminSettings);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to allow ADMIN_USERS to update the existing window's closing date
	 * @param adminSettings
	 * @return ResponseDTO with the message detailing the operation's success/failure
	 */
	@PostMapping("/update/closing-date")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO updateClosingDate(@RequestBody AdminSettingsDTO adminSettings) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.MULTIPLIER_RATE_UPDATE_SUCCESS);
		try {
			adminService.modifyClosingDate(adminSettings);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed to provide ADMIN_USERS with the function to assist users in resetting their password
	 * @param user
	 * @return ResponseDTO with the message detailing the operation's success/failure
	 */
	@PostMapping("/reset-password")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO resetPassword(@RequestBody UserDTO user) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.RESET_PASSWORD_SUCCESS);
		try {
			adminService.resetPassword(user);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
}
