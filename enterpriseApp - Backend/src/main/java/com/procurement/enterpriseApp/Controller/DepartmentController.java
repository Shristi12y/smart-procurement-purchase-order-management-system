package com.procurement.enterpriseApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurement.enterpriseApp.Model.Department;
import com.procurement.enterpriseApp.Service.DepartmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "http://localhost:4200")
public class DepartmentController {
	
	@Autowired
	private DepartmentService deptService;
	
	
	@PostMapping
    public Department addDepartment(@RequestBody Department department) {
        return deptService.addDepartment(department);
    }
	
	
	@GetMapping
	public List<Department> getAllDepartment(){
		return deptService.getAllDepartments();
	}
	
	@GetMapping("/{deptId}")
	public Department getDepartmentById(@PathVariable Long deptId) {
		return deptService.getDepartmentByDepartmentId(deptId);
		
	}
	
	@PutMapping("/{departmentId}")
	public Department updateDepartment(
	        @PathVariable Long departmentId,
	        @RequestBody Department department) {

	    return deptService.updateDepartment(
	            departmentId,
	            department
	    );
	}


	@DeleteMapping("/{departmentId}")
	public String deleteDepartment(
	        @PathVariable Long departmentId) {

	    deptService.deleteDepartment(departmentId);

	    return "Department deleted successfully.";
	}
	
}
