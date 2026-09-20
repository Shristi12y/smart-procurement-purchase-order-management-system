package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.ApprovalHierarchy;
import com.procurement.enterpriseApp.Repository.ApprovalHierarchyRepo;

@Service
public class ApprovalHierarchyService {
	
	@Autowired
	private ApprovalHierarchyRepo approvalRepo;
	
	public ApprovalHierarchy addApprovalLevel(ApprovalHierarchy approval) {
        return approvalRepo.save(approval);
    }

    public List<ApprovalHierarchy> getAllApprovalLevels() {
        return approvalRepo.findAll();
    }

    public ApprovalHierarchy getApprovalById(Long id) {
        return approvalRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval Level Not Found"));
    }

    public List<ApprovalHierarchy> getByDepartment(Long departmentId) {
        return approvalRepo.findByDepartmentDepartmentId(departmentId);
    }

    public ApprovalHierarchy updateApproval(Long id, ApprovalHierarchy updatedApproval) {

        ApprovalHierarchy approval = approvalRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval Level Not Found"));

        approval.setDepartment(updatedApproval.getDepartment());
        approval.setLevel(updatedApproval.getLevel());

        return approvalRepo.save(approval);
    }

    public String deleteApproval(Long id) {

        ApprovalHierarchy approval = approvalRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Approval Level Not Found"));

        approvalRepo.delete(approval);

        return "Approval Level Deleted Successfully";
    }
}
