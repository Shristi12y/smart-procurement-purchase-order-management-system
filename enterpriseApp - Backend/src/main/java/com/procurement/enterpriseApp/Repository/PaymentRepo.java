package com.procurement.enterpriseApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.Payment;

public interface PaymentRepo extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPurchaseOrderPurchaseOrderId(Long purchaseOrderId);

    List<Payment> findByPaymentStatus(
            com.procurement.enterpriseApp.Model.Enum.PaymentStatus status);
    
    List<Payment> findByPurchaseOrderSupplierSupplierId(Long supplierId);
}