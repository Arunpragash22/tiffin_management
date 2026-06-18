package com.tiffin.tiffin_management.util;

import com.tiffin.tiffin_management.exception.BadRequestException;

public final class PhoneNumberUtil {

    private static final String SL_MOBILE_PATTERN = "^(?:\\+94|94|0)?7[0-9]{8}$";

    private PhoneNumberUtil() {}

    public static boolean isValidSriLankanMobile(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isBlank()) {
            return false;
        }
        return mobileNumber.replaceAll("[\\s-]", "").matches(SL_MOBILE_PATTERN);
    }

    public static String normalizeSriLankanMobile(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isBlank()) {
            throw new BadRequestException("Mobile number is required");
        }

        String digits = mobileNumber.replaceAll("[\\s-]", "");

        if (digits.matches("^\\+947[0-9]{8}$")) {
            return "0" + digits.substring(3);
        }
        if (digits.matches("^947[0-9]{8}$")) {
            return "0" + digits.substring(2);
        }
        if (digits.matches("^7[0-9]{8}$")) {
            return "0" + digits;
        }
        if (digits.matches("^07[0-9]{8}$")) {
            return digits;
        }

        throw new BadRequestException("Invalid Sri Lankan mobile number. Use format: 0712345678 or +94771234567");
    }
}
