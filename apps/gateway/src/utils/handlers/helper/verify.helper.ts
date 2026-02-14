import { jwtConfig, JwtTypeEnum } from "../enums/jwt.utilities.enum";
import { JwtPayload } from 'jsonwebtoken';
import JWT from 'jsonwebtoken';

 export function generateToken(
  type: JwtTypeEnum,
  payload: object,
): { token: string; ttl: number } {
  const opts = jwtConfig[type];
  if (!opts) throw new Error(`JWT config not found for type: ${type}`);

  const token = JWT.sign(payload, opts.secret, {
    expiresIn: opts.expiresInSeconds,
  });

  return {
    token,
    ttl: opts.expiresInSeconds * 1000,
  };
}

 export function verifyToken(token: string, type: JwtTypeEnum): JwtPayload | null {
  try {
    const secret = jwtConfig[type].secret;
    return JWT.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
