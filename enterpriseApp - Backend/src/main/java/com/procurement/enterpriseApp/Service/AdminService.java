package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Repository.UserRepo;


@Service
public class AdminService {
	
	@Autowired
	private UserRepo userRepo;
	
	private static final String Admin_Email ="proadminvishal@gmail.com";
	private static final String Admin_Password ="admin2304";
	
	
	public boolean login(String email, String pass) {
		return Admin_Email.equals(email) && Admin_Password.equals(pass);
	}
	
	public List<User> getAllUsers(){
		return userRepo.findAll();
	}
	
	public User getUserById(Long id) {
		return userRepo.findById(id).orElse(null);
	}
	
	public String deleteuser(Long id) {
		User user = userRepo.findById(id).orElseThrow(()->new ResourceNotFoundException("User Not Found"));

		userRepo.deleteById(id);
		return "User Deleted Successfully...";
	}
	
	
	public User updateUser(Long id, User updatedUser) {

	    User existingUser = userRepo.findById(id).orElse(null);

	    if (existingUser == null) {
	        return null;
	    }

	    existingUser.setName(updatedUser.getName());
	    existingUser.setEmail(updatedUser.getEmail());
	    existingUser.setPassword(updatedUser.getPassword());
	    existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
	    existingUser.setDesignation(updatedUser.getDesignation());
	    existingUser.setDepartment(updatedUser.getDepartment());

	    return userRepo.save(existingUser);
	}
	
}
