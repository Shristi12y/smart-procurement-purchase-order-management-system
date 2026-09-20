package com.procurement.enterpriseApp.Service;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String htmlContent) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper =new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {

            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    public String loadTemplate(String fileName) {

        try {
            ClassPathResource resource = new ClassPathResource("templates/" + fileName);

            return new String(resource.getInputStream().readAllBytes(),StandardCharsets.UTF_8
            );
        } catch (Exception e) {

            throw new RuntimeException("Unable to load email template: " + fileName);
        }
    }

    public void sendPaymentSuccessEmail(
            String supplierEmail,
            String supplierName,
            Long purchaseOrderId,
            String productName,
            Integer quantity,
            Double amount,
            String transactionId,
            String userName,
            String userEmail) {

        try {
            String html = loadTemplate("payment-success.html");
            html = html.replace("{{SUPPLIER_NAME}}",supplierName);

            html = html.replace("{{PURCHASE_ORDER_ID}}",String.valueOf(purchaseOrderId));

            html = html.replace("{{PRODUCT_NAME}}",productName);

            html = html.replace( "{{QUANTITY}}",String.valueOf(quantity));

            html = html.replace( "{{AMOUNT}}", String.format("%.2f", amount));

            html = html.replace("{{TRANSACTION_ID}}",transactionId);

            html = html.replace("{{USER_NAME}}",userName);

            html = html.replace("{{USER_EMAIL}}", userEmail);


            sendEmail(supplierEmail,"Payment Confirmed - Order Ready to Ship",html);

        } catch (Exception e) {

            throw new RuntimeException("Failed to send payment success email: "+ e.getMessage());
        }
    }
    
    public void sendUserRegistrationEmail(
            String email,
            String name,
            String department,
            String designation) {

        String html = loadTemplate("user-registration.html");

        html = html.replace("{{USER_NAME}}", name);
        html = html.replace("{{USER_EMAIL}}", email);
        html = html.replace("{{DEPARTMENT}}",
                department != null ? department : "N/A");
        html = html.replace("{{DESIGNATION}}",
                designation != null ? designation : "N/A");

        sendEmail(
                email,
                "Welcome to Enterprise Procurement System",
                html
        );
    }
    
    public void sendPurchaseRequestAdminEmail(
            String adminEmail,
            String productName,
            String requestedBy,
            String department,
            Integer quantity,
            Double price) {

        String html = loadTemplate("purchase-request-admin.html");

        html = html.replace("{{PRODUCT_NAME}}",productName != null ? productName : "N/A");

        html = html.replace("{{REQUESTED_BY}}",requestedBy != null ? requestedBy : "N/A");

        html = html.replace("{{DEPARTMENT}}",department != null ? department : "N/A");

        html = html.replace("{{QUANTITY}}",quantity != null ? quantity.toString() : "N/A");

        html = html.replace("{{PRICE}}",price != null ? price.toString() : "N/A");

        sendEmail(adminEmail,"New Purchase Request",html);
    }
    
    public void sendApprovalStatusEmail(
            String userEmail,
            String userName,
            String productName,
            String status,
            String remarks,
            String actionDate) {

        String html = loadTemplate("approval-status.html");

        html = html.replace("{{USER_NAME}}",userName != null ? userName : "User");

        html = html.replace("{{PRODUCT_NAME}}",productName != null ? productName : "N/A");

        html = html.replace("{{STATUS}}",status != null ? status : "N/A");

        html = html.replace("{{REMARKS}}",remarks != null ? remarks : "N/A");

        html = html.replace("{{ACTION_DATE}}",actionDate != null ? actionDate : "N/A");

        sendEmail(userEmail,"Approval Request - " + status, html);
    }
    
    public void sendPurchaseOrderCreatedEmail(
            String supplierEmail,
            String supplierName,
            Long purchaseOrderId,
            String productName,
            Integer quantity,
            Double totalAmount,
            String orderDate,
            String status) {

        String html = loadTemplate("purchase-order-created.html");

        html = html.replace("{{SUPPLIER_NAME}}",supplierName != null ? supplierName : "Supplier");

        html = html.replace("{{PURCHASE_ORDER_ID}}",purchaseOrderId != null ? purchaseOrderId.toString() : "N/A");

        html = html.replace("{{PRODUCT_NAME}}",productName != null ? productName : "N/A");

        html = html.replace("{{QUANTITY}}",quantity != null ? quantity.toString() : "N/A");

        html = html.replace("{{TOTAL_AMOUNT}}",totalAmount != null ? totalAmount.toString() : "N/A");

        html = html.replace("{{ORDER_DATE}}",orderDate != null ? orderDate : "N/A");

        html = html.replace("{{STATUS}}",status != null ? status : "N/A");
        
        sendEmail(supplierEmail,"Purchase Order Created",html);
    }
    
    public void sendPurchaseOrderStatusEmail(
            String recipientEmail,
            String recipientName,
            Long purchaseOrderId,
            String productName,
            Integer quantity,
            String status) {

        String html = loadTemplate("purchase-order-status.html");

        html = html.replace("{{RECIPIENT_NAME}}",recipientName != null ? recipientName : "User");

        html = html.replace("{{PURCHASE_ORDER_ID}}",purchaseOrderId != null ? purchaseOrderId.toString(): "N/A");

        html = html.replace("{{PRODUCT_NAME}}",productName != null ? productName : "N/A");

        html = html.replace("{{QUANTITY}}",quantity != null ? quantity.toString(): "N/A");

        html = html.replace("{{STATUS}}",status != null ? status : "N/A");

        sendEmail(recipientEmail,"Purchase Order Status Updated",html);
    }
    
    public void sendRatingNotificationEmail(
            String recipientEmail,
            String recipientName,
            String userName,
            Long purchaseOrderId,
            String productName,
            Integer rating,
            String remark) {

        String html = loadTemplate("rating-notification.html");
        html = html.replace("{{RECIPIENT_NAME}}",recipientName != null ? recipientName : "User");
        html = html.replace( "{{USER_NAME}}", userName != null ? userName : "N/A");
        html = html.replace("{{PURCHASE_ORDER_ID}}",purchaseOrderId != null ? purchaseOrderId.toString() : "N/A");
        html = html.replace("{{PRODUCT_NAME}}", productName != null ? productName : "N/A");
        html = html.replace("{{RATING}}", rating != null ? rating.toString() : "N/A");
        html = html.replace( "{{REMARK}}", remark != null ? remark : "No remark provided");
        
        sendEmail(recipientEmail,"New Product Rating Received", html);
    }
}