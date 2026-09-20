package com.procurement.enterpriseApp.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.Product;
import com.procurement.enterpriseApp.Model.Enum.ProductStatus;

public interface ProductRepo extends JpaRepository<Product, Long>{
	
	List<Product> findByDepartmentDepartmentId(Long departmentId);

    List<Product> findByCategoryCategoryId(Long categoryId);

    List<Product> findBySupplierSupplierId(Long supplierId);

    List<Product> findByStatus(ProductStatus status);
}
