package com.procurement.enterpriseApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.Enum.ProductStatus;
import com.procurement.enterpriseApp.Service.ProductService;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {

	
	@Autowired
	private ProductService productService;
	
	
	@PostMapping
	public ResponseEntity<Product> addProduct(@RequestBody Product product){
		Product savedProduct = productService.addProduct(product);
		
		return new ResponseEntity<>(savedProduct,HttpStatus.CREATED);
	}
	
	@GetMapping
	public List<Product> getAllProduct(){
		return productService.getAllProducts();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable Long id){
		Product product = productService.getProductById(id);
		
		if(product == null) {
			return ResponseEntity.notFound().build();
		}
		
		return ResponseEntity.ok(product);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> updateProduct(@PathVariable Long id,@RequestBody Product product){
		
		Product updatedproduct = productService.updateProduct(id, product);
		
		if(updatedproduct == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product Not Found");
		}
		
		return ResponseEntity.ok(updatedproduct);
	}
	
	@DeleteMapping("/{Id}")
	public ResponseEntity<String> deleteProduct(@PathVariable Long Id){
		productService.deleteProduct(Id);
		
		return ResponseEntity.ok("Product Deleted Successfully");
	}
	
	
    @GetMapping("/department/{departmentId}")
    public List<Product> getProductsByDepartment(@PathVariable Long departmentId) {

        return productService.getProductByDepartment(departmentId);
    }

    
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {

        return productService.getProductByCategory(categoryId);
    }

    
    @GetMapping("/supplier/{supplierId}")
    public List<Product> getProductsBySupplier(
            @PathVariable Long supplierId) {

        return productService.getProductBySupplier(supplierId);
    }

    // Get Products By Status
    @GetMapping("/status/{status}")
    public List<Product> getProductsByStatus(@PathVariable ProductStatus status) {

        return productService.getProductByStatus(status);
    }
    
}
