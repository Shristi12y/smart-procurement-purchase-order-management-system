package com.procurement.enterpriseApp.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Model.Payment;
import com.procurement.enterpriseApp.Repository.PaymentRepo;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PaymentReportService {

    @Autowired
    private PaymentRepo paymentRepo;

    public byte[] generatePaymentExcel() throws IOException {

        List<Payment> payments = paymentRepo.findAll();

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Payment Report");

        // Title
        Row titleRow = sheet.createRow(0);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("PAYMENT REPORT");

        // Title style
        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);

        titleCell.setCellStyle(titleStyle);

        // Headers
        String[] headers = {
                "Payment ID",
                "Amount",
                "Payment Date",
                "Payment Method",
                "Payment Status",
                "Remarks",
                "Transaction ID",
                "Purchase Order ID"
        };

        Row headerRow = sheet.createRow(2);

        CellStyle headerStyle = workbook.createCellStyle();
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerStyle.setFont(headerFont);

        for (int i = 0; i < headers.length; i++) {

            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Data
        int rowNumber = 3;

        for (Payment payment : payments) {

            Row row = sheet.createRow(rowNumber++);

            row.createCell(0).setCellValue(payment.getPaymentId());

            row.createCell(1).setCellValue(payment.getAmount());

            if (payment.getPaymentDate() != null) {
            	row.createCell(2).setCellValue(payment.getPaymentDate().toString());
            } else {
                row.createCell(2).setCellValue("");
            }

            if (payment.getPaymentMethod() != null) {
                row.createCell(3).setCellValue(payment.getPaymentMethod().toString());
            } else {
                row.createCell(3).setCellValue("");
            }

            if (payment.getPaymentStatus() != null) {
                row.createCell(4).setCellValue(payment.getPaymentStatus().toString());
            } else {
                row.createCell(4).setCellValue("");
            }

            row.createCell(5).setCellValue(payment.getRemarks() != null ? payment.getRemarks() : "");

            row.createCell(6).setCellValue(
                    payment.getTransactionId() != null ? payment.getTransactionId() : "");

            if (payment.getPurchaseOrder() != null) {
                row.createCell(7).setCellValue(payment.getPurchaseOrder().getPurchaseOrderId()
                );
            } else {
                row.createCell(7).setCellValue("");
            }
        }

        // Automatically adjust column widths
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Convert workbook to byte[]
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }
    
    
    public byte[] generatePaymentPdf() throws Exception {

        List<Payment> payments = paymentRepo.findAll();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4.rotate());

        PdfWriter.getInstance(document, outputStream);

        document.open();

        // Title
        com.lowagie.text.Font titleFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA_BOLD,
                        18
                );

        Paragraph title =
                new Paragraph("PAYMENT REPORT", titleFont);

        title.setAlignment(Element.ALIGN_CENTER);

        document.add(title);

        document.add(new Paragraph(" "));

        // Table with 8 columns
        PdfPTable table = new PdfPTable(8);

        table.setWidthPercentage(100);

        table.setWidths(new float[]{
                1.0f,
                1.3f,
                2.2f,
                1.5f,
                1.5f,
                2.5f,
                2.0f,
                1.5f
        });

        // Headers
        String[] headers = {
                "Payment ID",
                "Amount",
                "Payment Date",
                "Payment Method",
                "Payment Status",
                "Remarks",
                "Transaction ID",
                "Purchase Order ID"
        };

        com.lowagie.text.Font headerFont =FontFactory.getFont(FontFactory.HELVETICA_BOLD,8);

        for (String header : headers) {
        	PdfPCell cell = new PdfPCell( new Phrase(header, headerFont));

            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);

            table.addCell(cell);
        }

        // Data font
        com.lowagie.text.Font dataFont =
                FontFactory.getFont(
                        FontFactory.HELVETICA,
                        8
                );

        // Data
        for (Payment payment : payments) {

            // Payment ID
            addPdfCell(
                    table,
                    payment.getPaymentId() != null ? payment.getPaymentId().toString() : "", dataFont, Element.ALIGN_CENTER);

            // Amount
            addPdfCell(table,
                    payment.getAmount() != null ? String.format("%,.2f", payment.getAmount()) : "", dataFont, Element.ALIGN_RIGHT);

            // Payment Date
            addPdfCell(table,
                    payment.getPaymentDate() != null ? payment.getPaymentDate().toString() : "", dataFont, Element.ALIGN_CENTER);

            // Payment Method
            addPdfCell(table,
                    payment.getPaymentMethod() != null ? payment.getPaymentMethod().toString() : "", dataFont, Element.ALIGN_CENTER);

            // Payment Status
            addPdfCell(table,
                    payment.getPaymentStatus() != null ? payment.getPaymentStatus().toString() : "", dataFont, Element.ALIGN_CENTER );

            // Remarks
            addPdfCell(table, 
            		payment.getRemarks() != null? payment.getRemarks() : "",dataFont, Element.ALIGN_LEFT);

            // Transaction ID
            addPdfCell(table,
                    payment.getTransactionId() != null ? payment.getTransactionId() : "", dataFont,Element.ALIGN_CENTER);

            // Purchase Order ID
            String purchaseOrderId = "";

            if (payment.getPurchaseOrder() != null &&
                    payment.getPurchaseOrder().getPurchaseOrderId() != null) {

                purchaseOrderId = payment.getPurchaseOrder().getPurchaseOrderId().toString();
            }

            addPdfCell(table, purchaseOrderId, dataFont,Element.ALIGN_CENTER);
        }

        document.add(table);
        document.close();

        return outputStream.toByteArray();
    }
    
    private void addPdfCell(PdfPTable table, String value, com.lowagie.text.Font font, int alignment) {

        PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "", font));

        cell.setHorizontalAlignment(alignment);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setPadding(5);

        table.addCell(cell);
    }
}