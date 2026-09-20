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

import com.procurement.enterpriseApp.DTO.LoginRequest;
import com.procurement.enterpriseApp.DTO.LoginResponse;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Service.UserService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	
	@PostMapping("/register")
	public User registerUser(@RequestBody User user) {
		return userService.registerUser(user);
	}
	
	
	@GetMapping
	public List<User> getAllUSer(){
		return userService.getAllUsers();
	}
	
	
	@GetMapping("/{userId}")
	public User getUsersByID(@PathVariable Long userId) {
		return userService.getUserById(userId);
	}
	
	
	@DeleteMapping("/{userId}")
	public String deleteuser(@PathVariable Long userId) {
		return userService.deleteUser(userId);
	}
	
	
	@PutMapping("/{id}")
	public User updateUser(@PathVariable Long id, @RequestBody User user) {
		return userService.userUpdate(id, user);
	}
	
	
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginRequest request) {
		return userService.login(request);
	}
}
