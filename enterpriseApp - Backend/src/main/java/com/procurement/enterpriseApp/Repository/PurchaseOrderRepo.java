package com.procurement.enterpriseApp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.PurchaseOrder;

public interface PurchaseOrderRepo extends JpaRepository<PurchaseOrder, Long>{
	
	List<PurchaseOrder> findBySupplierSupplierId(Long supplierId);

    List<PurchaseOrder> findByCreatedByUserId(Long userId);
    
    boolean existsByProductProductId(Long productId);
}
