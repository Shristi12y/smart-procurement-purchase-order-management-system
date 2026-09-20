package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Supplier;
import com.procurement.enterpriseApp.Repository.SupplierRepo;

@Service
public class SupplierService {
	
	@Autowired
	private SupplierRepo supplierRepo;
	
	@Autowired
	private EmailService emailService;
	
	
	public Supplier addSupplier(Supplier supplier) {
		supplier.setStatus("ACTIVE");
		Supplier savedSupplier = supplierRepo.save(supplier);
		
		//emailService.se
		
		return savedSupplier;
	}
	
	
	public List<Supplier> getAllSupplier() {
        List<Supplier> suppliers = supplierRepo.findAll();
        if (suppliers.isEmpty()) {
            throw new ResourceNotFoundException("No suppliers found.");
        }
        return suppliers;
    }
	
	
	public Supplier getSupplierById(Long supplierId) {
		return supplierRepo.findById(supplierId).orElseThrow(() ->
        new ResourceNotFoundException("Supplier not found with ID : " + supplierId));
}
	
	
	public Supplier updateSupplier(Long supplierId, Supplier supplier) {

    Supplier existingSupplier = supplierRepo.findById(supplierId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Supplier not found with ID : " + supplierId
                    )
            );

    existingSupplier.setName(supplier.getName());
    existingSupplier.setPhone(supplier.getPhone());
    existingSupplier.setAddress(supplier.getAddress());
    existingSupplier.setEmail(supplier.getEmail());
    existingSupplier.setAccountNo(supplier.getAccountNo());
    existingSupplier.setGstNumber(supplier.getGstNumber());
    existingSupplier.setStatus(supplier.getStatus());
    existingSupplier.setRating(supplier.getRating());
    existingSupplier.setFeedback(supplier.getFeedback());

    return supplierRepo.save(existingSupplier);
}
	
	
	public String deleteSupplier(Long supplierId) {
        Supplier supplier = supplierRepo.findById(supplierId).orElseThrow(() ->
                        new ResourceNotFoundException("Supplier not found with ID : " + supplierId));
        supplierRepo.delete(supplier);
        return "Supplier deleted successfully.";
    }
	
	
	public List<Supplier> getSupplierByProductId(Long productId) {
        List<Supplier> suppliers = supplierRepo.findByproductProductId(productId);
        if (suppliers.isEmpty()) {
        	throw new ResourceNotFoundException("No suppliers found for Product ID : " + productId);
        }
        return suppliers;
    }
	
	public Supplier loginSupplier(String email, String password) {

	    Supplier supplier = supplierRepo.findByEmail(email)
	            .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));

	    if (!supplier.getPassword().equals(password)) {
	    	throw new RuntimeException("Invalid password");
	    }

	    return supplier;
	}
	
}
