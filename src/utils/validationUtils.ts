export const validateEmail = (email: string): boolean => {
  if (!email.trim()) return false;
  const emailParts = email.split('@');
  return emailParts.length === 2 && !!emailParts[0] && !!emailParts[1] && emailParts[1].includes('.');
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return !!confirmPassword && password === confirmPassword;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};