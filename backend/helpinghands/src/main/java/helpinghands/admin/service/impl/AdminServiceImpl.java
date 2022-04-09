package helpinghands.admin.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.apache.commons.lang3.RandomStringUtils;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import helpinghands.admin.dto.AdminSettingsDTO;
import helpinghands.admin.dto.WindowDataDTO;
import helpinghands.admin.entity.AdminSettings;
import helpinghands.admin.repository.AdminRepository;
import helpinghands.admin.service.AdminService;
import helpinghands.allocation.entity.AllocatedFoodItem;
import helpinghands.allocation.entity.Allocation;
import helpinghands.allocation.repository.AllocatedItemRepository;
import helpinghands.allocation.repository.AllocationRepository;
import helpinghands.beneficiary.entity.Beneficiary;
import helpinghands.beneficiary.repository.BeneficiaryRepository;
import helpinghands.history.entity.PastRequest;
import helpinghands.history.entity.RequestHistory;
import helpinghands.history.repository.HistoryRepository;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.request.entity.Request;
import helpinghands.request.repository.RequestRepository;
import helpinghands.security.model.Role;
import helpinghands.security.model.repository.RoleRepository;
import helpinghands.user.dto.UserDTO;
import helpinghands.user.entity.User;
import helpinghands.user.repository.UserRepository;
import helpinghands.util.AutomatedEmailer;
import helpinghands.util.MessageConstants;
import helpinghands.util.MessageConstants.EmailMessages;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.UserException;

/**
 * 
 *
 * @version 1.0
 *
 */
@Service
public class AdminServiceImpl implements AdminService {

	/**
	 * Declaration of the idKey that will remain constant
	 * There should only be one record of the admin settings in the database
	 */
	private static final Long idKey = Long.valueOf(1);
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private AdminRepository adminRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private RequestRepository requestRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private AllocationRepository allocationRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private HistoryRepository historyRepository;
	
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
	 * Dependency injection
	 */
	@Autowired
	private AllocatedItemRepository allocatedFoodItemRepository;
	
	/**
	 * Dependency injection
	 */
	@Autowired
	private BeneficiaryRepository beneficiaryRepository;
	
	/**
	 * Retrieves the DTO that contains all details pertaining to the existing window
	 */
	@Override
	public WindowDataDTO retrieveWindowData() {
		// TODO Auto-generated method stub
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		Date startDate = currentSettings.getWindowStartDateTime();
		Date endDate = currentSettings.getWindowsEndDateTime();
		String startDateString = startDate == null ? "The window is currently inactive" : startDate.toString();
		String endDateString = "The window is currently inactive";
		if(!startDateString.toString().equals("The window is currently inactive")) {
			endDateString = endDate.toString();
		}
		Boolean windowStatus = currentSettings.getWindowStatus();
		Double decayRate = currentSettings.getDecayRate();
		Double multiplierRate = currentSettings.getMultiplierRate();
		String dailyPassword = currentSettings.getDailyPassword();
		List<Request> requests = requestRepository.findAll();
		Set<Beneficiary> beneficiarySet = new HashSet<Beneficiary>();
		for(Request request : requests) {
			beneficiarySet.add(request.getBeneficiary());
		}
		Integer uniqueBeneficiaryCount = beneficiarySet.size();
		WindowDataDTO results = new WindowDataDTO(windowStatus, startDateString, endDateString, multiplierRate, decayRate, dailyPassword, uniqueBeneficiaryCount);
		return results;
	}

	/**
	 * Update the decay rate modifier that will be used in the adjustment of beneficiary score at the end of every window
	 */
	@Override
	public void modifyDecayRate(AdminSettingsDTO adminSettings) {
		// TODO Auto-generated method stub
		Double decayRate = adminSettings.getDecayRate();
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		currentSettings.setDecayRate(decayRate);
		adminRepository.saveAndFlush(currentSettings);
	}
	
	/**
	 * Update the multiplier rate modifier that will be used in the adjustment of beneficiary score at the end of every window
	 */
	@Override
	public void modifyMultiplierRate(AdminSettingsDTO adminSettings) {
		// TODO Auto-generated method stub
		Double multiplierRate = adminSettings.getMultiplierRate();
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		currentSettings.setMultiplierRate(multiplierRate);
		adminRepository.saveAndFlush(currentSettings);
	}

	/**
	 * Toggle the existing request window status
	 * Open the window if it's currently closed and vice-versa
	 */
	@Override
	public String toggleWindow(AdminSettingsDTO adminSettings) throws ParseException {
		// TODO Auto-generated method stub
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		String returnString = MessageConstants.WINDOW_OPEN_SUCCESS;
		String endDateString = adminSettings.getEndDate();
		if(endDateString == null) {
			// Code block to close the window
			currentSettings.setLastStartDate(currentSettings.getWindowStartDateTime());
			currentSettings.setLastEndDate(currentSettings.getWindowsEndDateTime());
			currentSettings.setWindowStartDateTime(null);
			currentSettings.setWindowsEndDateTime(null);
			currentSettings.setWindowStatus(Boolean.FALSE);
			returnString = MessageConstants.WINDOW_CLOSE_SUCCESS;
		} else {
			// Code block to open the window
			currentSettings.setWindowStartDateTime(new Date());
			SimpleDateFormat format = new SimpleDateFormat("dd-MM-yy");
			currentSettings.setWindowsEndDateTime(format.parse(endDateString));
			currentSettings.setWindowStatus(Boolean.TRUE);
		}
		adminRepository.save(currentSettings);
		return returnString;
	}
	
	/**
	 * Update the closing date of the current request window
	 */
	@Override
	public void modifyClosingDate(AdminSettingsDTO adminSettings) throws ParseException {
		// TODO Auto-generated method stub
		String endDateString = adminSettings.getEndDate();
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		SimpleDateFormat format = new SimpleDateFormat("dd-MM-yy");
		currentSettings.setWindowsEndDateTime(format.parse(endDateString));
		adminRepository.save(currentSettings);
	}
	
	/**
	 * Retrieve information about the current window status
	 * Response will be TRUE if window is currently active, FALSE otherwise
	 */
	@Override
	public Boolean getWindowStatus() {
		// TODO Auto-generated method stub
		AdminSettings currentSettings = adminRepository.findById(idKey).orElse(null);
		return currentSettings.getWindowStatus();
	}

	/**
	 * Conversion of requests that have been made in the current window into that to be inserted into the history repository
	 */
	@Override
	public void insertPastRequests() {
		// TODO Auto-generated method stub
		List<Allocation> allocations = allocationRepository.findAll();
		for(Allocation allocation : allocations) {
			Beneficiary dbBeneficiary = allocation.getBeneficiary();
			RequestHistory previousRequestsByBeneficiary = historyRepository.findByBeneficiaryUserUsername(dbBeneficiary.getUser().getUsername());
			List<AllocatedFoodItem> allocatedItems = allocation.getAllocatedItems();
			Map<DonationItem, Integer> allocatedQuantityItemMap = new HashMap<DonationItem, Integer>();
			for(AllocatedFoodItem allocatedItem : allocatedItems) {
				DonationItem dbFoodItem = allocatedItem.getFoodItem();
				allocatedQuantityItemMap.put(dbFoodItem, allocatedItem.getAllocatedQuantity());
			}
			if(previousRequestsByBeneficiary == null) {
				List<PastRequest> pastRequests = new ArrayList<PastRequest>();
				previousRequestsByBeneficiary = new RequestHistory(dbBeneficiary, pastRequests);
			} else {
				List<PastRequest> pastRequests = previousRequestsByBeneficiary.getPastRequests();
				List<Request> requestsByBeneficiary = requestRepository.findByBeneficiaryUserUsername(dbBeneficiary.getUser().getUsername());
				for(Request request : requestsByBeneficiary) {
					DonationItem dbFoodItem = request.getFoodItem();
					Date requestCreationDate = request.getRequestCreationDate();
					Integer allocatedQuantity = allocatedQuantityItemMap.get(dbFoodItem);
					if(allocatedQuantity != null) {
						PastRequest newPastRequest = new PastRequest(dbFoodItem, request.getRequestedQuantity(), allocatedQuantity, requestCreationDate);
						newPastRequest.setRequestHistory(previousRequestsByBeneficiary);
						pastRequests.add(newPastRequest);
					}
				}
			}
			historyRepository.save(previousRequestsByBeneficiary);
		}
	}
	
	/**
	 * Clear all data that belongs to the current window and reverts it to a blank slate
	 * Removes all request data from the request repository
	 * Removes all allocation data from the allocation repository
	 */
	@Override
	@Transactional
	public void clearWindowData() {
		/*
		List<Request> requests = requestRepository.findAll();
		for(Request request : requests) {
			request.setFoodItem(null);
		}
		requestRepository.save(requests);
		*/
		requestRepository.deleteAll();
		System.out.println("requests deleted");
		allocatedFoodItemRepository.deleteAllInBatch();
		System.out.println("allocated food item deleted");
		allocationRepository.deleteAllInBatch();
		System.out.println("allocations deleted");
		//System.out.println("requests deleted");
		//allocationRepository.deleteAll();
	}

	/**
	 * Automated e-mailer that notifies all beneficiaries of the request window opening/closing
	 */
	@Override
	public void generateEmails() throws Exception {
		// TODO Auto-generated method stub
		List<User> beneficiaries = userRepository.findUsersByUsertype("beneficiary");
		for(User beneficiary : beneficiaries) {
			String emailAddress = beneficiary.getEmail();
			new AutomatedEmailer(emailAddress, EmailMessages.WINDOW_OPENING_SUBJECT, EmailMessages.WINDOW_OPENING_MESSAGE);
		}
	}

	/**
	 * Scheduled task that runs on a daily basis and upon system startup
	 * Assigns a password to the volunteer account
	 */
	@Override
	@Scheduled(fixedRate = 86400000, initialDelay = 10000)
	public void generateDailyPassword() {
		// TODO Auto-generated method stub
		AdminSettings adminSettings = adminRepository.findById(idKey).orElse(null);
		int length = 8;
		boolean useLetters = false;
		boolean useNumbers = true;
		String dailyPassword = RandomStringUtils.random(length, useLetters, useNumbers);
		adminSettings.setDailyPassword(dailyPassword);
		User dbUser = userRepository.findByUsernameIgnoreCase("volunteer");
		dbUser = dbUser == null ? new User("volunteer", null, "volunteer", "volunteer", "volunteer@gmail.com") : dbUser;
		dbUser.setPassword(BCrypt.hashpw(dailyPassword, BCrypt.gensalt()));
		dbUser.setRole(roleRepository.findById(Role.VOLUNTEER).orElse(null));
		userRepository.save(dbUser);
		adminRepository.save(adminSettings);
	}
	
	/**
	 * Generates a new random password for a user
	 * Automated e-mailer will be generated that informs user of the new password
	 * This function should only be used by the ADMIN_USERS in the Account Management module
	 */
	@Override
	public void resetPassword(UserDTO user) throws Exception {
		// TODO Auto-generated method stub
		User dbUser = userRepository.findByUsernameIgnoreCase(user.getUsername());
		if(dbUser == null) {
			throw new UserException(ErrorMessages.NO_SUCH_USER);
		}
		int length = 8;
		boolean useLetters = true;
		boolean useNumbers = true;
		String newPassword = RandomStringUtils.random(length, useLetters, useNumbers);
		// System.out.println("The new password is : " + newPassword);
		new AutomatedEmailer(dbUser.getEmail(), EmailMessages.RESET_PASSWORD_SUBJECT, EmailMessages.RESET_PASSWORD_MESSAGE1 + newPassword + EmailMessages.RESET_PASSWORD_MESSAGE2);
		dbUser.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
		userRepository.save(dbUser);
	}

	/**
	 * System startup configuration that creates a root admin account
	 */
	@PostConstruct
	private void initAdmin() {
		initRoles();
		User dbUser = userRepository.findByUsernameIgnoreCase("admin");
		if(dbUser == null) {
			dbUser = new User("admin", BCrypt.hashpw("admin", BCrypt.gensalt()), "admin", "admin", "admin@gmail.com");
			dbUser.setRole(roleRepository.findById(Role.ADMIN_USER).orElse(null));
			userRepository.save(dbUser);
		}
	}
	
	/**
	 * System startup configuration that initializes all roles and their respective descriptions
	 */
	private void initRoles() {
		Role adminRole = roleRepository.findById(Role.ADMIN_USER).orElse(null);
		if(adminRole == null) {
			adminRole = new Role(Role.ADMIN_USER);
			roleRepository.save(adminRole);
		}
		Role volunteerRole = roleRepository.findById(Role.VOLUNTEER).orElse(null);
		if(volunteerRole == null) {
			volunteerRole = new Role(Role.VOLUNTEER);
			roleRepository.save(volunteerRole);
		}
		Role beneficiaryRole = roleRepository.findById(Role.BENEFICIARY).orElse(null);
		if(beneficiaryRole == null) {
			beneficiaryRole = new Role(Role.BENEFICIARY);
			roleRepository.save(beneficiaryRole);
		}
	}

	/**
	 * Method that runs at the start of every window that provides a flat increment based on organization size and a multiplication effect on the beneficiary scores
	 */
	@Override
	public void updateScores() {
		// TODO Auto-generated method stub
		List<Beneficiary> beneficiaries = beneficiaryRepository.findAll();
		AdminSettings adminSettings = adminRepository.findById(1L).orElse(null);
		for(Beneficiary beneficiary : beneficiaries) {
			Double currentScore = beneficiary.getScore();
			Double newScore = (currentScore + beneficiary.getNumBeneficiary()) * (1+adminSettings.getMultiplierRate()/100);
			beneficiary.setScore(newScore);
			beneficiaryRepository.save(beneficiary);
		}
	}

	@Override
	public void generateClosingEmails() throws Exception {
		// TODO Auto-generated method stub
		List<User> beneficiaries = userRepository.findUsersByUsertype("beneficiary");
		for(User beneficiary : beneficiaries) {
			String emailAddress = beneficiary.getEmail();
			new AutomatedEmailer(emailAddress, EmailMessages.WINDOW_CLOSING_SUBJECT, EmailMessages.WINDOW_CLOSING_MESSAGE);
		}
	}

}
