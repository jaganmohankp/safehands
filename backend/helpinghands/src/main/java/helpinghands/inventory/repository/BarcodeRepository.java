package helpinghands.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.inventory.entity.Barcode;

public interface BarcodeRepository extends JpaRepository<Barcode, String> {

	Barcode findByBarcode(String barcode);
	
}
