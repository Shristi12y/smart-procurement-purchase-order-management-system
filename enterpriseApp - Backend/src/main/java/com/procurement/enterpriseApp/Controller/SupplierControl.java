package com.procurement.enterpriseApp.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.procurement.enterpriseApp.Model.Supplier;
import com.procurement.enterpriseApp.Service.SupplierService;

@RestController
@RequestMapping("/suppliers")
@CrossOrigin(origins = "http://localhost:4200")
public class SupplierControl {
	
	@Autowired
	private SupplierService supplierService;
	
	
	@PostMapping
	public Supplier addSupplier(@RequestBody Supplier supplier) {
		return supplierService.addSupplier(supplier);
	}
	
	@GetMapping
	public List<Supplier> getAllSuppliers(){
		return supplierService.getAllSupplier();
	}
	
	
	@GetMapping("/{supplierId}")
	public Supplier getSupplierbyid(@PathVariable Long supplierId) {
		return supplierService.getSupplierById(supplierId);
	}
	
	
	@PutMapping("/{supplierId}")
    public Supplier updateSupplier(@PathVariable Long supplierId,
                                   @RequestBody Supplier supplier) {
        return supplierService.updateSupplier(supplierId, supplier);
    }

    @DeleteMapping("/{supplierId}")
    public String deleteSupplier(@PathVariable Long supplierId) {
        supplierService.deleteSupplier(supplierId);
        return "Supplier deleted successfully.";
    }

    @GetMapping("/product/{productId}")
    public List<Supplier> getSupplierByProductId(@PathVariable Long productId) {
        return supplierService.getSupplierByProductId(productId);
    }
    
    @PostMapping("/login")
    public Map<String, Object> loginSupplier(
            @RequestBody Supplier supplier) {

        Supplier loggedInSupplier =
                supplierService.loginSupplier(
                        supplier.getEmail(),
                        supplier.getPassword()
                );

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login Successful");
        response.put("role", "SUPPLIER");
        response.put("supplierId", loggedInSupplier.getSupplierId());
        response.put("name", loggedInSupplier.getName());

        return response;
    }
}
