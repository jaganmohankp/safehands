package helpinghands.util;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 
 *
 * @version 1.0
 * Wrapper class that will always be returned to the client as the response
 *
 */
public class ResponseDTO {

	/**
	 * 
	 *
	 * @version 1.0
	 * 
	 */
	public enum Status {
		SUCCESS, FAIL
	}
	
	/**
	 * The status will vary depending on whether the requested action has been fulfilled successfully
	 */
	@NotNull
	@JsonProperty("status")
	private Status status;
	
	/**
	 * The result of the action
	 */
	@NotNull
	@JsonProperty("result")
	private Object result;
	
	/**
	 * The messages that have been specified within the MessageConstants class
	 */
	@JsonProperty("message")
	private String message;
	
	/**
	 * Constructor that creates the Wrapper to be returned
	 * @param status
	 * @param result
	 * @param message
	 */
	public ResponseDTO(@JsonProperty("status") Status status, @JsonProperty("result") Object result, @JsonProperty("message") String message) {
		this.status = status;
		this.result = result;
		this.message = message;
	}

	/**
	 * 
	 * @return The status of the response from server - SUCCESS or FAIL
	 */
	public Status getStatus() {
		return status;
	}

	/**
	 * Setting the status of the response from server
	 * @param status
	 */
	public void setStatus(Status status) {
		this.status = status;
	}
	
	/**
	 * 
	 * @return The Object that depends on the type of request made against the server
	 */
	public Object getResult() {
		return result;
	}
	
	/**
	 * Setting of the Object as the result, that depends on the type of request made against the server
	 * @param result
	 */
	public void setResult(Object result) {
		this.result = result;
	}

	/**
	 * 
	 * @return The specific message that has been generated by the server depending on the type of request that has been made
	 */
	public String getMessage() {
		return message;
	}

	/**
	 * Setting of the specific message by the server to be sent as the response
	 * @param message
	 */
	public void setMessage(String message) {
		this.message = message;
	}
	
}
