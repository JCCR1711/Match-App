const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email: string) =>
  emailPattern.test(email.trim().toLowerCase());
