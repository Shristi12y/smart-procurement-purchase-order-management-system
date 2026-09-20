package com.procurement.enterpriseApp.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
@Table(name = "Approval_hierarchy")

public class ApprovalHierarchy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "approval_hierarchy_id")
    private Long approvalHierarchyId;

    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Min(value = 1, message = "Approval level must be greater than 0")
    @Column(nullable = false)
    private int level;

	public Long getApprovalHierarchyId() {
		return approvalHierarchyId;
	}

	public void setApprovalHierarchyId(Long approvalHierarchyId) {
		this.approvalHierarchyId = approvalHierarchyId;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public ApprovalHierarchy(Long approvalHierarchyId, Department department,
			@Min(value = 1, message = "Approval level must be greater than 0") int level) {
		super();
		this.approvalHierarchyId = approvalHierarchyId;
		this.department = department;
		this.level = level;
	}

	public ApprovalHierarchy() {
	
	}
    
    
}
