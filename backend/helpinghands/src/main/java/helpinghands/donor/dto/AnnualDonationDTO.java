package helpinghands.donor.dto;

import java.util.List;

public class AnnualDonationDTO {
	
	public AnnualDonationDTO(String yearString, List<MonthlyDonationDTO> monthlyDonations) {
		this.yearString = yearString;
		this.monthlyDonations = monthlyDonations;
	}

	private String yearString;
	
	private List<MonthlyDonationDTO> monthlyDonations;

	public String getYearString() {
		return yearString;
	}

	public void setYearString(String yearString) {
		this.yearString = yearString;
	}

	public List<MonthlyDonationDTO> getMonthlyDonations() {
		return monthlyDonations;
	}

	public void setMonthlyDonations(List<MonthlyDonationDTO> monthlyDonations) {
		this.monthlyDonations = monthlyDonations;
	}

}
