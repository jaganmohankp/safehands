package helpinghands.admin.service;

import java.text.ParseException;

import helpinghands.admin.dto.AdminSettingsDTO;
import helpinghands.admin.dto.WindowDataDTO;
import helpinghands.user.dto.UserDTO;

/**
 * 
 *
 * @version 1.0
 *
 */
public interface AdminService {
	
	/**
	 * 
	 * @return The DTO that contains all details pertaining to the existing window
	 */
	WindowDataDTO retrieveWindowData();
	
	/**
	 * 
	 * @return Boolean value that represents whether the window is currently active: TRUE if so, FALSE otherwise
	 */
	Boolean getWindowStatus();
	
	/**
	 * Update the decay rate modifier that will be used in the adjustment of beneficiary score at the end of every window
	 * @param adminSettings
	 */
	void modifyDecayRate(final AdminSettingsDTO adminSettings);

	/**
	 * Update the multiplier rate modifier that will be used in the adjustment of beneficiary score at the end of every window
	 * @param adminSettings
	 */
	void modifyMultiplierRate(final AdminSettingsDTO adminSettings);
	
	/**
	 * Update the closing date of the current window
	 * @param adminSettings
	 * @throws ParseException
	 */
	void modifyClosingDate(final AdminSettingsDTO adminSettings) throws ParseException;
	
	/**
	 * Toggles the existing request window status
	 * This method will open the window if it's currently closed and vice-versa
	 * @param adminSettings
	 * @return String that will depend on whether the window has been opened or closed
	 * @throws ParseException
	 */
	String toggleWindow(final AdminSettingsDTO adminSettings) throws ParseException;
	
	/**
	 * This method clears the request data from the current window and inserts it into the history repository
	 */
	void insertPastRequests();
	
	/**
	 * This is an automated e-mailer that notifies all beneficiaries of the window opening/closing
	 * @throws Exception
	 */
	void generateEmails() throws Exception;
	
	/**
	 * This is a system function that generates the universal volunteer password on a daily basis
	 */
	void generateDailyPassword();
	
	/**
	 * This allows ADMIN_USERS to assist users in resetting their password in the Account Management module
	 * @param user
	 * @throws Exception
	 */
	void resetPassword(final UserDTO user) throws Exception;
	
	/**
	 * This method removes all data from the existing window, including that of allocated items in the window
	 */
	void clearWindowData();
	
	/**
	 * This method increases the score of every beneficiary at the start of the request window
	 */
	void updateScores();
	
	void generateClosingEmails() throws Exception;
	
}
