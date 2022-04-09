package helpinghands.request.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helpinghands.beneficiary.entity.Beneficiary;
import helpinghands.beneficiary.repository.BeneficiaryRepository;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.inventory.repository.FoodRepository;
import helpinghands.request.dto.RequestDTO;
import helpinghands.request.entity.Request;
import helpinghands.request.repository.RequestRepository;
import helpinghands.request.service.RequestService;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.InvalidRequestException;

@Service
public class RequestServiceImpl implements RequestService {
	
	@Autowired
	private RequestRepository requestRepository;
	
	@Autowired
	private BeneficiaryRepository beneficiaryRepository;
	
	@Autowired
	private FoodRepository foodRepository;

	@Override
	public List<Request> getAllRequests() {
		// TODO Auto-generated method stub
		return requestRepository.findAll();
	}

	@Override
	public List<Request> getAllRequestsByBeneficiary(String beneficiary) {
		// TODO Auto-generated method stub
		return requestRepository.findByBeneficiaryUserUsername(beneficiary);
	}

	@Override
	public void createAndUpdateRequest(RequestDTO request) {
		// TODO Auto-generated method stub
		String beneficiaryUsername = request.getBeneficiary();
		List<Request> requestsByBeneficiary = requestRepository.findByBeneficiaryUserUsername(beneficiaryUsername);
		String requestedCategory = request.getCategory();
		String requestedClassification = request.getClassification();
		String requestedDescription = request.getDescription();
		boolean foundPreviousRequest = false;
		for(Request dbRequest : requestsByBeneficiary) {
			DonationItem dbFoodItem = dbRequest.getFoodItem();
			String category = dbFoodItem.getCategory();
			String classification = dbFoodItem.getClassification();
			String description = dbFoodItem.getDescription();
			if(category.equals(requestedCategory) && classification.equals(requestedClassification)
					&& description.equals(requestedDescription)) {
				foundPreviousRequest = true;
				dbRequest.setRequestedQuantity(request.getQuantity());
				requestRepository.save(dbRequest);
				break;
			}
		}
		if(!foundPreviousRequest) {
			Beneficiary dbBeneficiary = beneficiaryRepository.findByUserUsername(beneficiaryUsername);
			DonationItem dbFoodItem = foodRepository.findByCategoryAndClassificationAndDescription(requestedCategory, requestedClassification, requestedDescription);
			requestRepository.save(new Request(dbBeneficiary, dbFoodItem, request.getQuantity()));
		}
	}

	@Override
	public void deleteRequest(String id) {
		// TODO Auto-generated method stub
		Request request = requestRepository.findById(Long.valueOf(id)).orElse(null);
		if(request == null) {
			throw new InvalidRequestException(ErrorMessages.NO_SUCH_REQUEST);
		}
		requestRepository.delete(request);
	}

}
