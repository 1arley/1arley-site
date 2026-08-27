// Validações utilitárias reutilizáveis
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export function isValidEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

export default isValidEmail;
