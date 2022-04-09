package helpinghands.donor.service;

import java.util.List;

import helpinghands.donor.dto.DonationDTO;
import helpinghands.donor.dto.DonorDTO;
import helpinghands.donor.entity.Donor;

public interface DonorService {
	
	List<Donor> getAllDonors();
	
	List<String> getDonorNames();
	
	void createDonor(final DonorDTO donor);
		
	void deleteDonor(final String id);
	
	DonationDTO retrieveNonperishableDonations(final String donor);

}
