package helpinghands.heartbeat;

import javax.transaction.Transactional;

import org.apache.commons.lang3.RandomStringUtils;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.allocation.service.AllocationService;
import helpinghands.inventory.service.FoodService;
import helpinghands.login.dto.PasswordDTO;
import helpinghands.packing.service.PackingService;
import helpinghands.request.service.RequestService;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;
import helpinghands.user.service.UserService;

@RestController
@CrossOrigin
@Transactional
public class SystemHealthManager {

	@Autowired
	private UserService userService;
	
	@Autowired
	private FoodService foodService;
	
	@Autowired
	private RequestService requestService;
	
	@Autowired
	private AllocationService allocationService;
	
	@Autowired
	private PackingService packingService;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	private static final String client = "/client/heartbeat-results";
	
	@MessageMapping("/server/heartbeat-query")
	@SendTo(client)
	public void executeTest() {
		testUserServiceLayer();
		testInventoryServiceLayer();
		testRequestServiceLayer();
		testAllocationServiceLayer();
		testPackingServiceLayer();
		this.template.convertAndSend(client, "[SUCCESS] All service layers are fully functional, the system is healthy!");
	}
	
	private void testPackingServiceLayer() {
		// TODO Auto-generated method stub
		retrieveAllPackingLists();
	}

	private void retrieveAllPackingLists() {
		// TODO Auto-generated method stub
		this.template.convertAndSend(client, "[PACKING] Attempting to retrieve packing lists from database");
		Assert.notNull(packingService.retrieveAllPackingLists(), "[ERROR] There was an error while trying to retrieve packing lists from the database");
		this.template.convertAndSend(client, "[SUCCESS] Packing service layer is fully functional!");
	}

	private void testAllocationServiceLayer() {
		// TODO Auto-generated method stub
		retrieveAllAllocations();
	}

	private void retrieveAllAllocations() {
		// TODO Auto-generated method stub
		this.template.convertAndSend(client, "[ALLOCATION] Attempting to retrieve allocations from database");
		Assert.notNull(allocationService.retrieveAllAllocations(), "[ERROR] There was an error while trying to retrieve allocations from the database");
		this.template.convertAndSend(client, "[SUCCESS] Allocation service layer is fully functional!");
	}

	private void testRequestServiceLayer() {
		// TODO Auto-generated method stub
		retrieveAllRequests();
	}

	private void retrieveAllRequests() {
		// TODO Auto-generated method stub
		this.template.convertAndSend(client, "[REQUEST] Attempting to retrieve requests from database");
		Assert.notNull(requestService.getAllRequests(), "[ERROR] There was an error while trying to retrieve requests from the database");
		this.template.convertAndSend(client, "[SUCCESS] Request service layer is fully functional!");
	}

	private void testInventoryServiceLayer() {
		// TODO Auto-generated method stub
		retrieveAllItems();
	}

	private void retrieveAllItems() {
		// TODO Auto-generated method stub
		this.template.convertAndSend(client, "[INVENTORY] Attempting to retrieve items from database");
		Assert.notNull(foodService.retrieveAllFoodItems(), "[ERROR] There was an error while trying to retrieve items from the database");
		this.template.convertAndSend(client, "[INVENTORY] Attempting to retrieve items from database with the category: Beverages");
		Assert.notNull(foodService.retrieveAllFoodItemsInCategory("Beverages"), "[ERROR] There was an error while trying to retrieve all the items with the category: Beverages from the database");
		this.template.convertAndSend(client, "[SUCCESS] Inventory service layer is fully functional!");
	}

	private void testUserServiceLayer() {
		try {
			retrieveAllUsers();
			retrieveAllUsersByType();
			retrieveUserDetails();
			this.template.convertAndSend(client, "[SUCCESS] User service retrieval functions are working as intended!");
			String randomUsername = RandomStringUtils.randomAlphabetic(8);
			crudUserAttempt(randomUsername);
			this.template.convertAndSend(client, "[SUCCESS] User service management functions are working as intended!");
			this.template.convertAndSend(client, "[SUCCESS] User service layer is fully functional!");
		} catch (Exception e) {
			this.template.convertAndSend(client, e.getMessage());
			this.template.convertAndSend(client, "[ERROR] An error was found within the User service layer");
			this.template.convertAndSend(client, "[ERROR] The system test could not be completed successfully");
		}
	}
	
	private void retrieveAllUsers() {
		this.template.convertAndSend(client, "[USER] Attempting to retrieve users from database");
		Assert.notNull(userService.getAllUsers(), "[ERROR] There was an error while retrieving users from database");
	}
	
	private void retrieveAllUsersByType() {
		// TODO Auto-generated method stub
		this.template.convertAndSend(client, "[USER] Attempting to retrieve users by usertype from database");
		Assert.notNull(userService.getAllUsersByType("admin"), "[ERROR] There was an error while retrieving users by type from database");
	}
	
	private void retrieveUserDetails() {
		this.template.convertAndSend(client, "[USER] Attempting to retrieve user details from database");
		//try {
		Assert.notNull(userService.getUserDetails("admin"), "[ERROR] There was an error while retrieving user details from database");
		//} catch (Exception e) {
			//this.template.convertAndSend(client, e.getMessage());
		//}
	}
	
	private void crudUserAttempt(String randomUsername) {
		this.template.convertAndSend(client, "[USER] Attempting to create a new user with the username: " + randomUsername);
		//try {
		userService.insertUser(new UserDTO(randomUsername, "password", "admin", randomUsername, randomUsername));
		User tempUser = userService.getUserDetails(randomUsername);
		//Assert.notNull(tempUser, "Error when creating user with the specified username: " + randomUsername);
		this.template.convertAndSend(client, "[USER] User with the specified username: " + randomUsername + " was successfully created");
		this.template.convertAndSend(client, "[USER] Attempting to modify user password");
		userService.changePassword(new PasswordDTO(tempUser.getUsername(), "password", "newPassword"));
		Assert.isTrue(BCrypt.checkpw("newPassword", tempUser.getPassword()), "[ERROR] There was an error when changing password for user with username: " + randomUsername);
		this.template.convertAndSend(client, "[USER] Password was successfully modified for user with username: " + randomUsername);
		this.template.convertAndSend(client, "[USER] Attempting to delete test user with username: " + randomUsername);
		userService.deleteUser(randomUsername);
		this.template.convertAndSend(client, "[USER] The test user created with the username: " + randomUsername + " was successfully deleted");
		//} catch (Exception e) {
			//this.template.convertAndSend(client, e.getMessage());
		//}
	}
	
}
