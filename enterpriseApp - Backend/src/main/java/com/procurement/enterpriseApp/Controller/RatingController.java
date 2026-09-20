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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurement.enterpriseApp.Model.Rating;
import com.procurement.enterpriseApp.Service.RatingService;

@RestController
@RequestMapping("/rating")
@CrossOrigin(origins = "http://localhost:4200")
public class RatingController {
	
	@Autowired
	private RatingService ratingService;
	
	@PostMapping
	public ResponseEntity<Rating> createRating( @RequestBody Rating reating){
		return new ResponseEntity<>(ratingService.createRating(reating),HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<Rating>> getAllRating(){
		return ResponseEntity.ok(ratingService.getAllRating());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Rating> getRatingById(@PathVariable Long id){
		return ResponseEntity.ok(ratingService.getRatingById(id));
	}
	
	@GetMapping("/product/{productId}")
	public ResponseEntity<List<Rating>> getRatingByProduct(@PathVariable Long productId){
		return ResponseEntity.ok(ratingService.getRatingByProducts(productId));
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Rating>> getRatingsByUSer(@PathVariable Long userId){
		return ResponseEntity.ok(ratingService.getRatingByUser(userId));
	}
	
	@GetMapping("/purchaseOrder/{purchaseOrderId}")
	public ResponseEntity<List<Rating>> getRatingsByPurchaseOrder(@PathVariable Long purchaseOrderId){
		return ResponseEntity.ok(ratingService.getRatingByPurchaseOrder(purchaseOrderId));
	}
	
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteRating(@PathVariable Long id){
		return ResponseEntity.ok(ratingService.deleteRating(id));
	}
	
	@GetMapping("/supplier/{supplierId}/average")
	public ResponseEntity<Double> getAverageRatingBySupplier(
	        @PathVariable Long supplierId) {

	    return ResponseEntity.ok(
	            ratingService.getAverageRatingBySupplier(supplierId)
	    );
	}
}
