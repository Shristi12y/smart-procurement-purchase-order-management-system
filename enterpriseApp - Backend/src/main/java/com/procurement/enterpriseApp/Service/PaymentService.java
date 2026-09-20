package com.procurement.enterpriseApp.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Payment;
import com.procurement.enterpriseApp.Model.PurchaseOrder;
import com.procurement.enterpriseApp.Model.Enum.PaymentStatus;
import com.procurement.enterpriseApp.Model.Enum.PurchaseOrderStatus;
import com.procurement.enterpriseApp.Repository.PaymentRepo;
import com.procurement.enterpriseApp.Repository.PurchaseOrderRepo;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private PurchaseOrderRepo purchaseOrderRepo;

    @Autowired
    private EmailService emailService;

    public Payment createPayment(Payment payment) {

        if (payment.getPurchaseOrder() == null ||
                payment.getPurchaseOrder().getPurchaseOrderId() == null) {

            throw new RuntimeException("Purchase Order is required");
        }

        Long purchaseOrderId =
                payment.getPurchaseOrder().getPurchaseOrderId();

        PurchaseOrder purchaseOrder =
                purchaseOrderRepo.findById(purchaseOrderId)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Purchase Order not found with id : "
                                        + purchaseOrderId
                        )
                );

        if (purchaseOrder.getStatus() != PurchaseOrderStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Payment can only be made for an ACCEPTED Purchase Order"
            );
        }

        if (paymentRepo
                .findByPurchaseOrderPurchaseOrderId(purchaseOrderId)
                .isPresent()) {

            throw new RuntimeException(
                    "Payment already exists for this Purchase Order"
            );
        }

        if (payment.getPaymentMethod() == null) {

            throw new RuntimeException(
                    "Payment method is required"
            );
        }

        payment.setPurchaseOrder(purchaseOrder);

        payment.setAmount(
                purchaseOrder.getTotalAmount()
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );

        payment.setTransactionId(
                "TXN-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        payment.setPaymentStatus(
                PaymentStatus.SUCCESS
        );

        Payment savedPayment =
                paymentRepo.save(payment);

        sendPaymentSuccessEmails(
                savedPayment,
                purchaseOrder
        );


        return savedPayment;
    }

    private void sendPaymentSuccessEmails(
            Payment payment,
            PurchaseOrder purchaseOrder) {


        // -----------------------------------------
        // Email to Requester
        // -----------------------------------------

        if (purchaseOrder.getCreatedBy() != null &&
                purchaseOrder.getCreatedBy().getEmail() != null) {

            emailService.sendPaymentSuccessEmail(

                    purchaseOrder.getCreatedBy().getEmail(),

                    purchaseOrder.getCreatedBy().getName(),

                    purchaseOrder.getPurchaseOrderId(),

                    purchaseOrder.getProduct() != null
                            ? purchaseOrder.getProduct().getName()
                            : "N/A",

                    purchaseOrder.getQuantity(),

                    payment.getAmount(),

                    payment.getTransactionId(),

                    purchaseOrder.getCreatedBy().getName(),

                    purchaseOrder.getCreatedBy().getEmail()
            );
        }

        if (purchaseOrder.getSupplier() != null &&
                purchaseOrder.getSupplier().getEmail() != null) {

            emailService.sendPaymentSuccessEmail(

                    purchaseOrder.getSupplier().getEmail(),

                    purchaseOrder.getSupplier().getName(),

                    purchaseOrder.getPurchaseOrderId(),

                    purchaseOrder.getProduct() != null
                            ? purchaseOrder.getProduct().getName()
                            : "N/A",

                    purchaseOrder.getQuantity(),

                    payment.getAmount(),

                    payment.getTransactionId(),

                    purchaseOrder.getCreatedBy() != null
                            ? purchaseOrder.getCreatedBy().getName()
                            : "N/A",

                    purchaseOrder.getCreatedBy() != null
                            ? purchaseOrder.getCreatedBy().getEmail()
                            : "N/A"
            );
        }
    }

    public List<Payment> getAllPayments() {

        return paymentRepo.findAll();
    }

    public Payment getPaymentById(Long id) {

        return paymentRepo.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment Not Found"
                        )
                );
    }

    public Payment getPaymentByPurchaseOrder(
            Long purchaseOrderId) {

        return paymentRepo
                .findByPurchaseOrderPurchaseOrderId(
                        purchaseOrderId
                )

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment Not Found for this Purchase Order"
                        )
                );
    }

    public List<Payment> getPaymentsByStatus(
            PaymentStatus status) {

        return paymentRepo.findByPaymentStatus(status);
    }



    public Payment updatePaymentStatus(
            Long id,
            PaymentStatus status) {

        Payment payment =
                paymentRepo.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment Not Found"
                        )
                );


        payment.setPaymentStatus(status);


        Payment savedPayment =
                paymentRepo.save(payment);

        if (status == PaymentStatus.SUCCESS) {

            sendPaymentSuccessEmails(
                    savedPayment,
                    payment.getPurchaseOrder()
            );
        }


        return savedPayment;
    }



    public String deletePayment(Long id) {

        Payment payment =
                paymentRepo.findById(id)

                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment Not Found"
                        )
                );


        paymentRepo.delete(payment);


        return "Payment Deleted Successfully";
    }
    
    public List<Payment> getPaymentsBySupplier(Long supplierId) {

        return paymentRepo.findByPurchaseOrderSupplierSupplierId(supplierId);

    }
}

