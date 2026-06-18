package com.tiffin.tiffin_management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class StudentUpdateRequest {
    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Pattern(regexp = "^(?:\\+94|94|0)?7[0-9]{8}$", message = "Invalid Sri Lankan mobile number. Example: 0712345678")
    private String mobileNumber;

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String physicalAddress;

    @Pattern(regexp = "^\\d{12}$", message = "Aadhaar number must be 12 digits")
    private String aadhaarNumber;
}
