package com.procurement.enterpriseApp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.ApprovalHierarchy;

public interface ApprovalHierarchyRepo extends JpaRepository<ApprovalHierarchy, Long>{
	
	List<ApprovalHierarchy> findByDepartmentDepartmentId(Long departmentId);
}
