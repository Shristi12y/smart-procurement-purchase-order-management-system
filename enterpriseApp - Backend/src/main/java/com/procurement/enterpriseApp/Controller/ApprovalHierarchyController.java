package com.procurement.enterpriseApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import com.procurement.enterpriseApp.Model.ApprovalHierarchy;
import com.procurement.enterpriseApp.Service.ApprovalHierarchyService;

@RestController
@RequestMapping("/approvalHierarchy")
@CrossOrigin(origins = "http://localhost:4200")
public class ApprovalHierarchyController {
	
	@Autowired
    private ApprovalHierarchyService approvalService;

    @PostMapping
    public ApprovalHierarchy addApproval(@RequestBody ApprovalHierarchy approval) {
        return approvalService.addApprovalLevel(approval);
    }

    @GetMapping
    public List<ApprovalHierarchy> getAllApprovalLevels() {
        return approvalService.getAllApprovalLevels();
    }

    @GetMapping("/{id}")
    public ApprovalHierarchy getApprovalById(@PathVariable Long id) {
        return approvalService.getApprovalById(id);
    }

    @GetMapping("/department/{departmentId}")
    public List<ApprovalHierarchy> getByDepartment(@PathVariable Long departmentId) {
        return approvalService.getByDepartment(departmentId);
    }

    @PutMapping("/{id}")
    public ApprovalHierarchy updateApproval(@PathVariable Long id,
                                            @RequestBody ApprovalHierarchy approval) {
        return approvalService.updateApproval(id, approval);
    }

    @DeleteMapping("/{id}")
    public String deleteApproval(@PathVariable Long id) {
        return approvalService.deleteApproval(id);
    }
}
