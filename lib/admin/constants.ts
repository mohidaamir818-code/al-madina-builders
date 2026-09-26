/** Hidden admin base path — never link this from public UI. */
export const ADMIN_BASE = "/al-madina-builders-entry-of-product-management";

export const ADMIN_COOKIE = "amb_admin_session";
export const ADMIN_OTP_COOKIE = "amb_admin_otp_pending";

export const SESSION_DAYS = 7;
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_RESEND_COOLDOWN_MS = 45 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes
