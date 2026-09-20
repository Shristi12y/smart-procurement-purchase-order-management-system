package com.procurement.enterpriseApp.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Category;
import com.procurement.enterpriseApp.Model.Department;
import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.Supplier;
import com.procurement.enterpriseApp.Model.Enum.ProductStatus;
import com.procurement.enterpriseApp.Repository.CategoryRepo;
import com.procurement.enterpriseApp.Repository.DepartmentRepo;
import com.procurement.enterpriseApp.Repository.ProductRepo;
import com.procurement.enterpriseApp.Repository.SupplierRepo;

@Service
public class ProductService {
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private ProductRepo productRepo;
	
	@Autowired
	private DepartmentRepo departmentRepo;
	
	@Autowired
	private CategoryRepo categoryRepo;
		
	@Autowired
	private SupplierRepo supplierRepo;
	
	public Product addProduct(Product product) {

	    // Validate Supplier
	    if (product.getSupplier() == null ||
	            product.getSupplier().getSupplierId() == null) {

	        throw new RuntimeException(
	                "Supplier ID is required to add a product"
	        );
	    }

	    // Validate Department
	    if (product.getDepartment() == null ||
	            product.getDepartment().getDepartmentId() == null) {

	        throw new RuntimeException(
	                "Department ID is required to add a product"
	        );
	    }

	    // Validate Category
	    if (product.getCategory() == null ||
	            product.getCategory().getCategoryId() == null) {

	        throw new RuntimeException(
	                "Category ID is required to add a product"
	        );
	    }


	    // Get Supplier from database
	    Supplier supplier = supplierRepo
	            .findById(product.getSupplier().getSupplierId())
	            .orElseThrow(() ->
	                    new RuntimeException("Supplier Not Found")
	            );


	    // Get Department from database
	    Department department = departmentRepo
	            .findById(product.getDepartment().getDepartmentId())
	            .orElseThrow(() ->
	                    new RuntimeException("Department Not Found")
	            );


	    // Get Category from database
	    Category category = categoryRepo
	            .findById(product.getCategory().getCategoryId())
	            .orElseThrow(() ->
	                    new RuntimeException("Category Not Found")
	            );


	    // Set actual database entities
	    product.setSupplier(supplier);
	    product.setDepartment(department);
	    product.setCategory(category);


	    // Dates
	    product.setCreatedDate(LocalDateTime.now());
	    product.setUpdatedDate(LocalDateTime.now());


	    // Save Product
	    Product savedProduct = productRepo.save(product);


	    // Email
	    emailService.sendPurchaseRequestAdminEmail(

	            "proadminvishal@gmail.com",

	            savedProduct.getName(),

	            savedProduct.getSupplier() != null
	                    ? savedProduct.getSupplier().getName()
	                    : "N/A",

	            savedProduct.getDepartment() != null
	                    ? savedProduct.getDepartment().getDepartmentName()
	                    : "N/A",

	            savedProduct.getNumberOfQuantities(),

	            savedProduct.getPricePerProduct()
	    );


	    return savedProduct;
	}
	
	public List<Product> getAllProducts(){
		return productRepo.findAll();
	}
	
	public Product getProductById(Long id) {
		return productRepo.findById(id).orElseThrow(() ->
	                        new ResourceNotFoundException("Department not found with id : " + id));
	    
	}
	
	
	
	public Product updateProduct(Long id, Product updatedProduct) {

        Product existingProduct = productRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not Found"));

        if (existingProduct == null) {
            return null;
        }

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPricePerProduct(updatedProduct.getPricePerProduct());
        existingProduct.setNumberOfQuantities(updatedProduct.getNumberOfQuantities());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStatus(updatedProduct.getStatus());
        
        //existingProduct.setDepartment(updatedProduct.getDepartment());
        if (updatedProduct.getDepartment() != null &&
        		updatedProduct.getDepartment().getDepartmentId() != null) {

                Department department = departmentRepo.findById(
                		updatedProduct.getDepartment().getDepartmentId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException("Department Not Found"));

                existingProduct.setDepartment(department);
            }
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setSupplier(updatedProduct.getSupplier());
        existingProduct.setUpdatedDate(LocalDateTime.now());

        return productRepo.save(existingProduct);
    }
	
	public String deleteProduct(Long id) {

	    Product product = productRepo.findById(id)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Product Not Found"));

	    try {

	        // Try permanent deletion first
	        productRepo.delete(product);

	        // Force Hibernate to execute the DELETE immediately
	        productRepo.flush();

	        return "Product Deleted Successfully";

	    } catch (org.springframework.dao.DataIntegrityViolationException e) {

	        // Product is referenced by another table
	        // Example: approval_request.product_id

	        product.setStatus(ProductStatus.CLOSED);
	        product.setUpdatedDate(LocalDateTime.now());

	        productRepo.save(product);

	        return "Product has existing records and was marked as INACTIVE instead.";

	    }
	}
	
	
	public List<Product> getProductByDepartment(Long departmentId) {
	    List<Product> products = productRepo.findByDepartmentDepartmentId(departmentId);
	    if (products.isEmpty()) {
	        throw new ResourceNotFoundException("No Products Found For This Department");
	    }
	    return products;
	}
	
	
	public List<Product> getProductByCategory(Long categoryId) {
	    List<Product> products = productRepo.findByCategoryCategoryId(categoryId);
	    if (products.isEmpty()) {
	        throw new ResourceNotFoundException("No Products Found For This Category");
	    }
	    return products;
	}
	
	
	public List<Product> getProductBySupplier(Long supplierId) {

	    List<Product> products =
	            productRepo.findBySupplierSupplierId(supplierId);

	    if (products.isEmpty()) {

	        throw new ResourceNotFoundException(
	                "No Products Found For This Supplier"
	        );
	    }

	    return products;
	}
	
	
	public List<Product> getProductByStatus(ProductStatus status) {
	    List<Product> products = productRepo.findByStatus(status);
	    if (products.isEmpty()) {
	        throw new ResourceNotFoundException("No Products Found With Status : " + status);
	    }
	    return products;
	}
}
