package com.procurement.enterpriseApp.Controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.procurement.enterpriseApp.Model.Payment;
import com.procurement.enterpriseApp.Model.Enum.PaymentStatus;
import com.procurement.enterpriseApp.Service.PaymentReportService;
import com.procurement.enterpriseApp.Service.PaymentService;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private PaymentReportService paymentReportService;

    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.createPayment(payment);
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    @GetMapping("/purchaseOrder/{purchaseOrderId}")
    public Payment getPaymentByPurchaseOrder(@PathVariable Long purchaseOrderId) {

        return paymentService.getPaymentByPurchaseOrder(purchaseOrderId);
    }

    @GetMapping("/status/{status}")
    public List<Payment> getPaymentsByStatus(@PathVariable PaymentStatus status) {

        return paymentService.getPaymentsByStatus(status);
    }

    @PutMapping("/{id}/status")
    public Payment updatePaymentStatus(@PathVariable Long id, @RequestParam PaymentStatus status) {

        return paymentService.updatePaymentStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deletePayment(@PathVariable Long id) {
        return paymentService.deletePayment(id);
    }
    
    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportPaymentExcel() throws IOException {

        byte[] excelFile = paymentReportService.generatePaymentExcel();

        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=payment_report.xlsx")
                .header(HttpHeaders.CONTENT_TYPE,"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(excelFile);
    }
    
    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPaymentPdf() throws Exception {

        byte[] pdfFile = paymentReportService.generatePaymentPdf();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=payment_report.pdf"
                )
                .header(
                        HttpHeaders.CONTENT_TYPE,
                        "application/pdf"
                )
                .body(pdfFile);
    }
    
    @GetMapping("/supplier/{supplierId}")
    public List<Payment> getPaymentsBySupplier(
            @PathVariable Long supplierId) {

        return paymentService.getPaymentsBySupplier(supplierId);
    }

}