package helpinghands.user.entity;

import javax.persistence.Cacheable;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import helpinghands.beneficiary.entity.Beneficiary;
import helpinghands.security.model.Role;

/**
 * 
 *
 * @version 1.0
 *
 */
@Entity
@Table(name = "user")
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "user_cache")
public class User  {
	
	/**
	 * The identifier that will be created automatically by the database's sequence generator as defined
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
	@SequenceGenerator(initialValue = 1, allocationSize = 1, name = "user_seq_gen", sequenceName = "user_sequence")
	@Column(name = "id", nullable = false)
	private Long id;
	
	/**
	 * The username is a unique identifier that helps in differentiating between different User objects
	 */
	@Column(unique = true)
	private String username;
	
	/**
	 * The password will allow the client to accurately identify if the user has the right credentials to log-in
	 */
	private String password;
	
	/**
	 * The usertype will allow the client to determine the access rights that the user has, as well as perform route redirecting to the actual interface
	 * There are only 3 types of users: admin, volunteer, beneficiary
	 */
	private String usertype;
	
	/**
	 * The name of the user/organization
	 */
	private String name;
	
	/**
	 * The email address of the user/organization
	 */
	@Column(unique = true)
	private String email;
	
	/**
	 * This field will only be present if the user is also a beneficiary
	 */
	@OneToOne(mappedBy = "user", 
			cascade = CascadeType.ALL, 
			fetch = FetchType.LAZY, 
			optional = true, 
			orphanRemoval = true)
	@JsonIgnore
	private Beneficiary beneficiary;
	
	/**
	 * This field allows the server to verify if the user has the required authorization to perform specific tasks
	 */
	@OneToOne(fetch = FetchType.EAGER)
	@JoinTable(name = "user_role", 
		joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
		inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
	//@JoinColumn(name = "role_id")
	@JsonIgnore
	private Role role;
	
	/**
	 * Empty constructor that should not be initialized in most cases
	 * Required for Spring injection
	 */
	protected User() {}
	
	/**
	 * Constructor that generates a user object
	 * @param username
	 * @param password
	 * @param usertype
	 * @param name
	 * @param email
	 */
	public User(String username, String password, String usertype, String name, String email) {
		this.username = username;
		this.password = password;
		this.usertype = usertype;
		this.name = name;
		this.email = email;
	}

	/**
	 * @return Returns the unique generated identifier of the user object
	 */
	public Long getId() {
		return id;
	}
	
	/**
	 * Sets the unique generated identifier of the user object, should not be used in most instances
	 * @param id
	 */
	public void setId(Long id) {
		this.id = id;
	}
	
	/**
	 * 
	 * @return Returns the username of the user object
	 */
	public String getUsername() {
		return username;
	}
	
	/**
	 * Sets the username of the user object, should not be used in most instances
	 * @param username
	 */
	public void setUsername(String username) {
		this.username = username;
	}
	
	/**
	 * 
	 * @return Returns the password of the user object
	 */
	public String getPassword() {
		return password;
	}
	
	/**
	 * Sets the password of the user object, mainly used in account management functions (e.g. reset password)
	 * @param password
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	
	/**
	 * 
	 * @return Returns the usertype of the user object
	 */
	public String getUsertype() {
		return usertype;
	}
	
	/**
	 * Sets the usertype of the user object, should not be used in most instances
	 * @param usertype
	 */
	public void setUsertype(String usertype) {
		this.usertype = usertype;
	}
	
	/**
	 * 
	 * @return Returns the name of the user object
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Sets the name of the user object, mainly used in account management functions (e.g. update user)
	 * @param name
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * 
	 * @return Returns the email address of the usr object
	 */
	public String getEmail() {
		return email;
	}
	
	/**
	 * Sets the email of the user object, mainly used in account management functions (e.g. update user)
	 * @param email
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	
	/**
	 * 
	 * @return Returns the beneficiary object that is affiliated with the user, will be null if there is no such pairing
	 */
	public Beneficiary getBeneficiary() {
		return beneficiary;
	}

	/**
	 * Sets the beneficiary object that will be affiliated with the user
	 * @param beneficiary
	 */
	public void setBeneficiary(Beneficiary beneficiary) {
		this.beneficiary = beneficiary;
	}

	/**
	 * 
	 * @return Returns the role access rights that the user possesses
	 */
	public Role getRole() {
		return role;
	}

	/**
	 * Sets the role access rights for the selected user
	 * @param role
	 */
	public void setRole(Role role) {
		this.role = role;
	}	
	
}
