package helpinghands.user.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 *
 * @version 1.0
 *
 */
public class UserDTO {
	
	/**
	 * Creating a mapping for POJO serializer using the key username to store the username details as provided by the client
	 */
	@NotNull
	@JsonProperty("username")
	private String username;
	
	/**
	 * Creating a mapping for the POJO serializer using the key password to store the password details as provided by the client
	 */
	@NotNull
	@JsonProperty("password")
	private String password;
	
	/**
	 * Creating a mapping for the POJO serializer using the key usertype to store the usertype as provided by the client
	 */
	@NotNull
	@JsonProperty("usertype")
	private String usertype;
	
	/**
	 * Creating a mapping for the POJO serializer using the key usertype to store the name as provided by the client
	 */
	@NotNull
	@JsonProperty("name")
	private String name;
	
	/**
	 * Creating a mapping for the POJO serializer using the key usertype to store the email as provided by the client
	 */
	@NotNull
	@JsonProperty("email")
	private String email;
	
	/**
	 * Constructor that initiates the POJO using the details as provided by the client
	 * @param username
	 * @param password
	 * @param usertype
	 * @param name
	 * @param email
	 */
	public UserDTO(@JsonProperty("username") String username, @JsonProperty("password") String password, 
			@JsonProperty("usertype") String usertype, @JsonProperty("name") String name, @JsonProperty("email") String email) {
		this.username = username;
		this.password = password;
		this.usertype = usertype;
		this.name = name;
		this.email = email;
	}
	
	/**
	 * 
	 * @return The username as specified by the client
	 */
	public String getUsername() {
		return username;
	}
	
	/**
	 * Setting the username as specified by the client
	 * @param username
	 */
	public void setUsername(String username) {
		this.username = username;
	}
	
	/**
	 * 
	 * @return The password as specified by the client
	 */
	public String getPassword() {
		return password;
	}
	
	/**
	 * Setting the password as specified by the client
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	
	/**
	 * 
	 * @return The usertype as specified by the client
	 */
	public String getUsertype() {
		return usertype;
	}
	
	/**
	 * Setting the usertype as specified by the client
	 * @param usertype
	 */
	public void setUsertype(String usertype) {
		this.usertype = usertype;
	}
	
	/**
	 * 
	 * @return The name of the user as specified by the client
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Setting the name of the user as specified by the client
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * 
	 * @return The email address of the user as specified by the client
	 */
	public String getEmail() {
		return email;
	}
	
	/**
	 * Setting the email address of the user as specified by the client
	 * @param email
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	
}
