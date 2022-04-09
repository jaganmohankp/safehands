package helpinghands.user.service.impl;

import java.util.List;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helpinghands.login.dto.PasswordDTO;
import helpinghands.security.model.Role;
import helpinghands.security.model.repository.RoleRepository;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;
import helpinghands.user.repository.UserRepository;
import helpinghands.user.service.UserService;
import helpinghands.util.EntityManager;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.UserException;

/**
 * 
 *
 * @version 1.0
 * 
 */
@Service
public class UserServiceImpl implements UserService {

	/**
	 * Dependency injection
	 */
	@Autowired
	private UserRepository userRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private RoleRepository roleRepository;
	
	/**
	 * Retrieve all the users within the repository
	 */
	public List<User> getAllUsers() {
		// TODO Auto-generated method stub
		return userRepository.findAll();
	}

	/**
	 * Retrieve all users that have the specified usertype
	 */
	public List<User> getAllUsersByType(String usertype) {
		// TODO Auto-generated method stub
		return userRepository.findUsersByUsertype(usertype);
	}

	/**
	 * Retrieve the user details for the user that has the specified username
	 */
	public User getUserDetails(String username) {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(username);
		if(dbUser == null) {
			throw new UserException(ErrorMessages.NO_SUCH_USER);
		}
		return dbUser;
	}

	/**
	 * Create a user with the details as specified within the DTO
	 */
	public void insertUser(UserDTO user) {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(user.getUsername());
		if(dbUser != null) {
			throw new UserException(ErrorMessages.USER_ALREADY_EXISTS);
		}
		dbUser = EntityManager.transformUserDTO(user);
		dbUser.setPassword(BCrypt.hashpw(dbUser.getPassword(), BCrypt.gensalt()));
		dbUser.setRole(roleRepository.findById(Role.ADMIN_USER).orElse(null));
		userRepository.save(dbUser);
	}

	/**
	 * Update a user with the details as specified within the DTO
	 */
	public void updateUser(UserDTO user) {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(user.getUsername());
		if(dbUser == null) {
			throw new UserException(ErrorMessages.NO_SUCH_USER);
		}
		User newUserDetails = EntityManager.transformUserDTO(user);
		String newName = newUserDetails.getName();
		String newEmail = newUserDetails.getEmail();
		String newUsertype = newUserDetails.getUsertype();
		if(newName != null && !newName.isEmpty()) {
			dbUser.setName(newName);
		}
		if(newEmail != null && !newEmail.isEmpty()) {
			dbUser.setEmail(newEmail);
		}
		if(newUsertype != null && !newUsertype.isEmpty()) {
			dbUser.setUsertype(newUsertype.toLowerCase());
		}
		userRepository.save(dbUser);
	}

	/**
	 * Delete the user with the specified username
	 */
	public void deleteUser(String username) {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(username);
		if(dbUser == null) {
			throw new UserException(ErrorMessages.NO_SUCH_USER);
		}
		userRepository.delete(dbUser);
	}

	/**
	 * Change the password for the user with the details as specified within the DTO
	 */
	public Boolean changePassword(PasswordDTO passwordDetails) {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(passwordDetails.getUsername());
		if(dbUser == null) {
			throw new UserException(ErrorMessages.NO_SUCH_USER);
		}
		if(BCrypt.checkpw(passwordDetails.getOldPassword(), dbUser.getPassword())) {
			dbUser.setPassword(BCrypt.hashpw(passwordDetails.getNewPassword(), BCrypt.gensalt()));
			userRepository.save(dbUser);
			return true;
		}
		return false;
	}

}
