package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Department;
import com.procurement.enterpriseApp.Repository.DepartmentRepo;

@Service
public class DepartmentService {
	
	@Autowired
	private DepartmentRepo deptRepo;
	
	public List<Department> getAllDepartments(){
		return deptRepo.findAll();
	}
	
	public Department getDepartmentByDepartmentId(Long departmentId) {
		 return deptRepo.findById(departmentId)
	                .orElseThrow(() ->
	                        new ResourceNotFoundException("Department not found with id : " + departmentId));
	    
	}

	public Department addDepartment(Department dept) {
		return deptRepo.save(dept);
	}
	
	public Department updateDepartment(
	        Long departmentId,
	        Department department) {

	    Department existingDepartment =
	            deptRepo.findById(departmentId)
	            .orElseThrow(() ->
	                new ResourceNotFoundException(
	                    "Department not found with id : "
	                    + departmentId
	                )
	            );

	    existingDepartment.setDepartmentName(
	            department.getDepartmentName()
	    );

	    existingDepartment.setManager(
	            department.getManager()
	    );

	    return deptRepo.save(existingDepartment);
	}
	
	public String deleteDepartment(Long departmentId) {

	    Department department =
	            deptRepo.findById(departmentId)
	            .orElseThrow(() ->
	                new ResourceNotFoundException(
	                    "Department not found with id : "
	                    + departmentId
	                )
	            );

	    deptRepo.delete(department);

	    return "Department deleted successfully.";
	}
	
	

}
