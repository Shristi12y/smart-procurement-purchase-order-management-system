package com.procurement.enterpriseApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.Supplier;

public interface SupplierRepo extends JpaRepository<Supplier, Long> {
	
	List<Supplier> findByproductProductId(Long productId);
	Optional<Supplier> findByEmail(String email);
}
