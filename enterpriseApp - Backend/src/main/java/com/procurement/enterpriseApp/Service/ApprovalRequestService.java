package com.procurement.enterpriseApp.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.DTO.ApprovalActionRequest;
import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.ApprovalHierarchy;
import com.procurement.enterpriseApp.Model.ApprovalRequest;
import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.Supplier;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Model.Enum.ApprovalStatus;
import com.procurement.enterpriseApp.Repository.ApprovalHierarchyRepo;
import com.procurement.enterpriseApp.Repository.ApprovalRequestRepo;
import com.procurement.enterpriseApp.Repository.ProductRepo;
import com.procurement.enterpriseApp.Repository.SupplierRepo;
import com.procurement.enterpriseApp.Repository.UserRepo;

@Service
public class ApprovalRequestService {
	
	@Autowired
	private ApprovalRequestRepo approvalRequestRepo;
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private ProductRepo productRepo;
	
	@Autowired
	private ApprovalHierarchyRepo approvalHierarchyRepo;
	
	@Autowired
	private EmailService emailService;
	
	
	public ApprovalRequest addApprovalRequest(ApprovalRequest approvalRequest) {
		
		 Product product = productRepo.findById(
		            approvalRequest.getProduct().getProductId()
		    ).orElseThrow(() ->
		            new ResourceNotFoundException("Product not found")
		    );

		    ApprovalHierarchy hierarchy =
		            approvalHierarchyRepo.findById(
		                    approvalRequest
		                            .getApprovalHierarchy()
		                            .getApprovalHierarchyId()
		            ).orElseThrow(() ->
		                    new ResourceNotFoundException(
		                            "Approval hierarchy not found"
		                    )
		            );

		    User approvedBy = userRepo.findById(
		            approvalRequest
		                    .getApprovedBy()
		                    .getUserId()
		    ).orElseThrow(() ->
		            new ResourceNotFoundException("User not found")
		    );

		    approvalRequest.setProduct(product);

		    approvalRequest.setApprovalHierarchy(hierarchy);

		    approvalRequest.setApprovedBy(approvedBy);

		    approvalRequest.setStatus(ApprovalStatus.PENDING);

		    approvalRequest.setActionDate(LocalDateTime.now());

		    return approvalRequestRepo.save(approvalRequest);
	}
	
	
	public List<ApprovalRequest> getAllApprovalrequest(){
		return approvalRequestRepo.findAll();
	}
	
	
	public ApprovalRequest getApprovalRequestById(Long Id) {
		return approvalRequestRepo.findById(Id).orElseThrow(() -> new ResourceNotFoundException("Approval Request notFound"));
	}
	
	
	public List<ApprovalRequest> getApprovalRequestByProduct(Long productId){
		return approvalRequestRepo.findByProductProductId(productId);
	}
	
	
	public String deleteApprovalRequest(Long id) {
		
		ApprovalRequest request = approvalRequestRepo.findById(id).orElseThrow(() -> new RuntimeException("Approval Request not Found"));
		
		approvalRequestRepo.delete(request);
		
		return "Approval Request Deleted Successfully";
	}
	
	
	public ApprovalRequest approveRequest(
        Long requestId,
        ApprovalActionRequest request) {

    ApprovalRequest approvalRequest =
            approvalRequestRepo.findById(requestId)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Approval Request Not Found"
                    )
            );

    User approver =
            userRepo.findById(
                    request.getApprovedByUserId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Approver Not Found"
                    )
            );

    // Fetch the product again
    Product product =
            productRepo.findById(
                    approvalRequest
                            .getProduct()
                            .getProductId()
            ).orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Product Not Found"
                    )
            );

    approvalRequest.setProduct(product);

    approvalRequest.setApprovedBy(approver);

    approvalRequest.setRemarks(
            request.getRemarks()
    );

    approvalRequest.setStatus(
            ApprovalStatus.APPROVED
    );

    approvalRequest.setActionDate(
            LocalDateTime.now()
    );

    ApprovalRequest savedRequest =
            approvalRequestRepo.save(
                    approvalRequest
            );

    // Get supplier from product
    Supplier supplier =
            product.getSupplier();

    if (supplier != null &&
            supplier.getEmail() != null) {

        emailService.sendApprovalStatusEmail(

                supplier.getEmail(),

                supplier.getName(),

                product.getName(),

                savedRequest
                        .getStatus()
                        .name(),

                savedRequest.getRemarks(),

                savedRequest
                        .getActionDate()
                        .toString()
        );
    }

    return savedRequest;
}
	
	
	public ApprovalRequest rejectRequest(Long requestId,
            ApprovalActionRequest request) {

		ApprovalRequest approvalRequest = approvalRequestRepo.findById(requestId)
				.orElseThrow(() -> new ResourceNotFoundException("Approval Request Not Found"));

		User approver = userRepo.findById(request.getApprovedByUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Approver Not Found"));

		approvalRequest.setApprovedBy(approver);
		approvalRequest.setRemarks(request.getRemarks());
		approvalRequest.setStatus(ApprovalStatus.REJECTED);
		approvalRequest.setActionDate(LocalDateTime.now());

		ApprovalRequest app = approvalRequestRepo.save(approvalRequest);
		
		Supplier requester = approvalRequest.getProduct().getSupplier();

		emailService.sendEmail(
		        requester.getEmail(),
		        "Purchase Request Rejected",
		        "Hello " + requester.getName()
		        + ",\n\nYour request for "
		        + approvalRequest.getProduct().getName()
		        + " has been REJECTED.\nReason : "
		        + approvalRequest.getRemarks()
		);
		return app;
	}
	
}
