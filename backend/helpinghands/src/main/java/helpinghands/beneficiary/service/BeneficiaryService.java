package helpinghands.beneficiary.service;

import java.util.List;

import helpinghands.beneficiary.dto.BeneficiaryDTO;

public interface BeneficiaryService {
	
	List<BeneficiaryDTO> getAllBeneficiaries();
	
	BeneficiaryDTO getBeneficiaryDetails(final String beneficiary);
	
	void createBeneficiary(final BeneficiaryDTO beneficiary);

	void updateBeneficiary(final BeneficiaryDTO beneficiary);
	
}
