package helpinghands.user.service;

import java.util.List;

import helpinghands.login.dto.PasswordDTO;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface UserService {
	
	/**
	 * 
	 * @return All the users that are found within the repository
	 */
	List<User> getAllUsers();
	
	/**
	 * 
	 * @param usertype
	 * @return All the users that are found within the repository with the specified usertype
	 */
	List<User> getAllUsersByType(final String usertype);
	
	/**
	 * 
	 * @param username
	 * @return The user details for the user that have the specified username within the repository
	 */
	User getUserDetails(final String username);
	
	/**
	 * Create a user with the details as specified by the user DTO
	 * @param user
	 */
	void insertUser(final UserDTO user);
	
	/**
	 * Update the user with the details as specified by the user DTO
	 * @param user
	 */
	void updateUser(final UserDTO user);
	
	/**
	 * Delete the user with the specified username
	 * @param username
	 */
	void deleteUser(final String username);
	
	/**
	 * Change the password for the specified user
	 * @param passwordDetails
	 * @return Boolean value: True for successful password change, False otherwise
	 */
	Boolean changePassword(final PasswordDTO passwordDetails);

}
