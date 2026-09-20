package com.procurement.enterpriseApp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.Department;

public interface DepartmentRepo extends JpaRepository<Department, Long>{

}
