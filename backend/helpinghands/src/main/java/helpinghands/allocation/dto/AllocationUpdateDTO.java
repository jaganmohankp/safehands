package helpinghands.allocation.dto;

import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 *
 * @version 1.0
 *
 */
public class AllocationUpdateDTO {
	
	/**
	 * Represents the allocation id that will be displayed to the client for easier object identification purposes
	 */
	@JsonProperty("id")
	private String id;
	
	/**
	 * Represents the actual username of the beneficiary as a String with the key beneficiary
	 */
	@JsonProperty("beneficiary")
	private String beneficiary;
	
	/**
	 * Represents list of allocated items in a map data structure that will be serialized by the client automatically
	 * The display will be a list with the map structure consisting of the following keys:
	 * "category", "classification", "description", "allocatedQuantity"
	 * The keys have a value of the following data type, in the respective order:
	 * String, String, String, Integer
	 */
	@NotNull
	@JsonProperty("allocatedItems")
	private List<Map<String, Object>> allocatedItems;
	
	/**
	 * Empty constructor that should not be initialized in most instances
	 */
	protected AllocationUpdateDTO() {}

	/**
	 * Constructor that enables the creation of the DTO with all required variables
	 * @param id
	 * @param beneficiary
	 * @param allocatedItems
	 */
	public AllocationUpdateDTO(@JsonProperty("id") String id, @JsonProperty("beneficiary") String beneficiary, @JsonProperty("allocatedItems") List<Map<String, Object>> allocatedItems) {
		this.id = id;
		this.beneficiary = beneficiary;
		this.allocatedItems = allocatedItems;
	}
	
	/**
	 * 
	 * @return A String representing the Id of the allocation object
	 */
	public String getId() {
		return id;
	}
	
	/**
	 * Setter method that updates the Id to the specified value
	 * @param id
	 */
	public void setId(String id) {
		this.id = id;
	}
	
	/**
	 * 
	 * @return A String representing the username of the beneficiary
	 */
	public String getBeneficiary() {
		return beneficiary;
	}
	
	/**
	 * Setter method that updates the beneficiary username to the specified value
	 * @param beneficiary
	 */
	public void setBeneficiary(String beneficiary) {
		this.beneficiary = beneficiary;
	}
	
	/**
	 * 
	 * @return List of Map<String, Object> that represents the allocated items that have been assigned to a beneficiary
	 */
	public List<Map<String, Object>> getAllocatedItems() {
		return allocatedItems;
	}
	
	/**
	 * Setter method that updates the list of allocations that have been assigned to a beneficiary to the specified list
	 * @param allocatedItems
	 */
	public void setAllocatedItems(List<Map<String, Object>> allocatedItems) {
		this.allocatedItems = allocatedItems;
	}

}
