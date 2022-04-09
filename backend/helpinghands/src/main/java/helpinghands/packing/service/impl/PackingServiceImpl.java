package helpinghands.packing.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.locks.ReadWriteLock;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helpinghands.admin.entity.AdminSettings;
import helpinghands.admin.repository.AdminRepository;
import helpinghands.allocation.entity.AllocatedFoodItem;
import helpinghands.allocation.entity.Allocation;
import helpinghands.allocation.repository.AllocationRepository;
import helpinghands.beneficiary.entity.Beneficiary;
import helpinghands.beneficiary.repository.BeneficiaryRepository;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.inventory.repository.FoodRepository;
import helpinghands.packing.dto.PackedItemDTO;
import helpinghands.packing.dto.PackingListDTO;
import helpinghands.packing.entity.PackedFoodItem;
import helpinghands.packing.entity.PackingList;
import helpinghands.packing.repository.PackingRepository;
import helpinghands.packing.service.PackingService;
import helpinghands.reporting.entity.Invoice;
import helpinghands.reporting.repository.InvoiceRepository;
import helpinghands.util.EntityManager;
import helpinghands.util.LockFactory;
import helpinghands.util.EntityManager.DTOKey;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.PackingUpdateException;

@Service
public class PackingServiceImpl implements PackingService {

	@Autowired
	private PackingRepository packingRepository;
	
	@Autowired
	private AllocationRepository allocationRepository;
	
	@Autowired
	private FoodRepository foodRepository;
	
	@Autowired
	private BeneficiaryRepository beneficiaryRepository;
	
	@Autowired
	private InvoiceRepository invoiceRepository;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Override
	public List<PackingListDTO> retrieveAllPackingLists() {
		// TODO Auto-generated method stub
		List<PackingList> packingLists = packingRepository.findByPackingStatusFalse();
		List<PackingListDTO> results = new ArrayList<PackingListDTO>();
		for(PackingList packingList : packingLists) {
			results.add((PackingListDTO)EntityManager.convertToDTO(DTOKey.PackingListDTO, packingList));
		}
		return results;
	}

	@Override
	public PackingListDTO findById(String id) {
		// TODO Auto-generated method stub
		PackingList packingList = packingRepository.findById(Long.valueOf(id)).orElse(null);
		return (PackingListDTO)EntityManager.convertToDTO(DTOKey.PackingListDTO, packingList);
	}

	@Override
	public PackingListDTO findByBeneficiary(String beneficiary) {
		// TODO Auto-generated method stub
		PackingList packingList = packingRepository.findByBeneficiaryUserUsername(beneficiary);
		return (PackingListDTO)EntityManager.convertToDTO(DTOKey.PackingListDTO, packingList);
	}

	@Override
	public void generatePackingList() {
		// TODO Auto-generated method stub
		List<Allocation> allocations = allocationRepository.findAll();
		List<PackingList> packingLists = new ArrayList<PackingList>();
		for(Allocation allocation : allocations) {
			List<AllocatedFoodItem> allocatedItems = allocation.getAllocatedItems();
			List<PackedFoodItem> packedItems = new ArrayList<PackedFoodItem>();
			for(AllocatedFoodItem allocatedItem : allocatedItems) {
				Integer allocatedQuantity = allocatedItem.getAllocatedQuantity();
				if(allocatedQuantity > 0) {
					packedItems.add(new PackedFoodItem(allocatedItem.getFoodItem(), allocatedQuantity));
				}
			}
			if(!packedItems.isEmpty()) {
				PackingList packingList = new PackingList(allocation.getBeneficiary(), packedItems);
				for(PackedFoodItem packedItem : packedItems) {
					packedItem.setPackingList(packingList);
				}
				packingLists.add(packingList);
			}
		}
		packingRepository.saveAll(packingLists);
	}

	@Override
	public void updatePackedQuantities(PackingListDTO packingList) {
		// TODO Auto-generated method stub
		PackingList dbPackingList = packingRepository.findById(packingList.getId()).orElse(null);
		if(dbPackingList == null || dbPackingList.getPackingStatus()) {
			throw new PackingUpdateException(ErrorMessages.PACKING_UPDATE_ERROR);
		}
		Long id = packingList.getId();
		ReadWriteLock lock = LockFactory.getWriteLock(String.valueOf(id));
		if(lock.writeLock().tryLock()) {
			List<PackedFoodItem> beneficiaryPackedItems = dbPackingList.getPackedItems();
			HashMap<String, PackedFoodItem> packedItemsMap = new HashMap<String, PackedFoodItem>();
			beneficiaryPackedItems.forEach(item -> {
				DonationItem dbFoodItem = item.getPackedFoodItem();
				String category = dbFoodItem.getCategory();
				String classification = dbFoodItem.getClassification();
				String description = dbFoodItem.getDescription();
				String key = category + "," + classification + "," + description;
				packedItemsMap.put(key, item);
			});
			List<PackedItemDTO> beneficiaryPackedItemsUpdates = packingList.getPackedItems();
			for(PackedItemDTO packedItemDTO : beneficiaryPackedItemsUpdates) {
				String category = packedItemDTO.getCategory();
				String classification = packedItemDTO.getClassification();
				String description = packedItemDTO.getDescription();
				PackedFoodItem packedFoodItem = packedItemsMap.get(category + "," + classification + "," + description);
				DonationItem dbFoodItem = packedFoodItem.getPackedFoodItem();
				// Modifying the inventory remaining in the database
				dbFoodItem.setQuantity(dbFoodItem.getQuantity() - packedItemDTO.getPackedQuantity());
				packedFoodItem.setPackedQuantity(packedItemDTO.getPackedQuantity());
				foodRepository.save(dbFoodItem);
				// Modifying the beneficiary score
				modifyBeneficiaryScore(dbPackingList.getBeneficiary(), Double.valueOf(dbFoodItem.getQuantity() * dbFoodItem.getValue()));
				dbPackingList.setPackingStatus(Boolean.TRUE);
				packingRepository.save(dbPackingList);
			}
		} else {
			throw new PackingUpdateException(ErrorMessages.PACKING_UPDATE_ERROR);
		}
	}
	
	private void modifyBeneficiaryScore(Beneficiary beneficiary, Double value) {
		Double currentScore = beneficiary.getScore();
		AdminSettings adminSettings = adminRepository.findById(1L).orElse(null);
		Double newScore = currentScore - adminSettings.getDecayRate() * value;
		if(newScore <= 0) {
			newScore = Double.valueOf(1);
		}
		beneficiary.setScore(newScore);
		beneficiaryRepository.save(beneficiary);
	}

	@Override
	public Boolean reviewAllPackingStatus() {
		// TODO Auto-generated method stub
		List<PackingList> packingLists = packingRepository.findAll();
		for(PackingList packingList : packingLists) {
			if(!packingList.getPackingStatus()) {
				return false;
			}
		}
		return true;
	}

	@Override
	public void generateDbInvoices(PackingList packingList) {
		// TODO Auto-generated method stub
		Beneficiary beneficiary = packingList.getBeneficiary();
		// Our understanding of the requirements are that the billing organization and receiving organization are the same
		Invoice invoice = new Invoice(beneficiary.getId(), beneficiary.getId(), packingList.getId());
		invoiceRepository.save(invoice);
		// This is to clear up the previous entry so that the beneficiary can be assigned a new list in the next window
		// We can either do this now, or do this in a separate manager that checks for these associations when window opens
		//beneficiary.setPackingList(null);
		//beneficiaryRepository.save(beneficiary);
	}

	@Override
	public PackingList findDbListByBeneficiary(String beneficiary) {
		// TODO Auto-generated method stub
		return packingRepository.findByBeneficiaryUserUsername(beneficiary);
	}

	@Override
	public PackingList findDbListById(Long id) {
		// TODO Auto-generated method stub
		return packingRepository.findById(id).orElse(null);
	}

	@Override
	public List<PackingListDTO> retrieveAllPackingListsInWindow() {
		// TODO Auto-generated method stub
		AdminSettings adminSettings = adminRepository.findById(1L).orElse(null);
		List<PackingList> packingLists = packingRepository.findByCreationDateBetween(adminSettings.getLastStartDate(), adminSettings.getLastEndDate());
		List<PackingListDTO> results = new ArrayList<PackingListDTO>();
		for(PackingList packingList : packingLists) {
			results.add((PackingListDTO)EntityManager.convertToDTO(DTOKey.PackingListDTO, packingList));
		}
		return results;
	}

	/*
	@Override
	public void testing() {
		// TODO Auto-generated method stub
		Beneficiary dbBeneficiary = beneficiaryRepository.findByUserUsername("dan");
		dbBeneficiary.setPackingList(null);
	}
	*/

}
