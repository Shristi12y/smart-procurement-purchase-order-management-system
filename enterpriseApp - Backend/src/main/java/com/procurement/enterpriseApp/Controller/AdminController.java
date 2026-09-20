package com.procurement.enterpriseApp.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.procurement.enterpriseApp.DTO.AdminLoginResponse;
import com.procurement.enterpriseApp.DTO.LoginRequest;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {
	
	@Autowired
	private AdminService adminService;
	
	
	@PostMapping("/login")
	public ResponseEntity<?> adminLogin(@RequestBody LoginRequest request){
		
		boolean isvalid = adminService.login(request.getEmail(), request.getPassword());
		
		if(isvalid) {
			return ResponseEntity.ok(new AdminLoginResponse("Admin Login Successful","ADMIN","administrator"));
		}
		
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Admin Credentials");
	}
	
	
	@GetMapping("/users")
	public List<User> getAllUsers(){
		return adminService.getAllUsers();
	}
	
	
	@GetMapping("/users/{Id}")
	public ResponseEntity<User> getUserById(@PathVariable Long Id){
		
		User user = adminService.getUserById(Id);
		
		if(user != null) {
			return ResponseEntity.ok(user);
		}
		
		return ResponseEntity.notFound().build();
	}
	
	
	@DeleteMapping("/users/{Id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long Id){
		
		adminService.deleteuser(Id);
		
		return ResponseEntity.ok("User Deleted Successfully");
	}
	
	
	@PutMapping("/users/{id}")
	public ResponseEntity<?> updateUser(@PathVariable Long id,
	                                    @RequestBody User user) {

	    User updatedUser = adminService.updateUser(id, user);

	    if (updatedUser == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("User Not Found");
	    }

	    return ResponseEntity.ok(updatedUser);
	}
	
}
