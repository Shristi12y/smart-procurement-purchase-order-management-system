package com.procurement.enterpriseApp.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.procurement.enterpriseApp.Model.PurchaseOrder;
import com.procurement.enterpriseApp.Model.Enum.PurchaseOrderStatus;
import com.procurement.enterpriseApp.Service.PurchaseOrderService;

@RestController
@RequestMapping("/purchaseOrders")
@CrossOrigin(origins = "http://localhost:4200")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    
    @PostMapping
    public PurchaseOrder createPurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.createPurchaseOrder(purchaseOrder);
    }

    
    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    
    @GetMapping("/{id}")
    public PurchaseOrder getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id);
    }

    
    @GetMapping("/supplier/{supplierId}")
    public List<PurchaseOrder> getPurchaseOrdersBySupplier(@PathVariable Long supplierId) {
        return purchaseOrderService.getPurchaseOrdersBySupplier(supplierId);
    }

    
    @GetMapping("/user/{userId}")
    public List<PurchaseOrder> getPurchaseOrdersByUser(@PathVariable Long userId) {
        return purchaseOrderService.getPurchaseOrdersByUser(userId);
    }

    
    @PutMapping("/{id}/status")
    public PurchaseOrder updateStatus(@PathVariable Long id,
                                      @RequestParam PurchaseOrderStatus status) {

        return purchaseOrderService.updateStatus(id, status);
    }

    
    @DeleteMapping("/{id}")
    public String deletePurchaseOrder(@PathVariable Long id) {
        return purchaseOrderService.deletePurchaseOrder(id);
    }
}
