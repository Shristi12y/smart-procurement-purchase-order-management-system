package com.procurement.enterpriseApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.procurement.enterpriseApp.Model.Rating;

@Repository
public interface RatingRepo extends JpaRepository<Rating, Long> {

	Optional<Rating> findByUserUserIdAndPurchaseOrderPurchaseOrderId(Long userId, Long purchaseOrderId);
	
	List<Rating> findByProductProductId(Long productId);
	List<Rating> findByUserUserId(Long userId);
	List<Rating> findByPurchaseOrderPurchaseOrderId(Long purchaseOrderId);
	
	@Query("""
	        SELECT AVG(r.rating)
	        FROM Rating r
	        WHERE r.product.supplier.supplierId = :supplierId
	    """)
	    Double findAverageRatingBySupplierId(
	            @Param("supplierId") Long supplierId
	    );
}
