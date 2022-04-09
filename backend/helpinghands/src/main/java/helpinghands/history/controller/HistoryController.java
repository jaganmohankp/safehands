package helpinghands.history.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import helpinghands.history.dto.PastRequestsByBeneficiaryDTO;
import helpinghands.history.dto.RequestHistoryDTO;
import helpinghands.history.service.HistoryService;
import helpinghands.util.MessageConstants;
import helpinghands.util.ResponseDTO;

@RestController
@CrossOrigin
@RequestMapping("/rest/history")
public class HistoryController {

	@Autowired
	private HistoryService historyService;
	
	@GetMapping("/requests/display-all")
	public ResponseDTO retrieveAllRequestHistory() {
		List<RequestHistoryDTO> requestHistories = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, requestHistories, MessageConstants.REQUEST_HISTORY_RETRIEVE_SUCCESS);
		try {
			requestHistories = historyService.retrieveAllPastRequests();
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		responseDTO.setResult(requestHistories);
		return responseDTO;
	}
	
	@GetMapping("/requests/display")
	public ResponseDTO retrieveAllPastRequestsByBeneficiary(@RequestParam(value = "beneficiary", required = true) String beneficiary) {
		List<PastRequestsByBeneficiaryDTO> response = null;
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, response, MessageConstants.REQUEST_HISTORY_RETRIEVE_SUCCESS);
		try {
			response = historyService.retrieveAllPastRequestsByBeneficiary(beneficiary);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		responseDTO.setResult(response);
		return responseDTO;
	}
	
	@PostMapping("/make-request")
	public ResponseDTO makeSimilarRequests(@RequestBody Map<String, Object> map) {
		ResponseDTO responseDTO = new ResponseDTO(ResponseDTO.Status.SUCCESS, null, MessageConstants.REQUEST_CREATE_SUCCESS);
		try {
			historyService.requestSimilarItems(map);
		} catch (Exception e) {
			responseDTO.setStatus(ResponseDTO.Status.FAIL);
			responseDTO.setMessage(e.getMessage());
		}
		return responseDTO;
	}
	
}
