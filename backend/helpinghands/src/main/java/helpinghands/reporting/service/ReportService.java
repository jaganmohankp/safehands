package helpinghands.reporting.service;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

import helpinghands.reporting.dto.InvoiceDTO;
import helpinghands.reporting.entity.InvoiceData;

public interface ReportService {
	
	List<InvoiceDTO> retrieveAllInvoices();
	
	InvoiceData retrieveInvoiceData(final String invoiceId);
	
	void updateInvoiceData(final Map<String, String> details) throws ParseException;
	
	void generateInvoicePDF(final String invoiceId) throws ParseException;

}
