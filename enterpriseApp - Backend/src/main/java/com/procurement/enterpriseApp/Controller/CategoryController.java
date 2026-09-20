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

import com.procurement.enterpriseApp.Model.Category;
import com.procurement.enterpriseApp.Service.CategoryService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {
	
	@Autowired
	private CategoryService catgService;
	
	
	@PostMapping
	public Category addCategory( @RequestBody Category category) {
	    return catgService.addCategory(category);
	}
	
	@GetMapping
	public List<Category> GetAllCategory(){
		return catgService.getAllCategory();
	}
	
	@GetMapping("/{departmentId}/categories")
	public List<Category> getCategoryByDepartmentId(@PathVariable Long departmentId) {
	    return catgService.getcategoryByDepartId(departmentId);
	}
	
	@PutMapping("/{categoryId}")
	public Category updateCategory(
	        @PathVariable Long categoryId,
	        @RequestBody Category category) {

	    return catgService.updateCategory(categoryId, category);
	}


	@DeleteMapping("/{categoryId}")
	public String deleteCategory(
	        @PathVariable Long categoryId) {

	    catgService.deleteCategory(categoryId);

	    return "Category deleted successfully.";
	}
}
