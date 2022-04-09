package helpinghands.donor.service.impl;

import java.sql.Date;
import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helpinghands.donor.dto.AnnualDonationDTO;
import helpinghands.donor.dto.DonationDTO;
import helpinghands.donor.dto.DonationDetailsDTO;
import helpinghands.donor.dto.DonorDTO;
import helpinghands.donor.dto.MonthlyDonationDTO;
import helpinghands.donor.entity.DonatedNPItem;
import helpinghands.donor.entity.Donor;
import helpinghands.donor.repository.DonorRepository;
import helpinghands.donor.service.DonorService;
import helpinghands.inventory.entity.DonationItem;
import helpinghands.util.MessageConstants.ErrorMessages;
import helpinghands.util.exceptions.InvalidDonorException;

@Service
public class DonorServiceImpl implements DonorService {
	
	@Autowired
	private DonorRepository donorRepository;

	@Override
	public List<Donor> getAllDonors() {
		// TODO Auto-generated method stub
		return donorRepository.findAll();
	}

	@Override
	public List<String> getDonorNames() {
		// TODO Auto-generated method stub
		List<String> donorNames = new ArrayList<>();
		List<Donor> donorList = donorRepository.findAll();
		for(Donor donor: donorList) {
			donorNames.add(donor.getName());
		}
		return donorNames;
	}

	@Override
	public void createDonor(DonorDTO donor) {
		// TODO Auto-generated method stub
		Donor dbDonor = donorRepository.findByName(donor.getName());
		if(dbDonor != null) {
			throw new InvalidDonorException(ErrorMessages.DONOR_ALREADY_EXISTS);
		}
		donorRepository.save(new Donor(donor.getName()));
	}

	@Override
	public void deleteDonor(String id) {
		// TODO Auto-generated method stub
		Donor dbDonor = donorRepository.findById(Long.valueOf(id)).orElse(null);
		if(dbDonor == null) {
			throw new InvalidDonorException(ErrorMessages.DONOR_DOES_NOT_EXIST);
		}
		donorRepository.delete(dbDonor);
	}

	@Override
	public DonationDTO retrieveNonperishableDonations(String donor) {
		// TODO Auto-generated method stub
		Donor dbDonor = donorRepository.findByName(donor);
		if(dbDonor == null) {
			throw new InvalidDonorException(ErrorMessages.DONOR_DOES_NOT_EXIST);
		}
		List<DonatedNPItem> npDonations = dbDonor.getNonperishableDonations();
		Map<Integer, Map<Integer, List<DonationDetailsDTO>>> yearlyDonationsMap = new HashMap<Integer, Map<Integer, List<DonationDetailsDTO>>>();
		for(DonatedNPItem npDonation : npDonations) {
			DonationItem dbFoodItem = npDonation.getDonatedItem();
			String category = dbFoodItem.getCategory();
			String classification = dbFoodItem.getClassification();
			String description = dbFoodItem.getDescription();
			Integer donatedQuantity = npDonation.getDonatedQuantity();
			Double value = dbFoodItem.getValue();
			Date donationDate = (java.sql.Date)npDonation.getDonationDate();
			LocalDate localDate = donationDate.toLocalDate();
					//donationDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			Integer year = localDate.getYear();
			Integer month = localDate.getMonthValue();
			Map<Integer, List<DonationDetailsDTO>> monthlyDonationMap = yearlyDonationsMap.get(year);
			if(monthlyDonationMap == null) {
				monthlyDonationMap = new HashMap<Integer, List<DonationDetailsDTO>>();
				for(int i = 1; i <= 12; i++) {
					monthlyDonationMap.put(i, new ArrayList<DonationDetailsDTO>());
				}
				yearlyDonationsMap.put(year, monthlyDonationMap);
			}
			List<DonationDetailsDTO> monthlyDonations = monthlyDonationMap.get(month);
			if(monthlyDonations == null) {
				List<DonationDetailsDTO> newList = new ArrayList<DonationDetailsDTO>();
				monthlyDonationMap.put(month, newList);
			}
			monthlyDonations.add(new DonationDetailsDTO(category, classification, description, donatedQuantity, value, donatedQuantity * value));
		}
		List<AnnualDonationDTO> annualDonationDTOList = new ArrayList<AnnualDonationDTO>();
		for(Map.Entry<Integer, Map<Integer, List<DonationDetailsDTO>>> entry : yearlyDonationsMap.entrySet()) {
			Integer yearKey = entry.getKey();
			Map<Integer, List<DonationDetailsDTO>> monthlyDonationByYearMap = entry.getValue();
			List<MonthlyDonationDTO> monthlyDonationDTOList = new ArrayList<MonthlyDonationDTO>();
			for(Map.Entry<Integer, List<DonationDetailsDTO>> mapEntry : monthlyDonationByYearMap.entrySet()) {
				Integer monthKey = mapEntry.getKey();
				List<DonationDetailsDTO> monthlyDonations = mapEntry.getValue();
				monthlyDonationDTOList.add(new MonthlyDonationDTO(Month.of(monthKey).toString(), monthlyDonations));
			}
			annualDonationDTOList.add(new AnnualDonationDTO(String.valueOf(yearKey), monthlyDonationDTOList));
		}
		DonationDTO donationDTO = new DonationDTO(annualDonationDTOList);
		return donationDTO;
	}

}
