package com.procurement.enterpriseApp.Model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Data
@AllArgsConstructor
@Table(name = "Supplier")
public class Supplier {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long supplierId;

	@JsonIgnore
	@OneToMany(mappedBy = "supplier")
	private List<Product> product;

    @NotBlank(message = "Supplier name is required")
    @Column(nullable = false)
    private String name;

    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Enter a valid 10-digit phone number")
    @Column(unique = true)
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @Email(message = "Invalid email")
    @Column(unique = true)
    private String email;
    
    //@JsonIgnore
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Account Number is required")
    @Column(name = "account_no.", unique = true)
    private String accountNo;

    @NotBlank(message = "GST Number is required")
    @Column(name = "gst_number", unique = true)
    private String gstNumber;

    @NotBlank(message = "Status is required")
    private String status;

    @Min(1)
    @Max(5)
    private Integer rating;

    @Column(length = 1000)
    private String feedback;

	public Long getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Long supplierId) {
		this.supplierId = supplierId;
	}

	public List<Product> getProduct() {
		return product;
	}

	public void setProduct(List<Product> product) {
		this.product = product;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getAccountNo() {
		return accountNo;
	}

	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}

	public String getGstNumber() {
		return gstNumber;
	}

	public void setGstNumber(String gstNumber) {
		this.gstNumber = gstNumber;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getFeedback() {
		return feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	

	public Supplier(Long supplierId, List<Product> product,
			@NotBlank(message = "Supplier name is required") String name,
			@Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit phone number") String phone,
			@NotBlank(message = "Address is required") String address, @Email(message = "Invalid email") String email,
			@NotBlank(message = "Password is required") String password,
			@NotBlank(message = "Account Number is required") String accountNo,
			@NotBlank(message = "GST Number is required") String gstNumber,
			@NotBlank(message = "Status is required") String status, @Min(1) @Max(5) Integer rating, String feedback) {
		super();
		this.supplierId = supplierId;
		this.product = product;
		this.name = name;
		this.phone = phone;
		this.address = address;
		this.email = email;
		this.password = password;
		this.accountNo = accountNo;
		this.gstNumber = gstNumber;
		this.status = status;
		this.rating = rating;
		this.feedback = feedback;
	}

	public Supplier() {
	}
	
	
    
    
}
