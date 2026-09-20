package com.procurement.enterpriseApp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.Category;

public interface CategoryRepo extends JpaRepository<Category, Long>{
	List<Category> findByDepartmentDepartmentId(Long departmentId);
}
