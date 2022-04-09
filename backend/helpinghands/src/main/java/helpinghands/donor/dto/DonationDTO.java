package helpinghands.donor.dto;

import java.util.List;

public class DonationDTO {
	
	public DonationDTO(List<AnnualDonationDTO> yearlyDonations) {
		this.yearlyDonations = yearlyDonations;
	}

	private List<AnnualDonationDTO> yearlyDonations;

	public List<AnnualDonationDTO> getYearlyDonations() {
		return yearlyDonations;
	}

	public void setYearlyDonations(List<AnnualDonationDTO> yearlyDonations) {
		this.yearlyDonations = yearlyDonations;
	}

}
