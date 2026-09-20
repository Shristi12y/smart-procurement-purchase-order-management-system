package com.procurement.enterpriseApp.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.PurchaseOrder;
import com.procurement.enterpriseApp.Model.Rating;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Model.Enum.PurchaseOrderStatus;
import com.procurement.enterpriseApp.Repository.ProductRepo;
import com.procurement.enterpriseApp.Repository.PurchaseOrderRepo;
import com.procurement.enterpriseApp.Repository.RatingRepo;
import com.procurement.enterpriseApp.Repository.UserRepo;

@Service
public class RatingService {
	
	@Autowired
	private RatingRepo ratingRepo;
	
	@Autowired
	private ProductRepo productRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private PurchaseOrderRepo purchaseOrderRepo;
	
	@Autowired
	private EmailService emailService;
	@Value("${admin.email}")
	private String adminEmail;
	
	
	public Rating createRating(Rating rating) {

	    if (rating.getRating() == null || rating.getRating() < 1 || rating.getRating() > 5) {
	        throw new RuntimeException("Rating must be between 1 and 5");
	    }	

	    if (rating.getPurchaseOrder() == null || rating.getPurchaseOrder().getPurchaseOrderId() == null) {
	        throw new RuntimeException("Purchase Order is required");
	    }

	    Long purchaseOrderId = rating.getPurchaseOrder().getPurchaseOrderId();

	    PurchaseOrder purchaseOrder =purchaseOrderRepo.findById(purchaseOrderId)
	            .orElseThrow(() -> new ResourceNotFoundException("Purchase Order Not Found"));

	    if (purchaseOrder.getStatus() !=PurchaseOrderStatus.DELIVERED) {
	        throw new RuntimeException("Product can be rated only after delivery");
	    }

	    User user = purchaseOrder.getCreatedBy();
	    if (user == null) {
	        throw new RuntimeException("User not found for this Purchase Order");
	    }

	    Product product = purchaseOrder.getProduct();
	    if (product == null) {
	        throw new RuntimeException("Product not found for this Purchase Order");
	    }

	    // Preventing duplicate rating
	    if (ratingRepo.findByUserUserIdAndPurchaseOrderPurchaseOrderId(user.getUserId(),purchaseOrderId).isPresent()) {
	    		throw new RuntimeException("You have already rated this Purchase Order");
	    }

	    // Setting details
	    rating.setPurchaseOrder(purchaseOrder);
	    rating.setUser(user);
	    rating.setUserName(user.getName());
	    rating.setProduct(product);
	    rating.setProductName(product.getName());
	    rating.setRatingDate(LocalDateTime.now());

	    Rating savedRating = ratingRepo.save(rating);
	    if (purchaseOrder.getSupplier() != null &&
	            purchaseOrder.getSupplier().getEmail() != null) {

	        emailService.sendRatingNotificationEmail(
	                purchaseOrder.getSupplier().getEmail(),
	                purchaseOrder.getSupplier().getName(),
	                user.getName(),
	                purchaseOrder.getPurchaseOrderId(),
	                product.getName(),
	                savedRating.getRating(),
	                savedRating.getRemark()
	        );
	    }
	    
	    if (adminEmail != null && !adminEmail.isBlank()) {

	        emailService.sendRatingNotificationEmail(
	                adminEmail,
	                "Admin",
	                user.getName(),
	                purchaseOrder.getPurchaseOrderId(),
	                product.getName(),
	                savedRating.getRating(),
	                savedRating.getRemark()
	        );
	    }
	    
	    return savedRating;
	}

	
	public List<Rating> getAllRating(){
		return ratingRepo.findAll();
	}
	
	public Rating getRatingById(Long id) {
		return ratingRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Rating not found"));
	}
	
	public List<Rating> getRatingByProducts(Long productId){
		return ratingRepo.findByProductProductId(productId);
	}
	
	public List<Rating> getRatingByUser(Long userId){
		return ratingRepo.findByUserUserId(userId);
	}
	
	public List<Rating> getRatingByPurchaseOrder(Long purchaseOrderId){
		return ratingRepo.findByPurchaseOrderPurchaseOrderId(purchaseOrderId);
	}
	
	public String deleteRating(Long id) {
		Rating rating = ratingRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Rating not Found"));
		
		ratingRepo.delete(rating);
		
		return "Rating Deleted Successfully";
	}
	
	public Double getAverageRatingBySupplier(Long supplierId) {

	    Double average =
	            ratingRepo.findAverageRatingBySupplierId(supplierId);

	    if (average == null) {
	        return 0.0;
	    }

	    return Math.round(average * 10.0) / 10.0;
	}
	
	
}
