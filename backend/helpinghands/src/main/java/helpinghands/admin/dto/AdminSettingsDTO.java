package helpinghands.admin.dto;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 *
 * @version 1.0
 *
 */
public class AdminSettingsDTO {
	
	/**
	 * Represents the window start date as a String using the key windowStartDate as served by the client
	 */
	@NotNull
	@JsonProperty("windowStartDate")
	private String startDate;
	
	/**
	 * Represents the window end date as a String using the key windowEndDate as served by the client
	 */
	@NotNull
	@JsonProperty("windowEndDate")
	private String endDate;
	
	/**
	 * Represents the multiplier rate as a Double using the key multiplierRate as served by the client
	 */
	@NotNull
	@JsonProperty("multiplierRate")
	private Double multiplierRate;
	
	/**
	 * Represents the decay rate as a Double using the key decayRate as served by the client
	 */
	@NotNull
	@JsonProperty("decayRate")
	private Double decayRate;

	/**
	 * Default constructor that should not be initialized
	 * Required for Spring injection
	 */
	protected AdminSettingsDTO() {}
	
	/**
	 * Constructor that enables the creation of the admin settings DTO object
	 * @param startDate
	 * @param endDate
	 * @param multiplierRate
	 * @param decayRate
	 */
	public AdminSettingsDTO(String startDate, String endDate, Double multiplierRate, Double decayRate) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.multiplierRate = multiplierRate;
		this.decayRate = decayRate;
	}

	/**
	 * 
	 * @return A String that represents the start date as specified by the DTO
	 */
	public String getStartDate() {
		return startDate;
	}

	/**
	 * Set the start date of the DTO object to that as specified
	 * @param startDate
	 */
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	/**
	 * 
	 * @return A String that represents the end date as specified by the DTO
	 */
	public String getEndDate() {
		return endDate;
	}

	/**
	 * Set the end date of the DTO object to that as specified
	 * @param endDate
	 */
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	/**
	 * 
	 * @return A Double that represents the multiplier rate as specified by the DTO
	 */
	public Double getMultiplierRate() {
		return multiplierRate;
	}

	/**
	 * Set the multiplier rate to that as specified
	 * @param multiplierRate
	 */
	public void setMultiplierRate(Double multiplierRate) {
		this.multiplierRate = multiplierRate;
	}

	/**
	 * 
	 * @return A double that represents the decay rate as specified by the DTO
	 */
	public Double getDecayRate() {
		return decayRate;
	}

	/**
	 * Set the decay rate to that as specified
	 * @param decayRate
	 */
	public void setDecayRate(Double decayRate) {
		this.decayRate = decayRate;
	}

}
