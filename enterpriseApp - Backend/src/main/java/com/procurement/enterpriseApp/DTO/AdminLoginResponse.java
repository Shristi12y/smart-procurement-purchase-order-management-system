package com.procurement.enterpriseApp.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginResponse {
	
	private String message;
    private String role;
    private String name;
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public AdminLoginResponse(String message, String role, String name) {
		super();
		this.message = message;
		this.role = role;
		this.name = name;
	}
	public AdminLoginResponse() {
	}
    
    
}
