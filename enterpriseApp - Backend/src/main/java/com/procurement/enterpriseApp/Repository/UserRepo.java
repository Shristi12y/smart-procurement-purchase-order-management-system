package com.procurement.enterpriseApp.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.procurement.enterpriseApp.Model.User;

public interface UserRepo extends JpaRepository<User, Long>{
	Optional<User> findByEmail(String email);
	
	Optional<User> findByPhoneNumber(String PhonenUmber);
	
	boolean existsByEmail(String emmail);		//checking duplicates
	
	boolean existsByPhoneNumber(String phoneNumber);
}
