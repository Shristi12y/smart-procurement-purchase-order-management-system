package com.procurement.enterpriseApp.Model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.procurement.enterpriseApp.Model.Enum.PurchaseOrderStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "purchase_order")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchase_order_id")
    private Long purchaseOrderId;

    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

   // @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

   // @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private Integer quantity;

    private Double totalAmount;

    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    private PurchaseOrderStatus status;

	public Long getPurchaseOrderId() {
		return purchaseOrderId;
	}

	public void setPurchaseOrderId(Long purchaseOrderId) {
		this.purchaseOrderId = purchaseOrderId;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public Supplier getSupplier() {
		return supplier;
	}

	public void setSupplier(Supplier supplier) {
		this.supplier = supplier;
	}

	public User getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public LocalDate getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDate orderDate) {
		this.orderDate = orderDate;
	}

	public PurchaseOrderStatus getStatus() {
		return status;
	}

	public void setStatus(PurchaseOrderStatus status) {
		this.status = status;
	}

	public PurchaseOrder(Long purchaseOrderId, Product product, Supplier supplier, User createdBy, Integer quantity,
			Double totalAmount, LocalDate orderDate, PurchaseOrderStatus status) {
		super();
		this.purchaseOrderId = purchaseOrderId;
		this.product = product;
		this.supplier = supplier;
		this.createdBy = createdBy;
		this.quantity = quantity;
		this.totalAmount = totalAmount;
		this.orderDate = orderDate;
		this.status = status;
	}
    
	public PurchaseOrder() {
		
	}
    
}
