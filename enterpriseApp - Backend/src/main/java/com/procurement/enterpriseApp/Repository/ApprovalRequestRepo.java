package com.procurement.enterpriseApp.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.procurement.enterpriseApp.Model.ApprovalRequest;
import com.procurement.enterpriseApp.Model.Enum.ApprovalStatus;

public interface ApprovalRequestRepo extends JpaRepository<ApprovalRequest, Long>{
	List<ApprovalRequest> findByProductProductId(Long productId);
	
	Optional<ApprovalRequest> findByProductProductIdAndStatus(
	        Long productId, ApprovalStatus status);
}
