// Sri Lankan mobile: 0712345678, 712345678, +94771234567, 94771234567
export const SL_MOBILE_REGEX = /^(?:\+94|94|0)?7[0-9]{8}$/;

export const normalizeSlMobile = (value) => {
  const digits = value.replace(/[\s-]/g, '');
  if (/^\+947[0-9]{8}$/.test(digits)) return `0${digits.slice(3)}`;
  if (/^947[0-9]{8}$/.test(digits)) return `0${digits.slice(2)}`;
  if (/^7[0-9]{8}$/.test(digits)) return `0${digits}`;
  if (/^07[0-9]{8}$/.test(digits)) return digits;
  return digits;
};

export const isValidSlMobile = (value) => SL_MOBILE_REGEX.test(value.replace(/[\s-]/g, ''));

export const SL_MOBILE_HELPER = 'Use Sri Lankan format: 0712345678 or +94771234567';
