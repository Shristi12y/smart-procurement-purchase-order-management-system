package com.procurement.enterpriseApp.Model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.procurement.enterpriseApp.Model.Enum.ApprovalStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "approval_request")
public class ApprovalRequest {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long approvalRequestId;
	
	//@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "product_id")
	private Product product;
	
	//@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "approval_hierarchy_id")
	private ApprovalHierarchy approvalHierarchy;
	
	//@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "approved_by")
	private User approvedBy;
	
	@Enumerated(EnumType.STRING)
	private ApprovalStatus status;
	
	private String remarks;
	
	private LocalDateTime actionDate;

	public Long getApprovalRequestId() {
		return approvalRequestId;
	}

	public void setApprovalRequestId(Long approvalRequestId) {
		this.approvalRequestId = approvalRequestId;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public ApprovalHierarchy getApprovalHierarchy() {
		return approvalHierarchy;
	}

	public void setApprovalHierarchy(ApprovalHierarchy approvalHierarchy) {
		this.approvalHierarchy = approvalHierarchy;
	}

	public User getApprovedBy() {
		return approvedBy;
	}

	public void setApprovedBy(User approvedBy) {
		this.approvedBy = approvedBy;
	}

	public ApprovalStatus getStatus() {
		return status;
	}

	public void setStatus(ApprovalStatus status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public LocalDateTime getActionDate() {
		return actionDate;
	}

	public void setActionDate(LocalDateTime actionDate) {
		this.actionDate = actionDate;
	}

	public ApprovalRequest(Long approvalRequestId, Product product, ApprovalHierarchy approvalHierarchy,
			User approvedBy, ApprovalStatus status, String remarks, LocalDateTime actionDate) {
		super();
		this.approvalRequestId = approvalRequestId;
		this.product = product;
		this.approvalHierarchy = approvalHierarchy;
		this.approvedBy = approvedBy;
		this.status = status;
		this.remarks = remarks;
		this.actionDate = actionDate;
	}
	
	public ApprovalRequest(){
		
	}
	
}
