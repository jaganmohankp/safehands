package helpinghands.request.service;

import java.util.List;

import helpinghands.request.dto.RequestDTO;
import helpinghands.request.entity.Request;

public interface RequestService {

	List<Request> getAllRequests();
	
	List<Request> getAllRequestsByBeneficiary(final String beneficiary);
	
	void createAndUpdateRequest(final RequestDTO request);
			
	void deleteRequest(final String id);
		
}
