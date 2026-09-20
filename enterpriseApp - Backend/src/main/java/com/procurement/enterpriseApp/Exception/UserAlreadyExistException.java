package com.procurement.enterpriseApp.Exception;

public class UserAlreadyExistException extends RuntimeException{
	
	public UserAlreadyExistException(String message) {
		super(message);
	}
}
