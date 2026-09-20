package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.Category;
import com.procurement.enterpriseApp.Model.Department;
import com.procurement.enterpriseApp.Repository.CategoryRepo;
import com.procurement.enterpriseApp.Repository.DepartmentRepo;


@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepo categRepo;
	
	@Autowired
	private DepartmentRepo deptRepo;
	
	public List<Category> getcategoryByDepartId(Long deptId){
		
		Department dept = deptRepo.findById(deptId).orElseThrow(()-> 
							new ResourceNotFoundException("Department not Found"));
		
		
		return categRepo.findByDepartmentDepartmentId(dept.getDepartmentId());
	}

	public Category addCategory(Category category) {
	    return categRepo.save(category);
	}
	
	public List<Category> getAllCategory(){
		return categRepo.findAll();
	}
	
	public Category updateCategory(Long categoryId,Category category) {

	    Category existingCategory =
	            categRepo.findById(categoryId)
	            .orElseThrow(() ->
	                new ResourceNotFoundException(
	                    "Category not found with ID : " + categoryId
	                )
	            );

	    existingCategory.setCategoryName(
	            category.getCategoryName()
	    );

	    existingCategory.setDepartment(
	            category.getDepartment()
	    );

	    return categRepo.save(existingCategory);
	}
	
	public String deleteCategory(Long categoryId) {

	    Category category =
	            categRepo.findById(categoryId)
	            .orElseThrow(() ->
	                new ResourceNotFoundException(
	                    "Category not found with ID : " + categoryId
	                )
	            );

	    categRepo.delete(category);

	    return "Category deleted successfully.";
	}
}
