import config from 'config';
 export const jwtConfig = config.get<any>('jwt');
 export const projectName: string = config.get<string>('server.name');
const env: string = process.env.NODE_ENV || 'dev';

export const enum JwtTypeEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export enum TokenAvailabilityTypeEnum {
  AVAILABLE = 'AVAILABLE',
  EXPIRED = 'EXPIRED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export type UserType = 'ADMIN' | 'DRIVER';

export type AccessPayloadType = {
  userType: UserType;
  accountId: string;
  sessionId: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
};

 export type AccessWrappedPayloadType = {
  ut: UserType;
  aid: string;
  sid: string;
  aea: number;
  rea: number;
};

export function getJwtTokenName (tokenName: string, userType: UserType) {
  return `${projectName.toLowerCase()}_${env}_${tokenName.toLowerCase()}_${userType.toLowerCase()}`;
};
