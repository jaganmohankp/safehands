package helpinghands.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.login.dto.PasswordDTO;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;
import helpinghands.user.service.UserService;
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
@RequestMapping("/rest/users")
public class UserController {
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private UserService userService;
	
	/**
	 * REST API exposed to retrieve all users from server
	 * @return ResponseDTO with the result being a List of Users retrieved from the repository
	 */
	@GetMapping("/display-all")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO getAllUsers() {
		List<User> results = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_LIST_RETRIEVE_SUCCESS);
		try {
			results = userService.getAllUsers();
		} catch ( Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		responseDTO.setResult(results);
		return responseDTO;
	}
	
	/**
	 * REST API exposed to retrieve all users with the specified usertype
	 * @param usertype
	 * @return ResponseDTO with the result being a List of Users with the specified usertype
	 */
	@GetMapping("/display-all-by")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO getAllUsersByType(@RequestParam(value = "usertype", required = true) String usertype) {
		List<User> results = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_LIST_RETRIEVE_SUCCESS);
		try {
			results = userService.getAllUsersByType(usertype.toLowerCase());
		} catch ( Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		responseDTO.setResult(results);
		return responseDTO;
	}
	
	/**
	 * REST API exposed to retrieve the user details of the user with the specified username
	 * @param username
	 * @return ResponseDTO with the result being the User with the specified username
	 */
	@GetMapping("/display-user")
	public ResponseDTO getUserDetails(@RequestParam(value = "username", required = true) String username) {
		User result = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_RETRIEVE_SUCCESS);
		try {
			result = userService.getUserDetails(username);
		} catch ( Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		responseDTO.setResult(result);
		return responseDTO;
	}
	
	/**
	 * REST API exposed for ADMIN_USERS to create a new user
	 * @param user
	 * @return ResponseDTO with the status specifying if the operation was successful
	 */
	@PutMapping("/insert-user")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO insertUser(@RequestBody UserDTO user) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_ADD_SUCCESS);
		try {
			userService.insertUser(user);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed for ADMIN_USERS to update users
	 * @param user
	 * @return ResponseDTO with the status specifying if the operation was successful
	 */
	@PostMapping("/update-user")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO updateUser(@RequestBody UserDTO user) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_UPDATE_SUCCESS);
		try {
			userService.updateUser(user);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed for all authenticated users to change their password
	 * @param passwordDetails
	 * @return ResponseDTO with the result indicating whether the password change was successful
	 */
	@PostMapping("/change-password")
	public ResponseDTO changePassword(@RequestBody PasswordDTO passwordDetails) {
		Boolean result = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, result, MessageConstants.PASSWORD_CHANGE_SUCCESS);
		try {
			result = userService.changePassword(passwordDetails);
		} catch (Exception e) {
			responseDTO.setMessage(e.getMessage());
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
		}
		if(result == false) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(ErrorMessages.PASSWORD_NOT_UPDATED);
		}
		return responseDTO;
	}
	
	/**
	 * REST API exposed for ADMIN_USERS to delete the user with the specified username
	 * @param username
	 * @return ResponseDTO with the result specifying if the operation was successful
	 */
	@DeleteMapping("/delete-user")
	@PreAuthorize("hasAuthority('ADMIN_USER')")
	public ResponseDTO deleteUser(@RequestParam(value = "username", required = true) String username) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.USER_DELETE_SUCCESS);
		try {
			userService.deleteUser(username);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}

}
