import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // salt rounds for bcrypt hashing


export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};


export const verifyPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return false;
  }
};

export const isStrongPassword = (password: string): boolean => {
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,64}$/.test(
    password,
  );
};
