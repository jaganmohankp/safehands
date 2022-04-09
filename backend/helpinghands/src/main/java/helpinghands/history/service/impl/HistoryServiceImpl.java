package helpinghands.history.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helpinghands.history.dto.PastRequestDTO;
import helpinghands.history.dto.PastRequestsByBeneficiaryDTO;
import helpinghands.history.dto.RequestHistoryDTO;
import helpinghands.history.entity.PastRequest;
import helpinghands.history.entity.RequestHistory;
import helpinghands.history.repository.HistoryRepository;
import helpinghands.history.service.HistoryService;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.inventory.repository.FoodRepository;
import helpinghands.request.entity.Request;
import helpinghands.request.repository.RequestRepository;
import helpinghands.user.repository.UserRepository;
import helpinghands.util.EntityManager;
import helpinghands.util.EntityManager.DTOKey;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.InvalidBeneficiaryException;

@Service
public class HistoryServiceImpl implements HistoryService {

	@Autowired
	private HistoryRepository historyRepository;
	
	@Autowired
	private FoodRepository foodRepository;
	
	@Autowired
	private RequestRepository requestRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public List<RequestHistoryDTO> retrieveAllPastRequests() {
		// TODO Auto-generated method stub
		List<RequestHistory> requestHistoryList = historyRepository.findAll();
		List<RequestHistoryDTO> results = new ArrayList<RequestHistoryDTO>();
		for(RequestHistory requestHistory : requestHistoryList) {
			results.add((RequestHistoryDTO)EntityManager.convertToDTO(DTOKey.RequestHistoryDTO, requestHistory));
		}
		return results;
	}

	@Override
	public List<PastRequestsByBeneficiaryDTO> retrieveAllPastRequestsByBeneficiary(String beneficiary) {
		// TODO Auto-generated method stub
		RequestHistory requestHistory = historyRepository.findByBeneficiaryUserUsername(beneficiary);
		List<PastRequestsByBeneficiaryDTO> results = new ArrayList<PastRequestsByBeneficiaryDTO>();
		if(requestHistory == null) {
			throw new InvalidBeneficiaryException(ErrorMessages.NO_SUCH_BENEFICIARY);
		}
		Map<Date, List<PastRequest>> pastRequestsByDate = new HashMap<Date, List<PastRequest>>();
		List<PastRequest> pastRequests = requestHistory.getPastRequests();
		for(PastRequest pastRequest : pastRequests) {
			Date requestDate = pastRequest.getRequestCreationDate();
			List<PastRequest> pastRequestsOnDate = pastRequestsByDate.get(requestDate);
			if(pastRequestsOnDate == null) {
				pastRequestsOnDate = new ArrayList<PastRequest>();
				pastRequestsByDate.put(requestDate, pastRequestsOnDate);
			}
			pastRequestsOnDate.add(pastRequest);
			pastRequestsByDate.replace(requestDate, pastRequestsOnDate);
		}
		for(Entry<Date, List<PastRequest>> entry : pastRequestsByDate.entrySet()) {
			Date key = entry.getKey();
			List<PastRequest> value = entry.getValue();
			List<PastRequestDTO> pastRequestDTOList = new ArrayList<PastRequestDTO>();
			for(PastRequest pastRequest : value) {
				DonationItem foodItem = pastRequest.getPreviouslyRequestedItem();
				String category = foodItem.getCategory();
				String classification = foodItem.getClassification();
				String description = foodItem.getDescription();
				Integer requestedQuantity = pastRequest.getRequestedQuantity();
				Integer allocatedQuantity = pastRequest.getAllocatedQuantity();
				pastRequestDTOList.add(new PastRequestDTO(category, classification, description, requestedQuantity, allocatedQuantity, pastRequest.getRequestCreationDate()));
			}
			PastRequestsByBeneficiaryDTO individualResultEntry = new PastRequestsByBeneficiaryDTO(key, pastRequestDTOList);
			results.add(individualResultEntry);
		}
		results.sort(Comparator.comparing(PastRequestsByBeneficiaryDTO::getRequestCreationDate));
		Collections.reverse(results);
		return results;
	}

	@Override
	public void requestSimilarItems(Map<String, Object> map) {
		// TODO Auto-generated method stub
		String beneficiary = String.valueOf(map.get("beneficiary"));
		List<PastRequestsByBeneficiaryDTO> pastRequestsList = retrieveAllPastRequestsByBeneficiary(beneficiary);
		PastRequestsByBeneficiaryDTO pastRequest = pastRequestsList.get((int)map.get("index"));
		List<PastRequestDTO> pastRequestObjects = pastRequest.getPastRequests();
		for(PastRequestDTO requestDTO : pastRequestObjects) {
			List<Request> currentRequests = requestRepository.findByBeneficiaryUserUsername(beneficiary);
			boolean doesCurrentRequestExist = false;
			String category = requestDTO.getCategory();
			String classification = requestDTO.getClassification();
			String description = requestDTO.getDescription();
			for(Request request : currentRequests) {
				DonationItem requestFoodItem = request.getFoodItem();
				String requestCategory = requestFoodItem.getCategory();
				String requestClassification = requestFoodItem.getClassification();
				String requestDescription = requestFoodItem.getDescription();
				if(category.equals(requestCategory) && classification.equals(requestClassification) && description.equals(requestDescription)) {
					doesCurrentRequestExist = true;
				}
			}
			if(!doesCurrentRequestExist) {
				DonationItem foodItem = foodRepository.findByCategoryAndClassificationAndDescription(category, classification, description);
				Integer requestedQuantity = requestDTO.getRequestedQuantity() > foodItem.getQuantity() ? foodItem.getQuantity() : requestDTO.getRequestedQuantity();
				if(requestedQuantity > 0) {
					requestRepository.save(new Request(userRepository.findByUsernameIgnoreCase(beneficiary).getBeneficiary(), foodItem, requestedQuantity));
				}
			}
		}
	}

}
