package com.procurement.enterpriseApp.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.procurement.enterpriseApp.Model.Enum.ProductStatus;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;


@Entity
//@Data
//@AllArgsConstructor
@Table(name ="Product")
public class Product {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    @Column(name = "price_per_product")
    private Double pricePerProduct;

    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "number_of_quantities")
    private Integer numberOfQuantities;

   // @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    public void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedDate = LocalDateTime.now();
    }

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Supplier getSupplier() {
		return supplier;
	}

	public void setSupplier(Supplier supplier) {
		this.supplier = supplier;
	}

	public Double getPricePerProduct() {
		return pricePerProduct;
	}

	public void setPricePerProduct(Double pricePerProduct) {
		this.pricePerProduct = pricePerProduct;
	}

	public Integer getNumberOfQuantities() {
		return numberOfQuantities;
	}

	public void setNumberOfQuantities(Integer numberOfQuantities) {
		this.numberOfQuantities = numberOfQuantities;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public ProductStatus getStatus() {
		return status;
	}

	public void setStatus(ProductStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDateTime createdDate) {
		this.createdDate = createdDate;
	}

	public LocalDateTime getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(LocalDateTime updatedDate) {
		this.updatedDate = updatedDate;
	}

    public Product(Long productId, @NotBlank(message = "Product name is required") String name, Supplier supplier,
			@NotNull(message = "Price is required") @Min(value = 1, message = "Price must be greater than 0") Double pricePerProduct,
			@Min(value = 1, message = "Quantity must be at least 1") Integer numberOfQuantities, Department department,
			Category category, String description, ProductStatus status, LocalDateTime createdDate,
			LocalDateTime updatedDate) {
		super();
		this.productId = productId;
		this.name = name;
		this.supplier = supplier;
		this.pricePerProduct = pricePerProduct;
		this.numberOfQuantities = numberOfQuantities;
		this.department = department;
		this.category = category;
		this.description = description;
		this.status = status;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	public Product() {
    	
    }
	
}
