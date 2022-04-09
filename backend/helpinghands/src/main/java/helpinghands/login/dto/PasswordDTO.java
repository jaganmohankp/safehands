package helpinghands.login.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PasswordDTO {

	@NotNull
	@JsonProperty
	private String username;
	
	@NotNull
	@JsonProperty
	private String oldPassword;
	
	@NotNull
	@JsonProperty
	private String newPassword;

	protected PasswordDTO() {}
	
	public PasswordDTO(String username, String oldPassword, String newPassword) {
		this.username = username;
		this.oldPassword = oldPassword;
		this.newPassword = newPassword;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}
	
}
