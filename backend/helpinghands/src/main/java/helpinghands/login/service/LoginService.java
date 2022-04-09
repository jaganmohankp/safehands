package helpinghands.login.service;

import helpinghands.login.dto.LoginDTO;
import helpinghands.login.entity.ResetToken;
import helpinghands.user.dto.UserDTO;

public interface LoginService {

	void authenticate(final LoginDTO loginDetails);
	
	void authenticateVolunteers(final String dailyPassword);
	
	void resetPassword(final UserDTO user) throws Exception;
	
	void changeForgottenPassword(final ResetToken token) throws Exception;
	
}
