package helpinghands.allocation.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 *
 * @version 1.0
 *
 */
public class AllocatedItemDTO {

	/**
	 * Represents the category of the allocated food item with the key category
	 */
	@JsonProperty("category")
	private String category;
	
	/**
	 * Represents the classification of the allocated food item with the key classification
	 */
	@JsonProperty("classification")
	private String classification;
	
	/**
	 * Represents the description of the allocated food item with the key description
	 */
	@JsonProperty("description")
	private String description;
	
	/**
	 * Represents the inventory quantity of the allocated food item with the key inventoryQuantity
	 */
	@JsonProperty("inventoryQuantity")
	private Integer inventoryQuantity;
	
	/**
	 * Represents the requested quantity of the allocated food item with the key requestedQuantity
	 */
	@JsonProperty("requestedQuantity")
	private Integer requestedQuantity;
	
	/**
	 * Represents the allocated quantity of the allocated food item with the key allocatedQuantity
	 */
	@JsonProperty("allocatedQuantity")
	private Integer allocatedQuantity;
	
	/**
	 * Empty constructor that should not be initialized in most cases
	 */
	protected AllocatedItemDTO() {}
	
	/**
	 * Constructor that enables the initialization of the DTO with all parameters populated
	 * @param category
	 * @param classification
	 * @param description
	 * @param inventoryQuantity
	 * @param requestedQuantity
	 * @param allocatedQuantity
	 */
	public AllocatedItemDTO(String category, String classification, String description, Integer inventoryQuantity,
			Integer requestedQuantity, Integer allocatedQuantity) {
		this.category = category;
		this.classification = classification;
		this.description = description;
		this.inventoryQuantity = inventoryQuantity;
		this.requestedQuantity = requestedQuantity;
		this.allocatedQuantity = allocatedQuantity;
	}
	
	/**
	 * 
	 * @return A String representing the category of the allocated food item
	 */
	public String getCategory() {
		return category;
	}
	
	/**
	 * Sets the category as specified by the input String
	 * @param category
	 */
	public void setCategory(String category) {
		this.category = category;
	}
	
	/**
	 * 
	 * @return A String representing the classification of the allocated food item
	 */
	public String getClassification() {
		return classification;
	}
	
	/**
	 * Sets the classification as specified by the input String
	 * @param classification
	 */
	public void setClassification(String classification) {
		this.classification = classification;
	}
	
	/**
	 * 
	 * @return A String representing the description of the allocated food item
	 */
	public String getDescription() {
		return description;
	}
	
	/**
	 * Sets the description as specified by the input String
	 * @param description
	 */
	public void setDescription(String description) {
		this.description = description;
	}
	
	/**
	 * 
	 * @return An Integer value representing the inventory quantity of the allocated food item
	 */
	public Integer getInventoryQuantity() {
		return inventoryQuantity;
	}
	
	/**
	 * Sets the inventory quantity of the food item to that of the input
	 * @param inventoryQuantity
	 */
	public void setInventoryQuantity(Integer inventoryQuantity) {
		this.inventoryQuantity = inventoryQuantity;
	}
	
	/**
	 * 
	 * @return An Integer value representing the request quantity of the allocated food item
	 */
	public Integer getRequestedQuantity() {
		return requestedQuantity;
	}
	
	/**
	 * Sets the requested quantity of the food item to that of the input
	 * @param requestedQuantity
	 */
	public void setRequestedQuantity(Integer requestedQuantity) {
		this.requestedQuantity = requestedQuantity;
	}
	
	/**
	 * 
	 * @return An Integer value representing the allocated quantity of the allocated food item
	 */
	public Integer getAllocatedQuantity() {
		return allocatedQuantity;
	}
	
	/**
	 * Sets the allocated quantity of the food item to that of the input
	 * @param allocatedQuantity
	 */
	public void setAllocatedQuantity(Integer allocatedQuantity) {
		this.allocatedQuantity = allocatedQuantity;
	}
	
}
