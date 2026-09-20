package com.procurement.enterpriseApp.Service;


import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.PurchaseOrder;
import com.procurement.enterpriseApp.Model.Supplier;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Model.Enum.ApprovalStatus;
import com.procurement.enterpriseApp.Model.Enum.PurchaseOrderStatus;
import com.procurement.enterpriseApp.Repository.ApprovalRequestRepo;
import com.procurement.enterpriseApp.Repository.ProductRepo;
import com.procurement.enterpriseApp.Repository.PurchaseOrderRepo;
import com.procurement.enterpriseApp.Repository.SupplierRepo;
import com.procurement.enterpriseApp.Repository.UserRepo;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepo purchaseOrderRepo;
    @Autowired
    private SupplierRepo supplierRepo;
    
    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepo userRepo;
    
    @Value("${admin.email}")
    private String adminEmail;

    
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder) {

        Product product = productRepo.findById(
                purchaseOrder.getProduct().getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product Not Found"));

        Supplier supplier = supplierRepo.findById(
                purchaseOrder.getSupplier().getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier Not Found"));
        
        User user = userRepo.findById(purchaseOrder.getCreatedBy().getUserId())
            .orElseThrow(() ->
                new ResourceNotFoundException("User Not Found"));

        purchaseOrder.setCreatedBy(user);
        purchaseOrder.setProduct(product);
        purchaseOrder.setSupplier(supplier);
        
        
        purchaseOrder.setOrderDate(LocalDate.now());
        purchaseOrder.setStatus(PurchaseOrderStatus.CREATED);

        purchaseOrder.setTotalAmount(
                purchaseOrder.getQuantity() * product.getPricePerProduct());

        PurchaseOrder savedOrder = purchaseOrderRepo.save(purchaseOrder);

        String supplierEmail = supplier.getEmail();

        if (supplierEmail == null || supplierEmail.isBlank()) {
            throw new ResourceNotFoundException("Supplier email not found. Please update supplier email.");
        }
        emailService.sendPurchaseOrderCreatedEmail(
                savedOrder.getSupplier().getEmail(),
                savedOrder.getSupplier().getName(),
                savedOrder.getPurchaseOrderId(),
                savedOrder.getProduct().getName(),
                savedOrder.getQuantity(),
                savedOrder.getTotalAmount(),
                savedOrder.getOrderDate().toString(),
                savedOrder.getStatus().name()
        );
        return savedOrder;
    }

    
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepo.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));
    }

    
    public List<PurchaseOrder> getPurchaseOrdersBySupplier(Long supplierId) {
        return purchaseOrderRepo.findBySupplierSupplierId(supplierId);
    }

    
    public List<PurchaseOrder> getPurchaseOrdersByUser(Long userId) {
        return purchaseOrderRepo.findByCreatedByUserId(userId);
    }

    
   public PurchaseOrder updateStatus(Long id, PurchaseOrderStatus status) {

    PurchaseOrder order = purchaseOrderRepo.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Purchase Order Not Found"));

    PurchaseOrderStatus currentStatus = order.getStatus();

    boolean validTransition = false;

    if (currentStatus == PurchaseOrderStatus.CREATED
            && status == PurchaseOrderStatus.ACCEPTED) {

        validTransition = true;

    } else if (currentStatus == PurchaseOrderStatus.ACCEPTED
            && status == PurchaseOrderStatus.PACKED) {

        validTransition = true;

    } else if (currentStatus == PurchaseOrderStatus.PACKED
            && status == PurchaseOrderStatus.DISPATCHED) {

        validTransition = true;

    } else if (currentStatus == PurchaseOrderStatus.DISPATCHED
            && status == PurchaseOrderStatus.OUT_FOR_DELIVERY) {

        validTransition = true;

    } else if (currentStatus == PurchaseOrderStatus.OUT_FOR_DELIVERY
            && status == PurchaseOrderStatus.DELIVERED) {

        validTransition = true;
    }


    if (!validTransition) {

        throw new RuntimeException(
                "Invalid status transition from "
                + currentStatus
                + " to "
                + status
        );
    }

    if (status == PurchaseOrderStatus.DELIVERED
            && currentStatus != PurchaseOrderStatus.DELIVERED) {

        Product product = order.getProduct();

        if (product == null) {

            throw new ResourceNotFoundException(
                    "Product associated with Purchase Order not found"
            );
        }

        Integer currentQuantity =
                product.getNumberOfQuantities();

        Integer orderedQuantity =
                order.getQuantity();

        if (orderedQuantity == null || orderedQuantity <= 0) {

            throw new RuntimeException(
                    "Invalid purchase order quantity"
            );
        }

        if (currentQuantity == null) {
            currentQuantity = 0;
        }
        int newQuantity = currentQuantity - orderedQuantity;

        if (newQuantity < 0) {
            throw new RuntimeException(
                    "Insufficient product quantity"
            );
        }

        product.setNumberOfQuantities(newQuantity);

        productRepo.save(product);
    }


    order.setStatus(status);

    PurchaseOrder updatedOrder =
            purchaseOrderRepo.save(order);


    // =========================================================
    // EMAIL TO SUPPLIER
    // =========================================================

    if (updatedOrder.getSupplier() != null
            && updatedOrder.getSupplier().getEmail() != null) {

        emailService.sendPurchaseOrderStatusEmail(

                updatedOrder.getSupplier().getEmail(),

                updatedOrder.getSupplier().getName(),

                updatedOrder.getPurchaseOrderId(),

                updatedOrder.getProduct().getName(),

                updatedOrder.getQuantity(),

                updatedOrder.getStatus().name()
        );
    }


    // =========================================================
    // EMAIL TO USER
    // =========================================================

    if (updatedOrder.getCreatedBy() != null
            && updatedOrder.getCreatedBy().getEmail() != null) {

        emailService.sendPurchaseOrderStatusEmail(

                updatedOrder.getCreatedBy().getEmail(),

                updatedOrder.getCreatedBy().getName(),

                updatedOrder.getPurchaseOrderId(),

                updatedOrder.getProduct().getName(),

                updatedOrder.getQuantity(),

                updatedOrder.getStatus().name()
        );
    }


    // =========================================================
    // EMAIL TO ADMIN
    // =========================================================

    if (adminEmail != null && !adminEmail.isBlank()) {

        emailService.sendPurchaseOrderStatusEmail(

                adminEmail,

                "Admin",

                updatedOrder.getPurchaseOrderId(),

                updatedOrder.getProduct().getName(),

                updatedOrder.getQuantity(),

                updatedOrder.getStatus().name()
        );
    }


    return updatedOrder;
}
   
    public String deletePurchaseOrder(Long id) {

        PurchaseOrder order = purchaseOrderRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));

        purchaseOrderRepo.delete(order);

        return "Purchase Order Deleted Successfully";
    }

}
