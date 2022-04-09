package helpinghands.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.login.dto.LoginDTO;
import helpinghands.login.dto.LoginResponseDTO;
import helpinghands.login.entity.ResetToken;
import helpinghands.login.service.LoginService;
import helpinghands.security.JwtGenerator;
import helpinghands.user.dto.UserDTO;
import helpinghands.util.MessageConstants;
import helpinghands.util.ResponseDTO;

@RestController
@CrossOrigin
@RequestMapping("/authenticate")
public class LoginController {

	@Autowired
	private LoginService loginService;
	
	@Autowired
	private JwtGenerator jwtGenerator;
	
	@PostMapping
	public LoginResponseDTO authenticateUser(@RequestBody LoginDTO login) {
		LoginResponseDTO loginResponseDTO = new LoginResponseDTO(LoginResponseDTO.Status.SUCCESS, MessageConstants.LOGIN_SUCCESS, null);
		try {
			loginService.authenticate(login);
			loginResponseDTO.setResult(jwtGenerator.generateToken(login));
			loginResponseDTO.setUsertype(LoginResponseDTO.Usertype.valueOf(login.getUsertype().toUpperCase()));
		} catch (Exception e) {
			loginResponseDTO.setStatus(LoginResponseDTO.Status.FAIL);
			loginResponseDTO.setMessage(e.getMessage());
		}
		return loginResponseDTO;
	}
	
	@PostMapping("/volunteer-app")
	public ResponseDTO authenticateVolunteers(@RequestBody String dailyPassword) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.LOGIN_SUCCESS);
		try {
			loginService.authenticateVolunteers(dailyPassword);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	@PostMapping("/forgot-password")
	public ResponseDTO forgotPassword(@RequestBody UserDTO user) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.FORGOT_PASSWORD_REQUEST);
		try {
			loginService.resetPassword(user);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
	@PostMapping("/reset-password")
	public ResponseDTO changeForgottenPassword(@RequestBody ResetToken token) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.PASSWORD_CHANGE_SUCCESS);
		try {
			loginService.changeForgottenPassword(token);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
}
