import { AccessPayloadType, AccessWrappedPayloadType, getJwtTokenName, jwtConfig, JwtTypeEnum, TokenAvailabilityTypeEnum, UserType } from "./enums/jwt.utilities.enum";
import JWT from 'jsonwebtoken';
import { generateToken, verifyToken } from "./helper/verify.helper";

export class AccessToken {
  constructor(
    private readonly accountId: string,
    private readonly userType: UserType,
  ) {}

  generate(sessionId: string) {
    if (!sessionId) return null;

    const now = Date.now();

    const accessExpiresAt =
      now + jwtConfig.access.expiresInSeconds * 1000;

    const refreshExpiresAt =
      now + jwtConfig.refresh.expiresInSeconds * 1000;

    const payload: AccessWrappedPayloadType = {
      ut: this.userType,
      aid: this.accountId,
      sid: sessionId,
      aea: accessExpiresAt,
      rea: refreshExpiresAt,
    };

    const { token } = generateToken(JwtTypeEnum.ACCESS, payload);

    return {
      name: getJwtTokenName('auth', this.userType),
      token,
      ttl: jwtConfig.refresh.expiresInSeconds * 1000,
      payload: AccessToken.unwrap(payload),
    };
  }

  static unwrap(payload: AccessWrappedPayloadType): AccessPayloadType {
    return {
      userType: payload.ut,
      accountId: payload.aid,
      sessionId: payload.sid,
      accessExpiresAt: payload.aea,
      refreshExpiresAt: payload.rea,
    };
  }

  static decode(token: string): AccessPayloadType | null {
    const decoded = JWT.decode(token) as AccessWrappedPayloadType | null;
    return decoded ? this.unwrap(decoded) : null;
  }

  static verify(token: string): AccessPayloadType | null {
    const verified = verifyToken(token, JwtTypeEnum.ACCESS);
    return verified ? this.unwrap(verified as any) : null;
  }

  static checkExpiry(token: string): TokenAvailabilityTypeEnum {
    const decoded = this.decode(token);
    if (!decoded) return TokenAvailabilityTypeEnum.UNAVAILABLE;

    const now = Date.now();

    if (decoded.accessExpiresAt > now)
      return TokenAvailabilityTypeEnum.AVAILABLE;

    if (
      decoded.accessExpiresAt < now &&
      decoded.refreshExpiresAt > now
    )
      return TokenAvailabilityTypeEnum.EXPIRED;

    return TokenAvailabilityTypeEnum.UNAVAILABLE;
  }

  static revoke(userType: UserType) {
    return {
      name: getJwtTokenName('auth', userType),
      ttl: 0,
    };
  }
}
