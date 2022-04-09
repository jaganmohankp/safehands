package helpinghands.history.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PastRequestDTO {
	
	@JsonProperty("category")
	private String category;
	
	@JsonProperty("classification")
	private String classification;
	
	@JsonProperty("description")
	private String description;
	
	@JsonProperty("requestedQuantity")
	private Integer requestedQuantity;
	
	@JsonProperty("allocatedQuantity")
	private Integer allocatedQuantity;
	
	@JsonProperty("requestCreationDate")
	private String requestCreationDate;

	public PastRequestDTO(String category, String classification, String description, Integer requestedQuantity,
			Integer allocatedQuantity, Date requestCreationDate) {
		this.category = category;
		this.classification = classification;
		this.description = description;
		this.requestedQuantity = requestedQuantity;
		this.allocatedQuantity = allocatedQuantity;
		this.requestCreationDate = requestCreationDate.toString();
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getClassification() {
		return classification;
	}

	public void setClassification(String classification) {
		this.classification = classification;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getRequestedQuantity() {
		return requestedQuantity;
	}

	public void setRequestedQuantity(Integer requestedQuantity) {
		this.requestedQuantity = requestedQuantity;
	}

	public Integer getAllocatedQuantity() {
		return allocatedQuantity;
	}

	public void setAllocatedQuantity(Integer allocatedQuantity) {
		this.allocatedQuantity = allocatedQuantity;
	}

	public String getRequestCreationDate() {
		return requestCreationDate;
	}

	public void setRequestCreationDate(String requestCreationDate) {
		this.requestCreationDate = requestCreationDate;
	}

}
