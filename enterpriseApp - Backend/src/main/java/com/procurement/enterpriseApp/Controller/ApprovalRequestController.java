package com.procurement.enterpriseApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.procurement.enterpriseApp.DTO.ApprovalActionRequest;
import com.procurement.enterpriseApp.Model.ApprovalRequest;
import com.procurement.enterpriseApp.Service.ApprovalRequestService;

@RestController
@RequestMapping("/approvalRequests")
@CrossOrigin(origins = "http://localhost:4200")
public class ApprovalRequestController {
	
	@Autowired
	private ApprovalRequestService approvalRequestService;
	
	
	@PostMapping
    public ApprovalRequest addApprovalRequest(@RequestBody ApprovalRequest approvalRequest) {

        return approvalRequestService.addApprovalRequest(approvalRequest);
    }

    @GetMapping
    public List<ApprovalRequest> getAllApprovalRequests() {
        return approvalRequestService.getAllApprovalrequest();
    }

    
    @GetMapping("/{id}")
    public ApprovalRequest getApprovalRequestById(@PathVariable Long id) {
        return approvalRequestService.getApprovalRequestById(id);
    }

    
    @GetMapping("/product/{productId}")
    public List<ApprovalRequest> getApprovalRequestsByProduct(@PathVariable Long productId) {
        return approvalRequestService.getApprovalRequestByProduct(productId);
    }

    
    @DeleteMapping("/{id}")
    public String deleteApprovalRequest(@PathVariable Long id) {
        return approvalRequestService.deleteApprovalRequest(id);
    }
    
    @PutMapping("/{id}/approve")
    public ApprovalRequest approveRequest(@PathVariable Long id,
                                          @RequestBody ApprovalActionRequest request) {

        return approvalRequestService.approveRequest(id, request);
    }
    
    @PutMapping("/{id}/reject")
    public ApprovalRequest rejectRequest(@PathVariable Long id,
                                         @RequestBody ApprovalActionRequest request) {

        return approvalRequestService.rejectRequest(id, request);
    }
}
