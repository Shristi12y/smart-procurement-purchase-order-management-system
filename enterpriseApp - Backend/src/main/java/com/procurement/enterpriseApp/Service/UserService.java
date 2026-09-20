package com.procurement.enterpriseApp.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.procurement.enterpriseApp.DTO.LoginRequest;
import com.procurement.enterpriseApp.DTO.LoginResponse;
import com.procurement.enterpriseApp.Exception.ResourceNotFoundException;
import com.procurement.enterpriseApp.Exception.UserAlreadyExistException;
import com.procurement.enterpriseApp.Model.Department;
import com.procurement.enterpriseApp.Model.User;
import com.procurement.enterpriseApp.Model.Enum.Role;
import com.procurement.enterpriseApp.Model.Enum.UserStatus;
import com.procurement.enterpriseApp.Repository.DepartmentRepo;
import com.procurement.enterpriseApp.Repository.UserRepo;

@Service
public class UserService {
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private DepartmentRepo departmentRepo;
	
	@Autowired
	private EmailService emailService;
	
	public User registerUser(User user) {
		
		if(userRepo.findByEmail(user.getEmail()).isPresent()) {
			throw new UserAlreadyExistException("Email Already Exist");
		}
		
		if(userRepo.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
			throw new UserAlreadyExistException("Phone Number Already Exists.");
		}
		if (user.getDepartment() == null ||
		        user.getDepartment().getDepartmentId() == null) {

		    throw new ResourceNotFoundException("Department ID is required");
		}

		Long departmentId = user.getDepartment().getDepartmentId();

		Department department = departmentRepo.findById(departmentId)
		        .orElseThrow(() ->
		                new ResourceNotFoundException("Department Not Found"));

		user.setDepartment(department);

		user.setRole(Role.USER);
		user.setStatus(UserStatus.ACTIVE);
		User savedUser = userRepo.save(user);

		emailService.sendUserRegistrationEmail(
		        savedUser.getEmail(),
		        savedUser.getName(),
		        savedUser.getDepartment() != null
		                ? savedUser.getDepartment().getDepartmentName()
		                : "N/A",
		        savedUser.getDesignation()
		);

		return savedUser;
	}
	
	
	public List<User> getAllUsers(){
		return userRepo.findAll();
	}
	
	
	public User getUserById(Long userId) {
		return userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
	}
	
	
	public String deleteUser(Long UserId) {
		
		User user = userRepo.findById(UserId).orElseThrow(()->new ResourceNotFoundException("User Not Found"));
		
		userRepo.delete(user);
		return "User Deleted Successfully";
	}
	
	
	public User userUpdate(Long id, User updateUser) {
		
		User existingUser = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("user Not Fopund"));
		
		existingUser.setName(updateUser.getName());
		existingUser.setEmail(updateUser.getEmail());
		existingUser.setPhoneNumber(updateUser.getPhoneNumber());
		existingUser.setPassword(updateUser.getPassword());
		existingUser.setDesignation(updateUser.getDesignation());
		existingUser.setDepartment(updateUser.getDepartment());
		
		return userRepo.save(existingUser);
	}
	
	public LoginResponse login(LoginRequest request) {
		
		User user = userRepo.findByEmail(request.getEmail()).orElseThrow(() -> new ResourceNotFoundException("Invalid Email"));
		
		if(!user.getPassword().equals(request.getPassword())) {
			throw new ResourceNotFoundException("Invalid Password");
		}
		return new LoginResponse("Login Successful", user.getRole().name(), user.getUserId(), user.getName());
	}
}
