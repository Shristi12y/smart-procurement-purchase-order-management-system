package com.procurement.enterpriseApp.Model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "department")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Department {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    @Column(name = "department_id")
	    private Long departmentId;

	    @NotBlank(message = "Department name is required")
	    @Column(name = "department_name", nullable = false, unique = true)
	    private String departmentName;

	    @NotBlank(message = "Department manager is required")
	    @Column(name = "manager")
	    private String manager;

		public Long getDepartmentId() {
			return departmentId;
		}

		public void setDepartmentId(Long departmentId) {
			this.departmentId = departmentId;
		}

		public String getDepartmentName() {
			return departmentName;
		}

		public void setDepartmentName(String departmentName) {
			this.departmentName = departmentName;
		}

		public String getManager() {
			return manager;
		}

		public void setManager(String manager) {
			this.manager = manager;
		}

		
	
}
