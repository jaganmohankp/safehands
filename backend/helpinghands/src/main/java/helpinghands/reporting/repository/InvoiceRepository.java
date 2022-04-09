package helpinghands.reporting.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import helpinghands.reporting.entity.Invoice;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
	
	Optional<Invoice> findById(Long id);
	
	Invoice findByInvoiceLabel(String invoiceId);

}
