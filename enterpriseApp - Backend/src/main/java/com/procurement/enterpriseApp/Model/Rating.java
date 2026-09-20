package com.procurement.enterpriseApp.Model;

import jakarta.persistence.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "rating")
public class Rating {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

	@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private String productName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String userName;

    
    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    private Integer rating;

    private String remark;

    private LocalDateTime ratingDate;

	public Long getRatingId() {
		return ratingId;
	}

	public void setRatingId(Long ratingId) {
		this.ratingId = ratingId;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public PurchaseOrder getPurchaseOrder() {
		return purchaseOrder;
	}

	public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
		this.purchaseOrder = purchaseOrder;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public LocalDateTime getRatingDate() {
		return ratingDate;
	}

	public void setRatingDate(LocalDateTime ratingDate) {
		this.ratingDate = ratingDate;
	}

	public Rating(Long ratingId, Product product, String productName, User user, String userName,
			PurchaseOrder purchaseOrder, Integer rating, String remark, LocalDateTime ratingDate) {
		super();
		this.ratingId = ratingId;
		this.product = product;
		this.productName = productName;
		this.user = user;
		this.userName = userName;
		this.purchaseOrder = purchaseOrder;
		this.rating = rating;
		this.remark = remark;
		this.ratingDate = ratingDate;
	}
    
    public Rating() {
    	
    }
	
}
