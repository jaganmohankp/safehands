package helpinghands.history.service;

import java.util.List;
import java.util.Map;

import helpinghands.history.dto.PastRequestsByBeneficiaryDTO;
import helpinghands.history.dto.RequestHistoryDTO;

public interface HistoryService {
	
	List<RequestHistoryDTO> retrieveAllPastRequests();
	
	List<PastRequestsByBeneficiaryDTO> retrieveAllPastRequestsByBeneficiary(final String beneficiary);
	
	void requestSimilarItems(final Map<String, Object> map);

}
