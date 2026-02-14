import { Request } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import { AdminModel, AdminSessionModel } from './admin/admin.dto';
import { DriverModel, DriverSessionModel } from './driver/driver.dto';


//Authorize Output DTO

export class AuthorizeOutputDto {
  @ApiProperty({ type: Boolean, description: 'Whether the user is authorized' })
  isAuthorized!: boolean;

  @ApiProperty({
    description: 'Profile information of the authorized user',
    type: () => Object,
    required: false,
    oneOf: [{ $ref: '#/components/schemas/AdminModel' }, { $ref: '#/components/schemas/DriverModel' }],
  })
  profile?: DriverModel | AdminModel;

  @ApiProperty({
    description: 'Session information of the authorized user',
    type: () => Object,
    required: false,
    oneOf: [{ $ref: '#/components/schemas/AdminSessionModel' }, { $ref: '#/components/schemas/DriverSessionModel' }],
  })
  session?: DriverSessionModel | AdminSessionModel;

  @ApiProperty({
    description: 'JWT token and TTL for authorized session',
    required: false,
    type: () => Object,
    example: { token: 'jwt_token_here', ttl: 3600 },
  })
  tokenData?: {
    token: string;
    ttl: number;
  };

  @ApiProperty({ type: String, required: false, description: 'Cookie to clear if needed' })
  clearCookie?: string;

  @ApiProperty({ type: Boolean, required: false, description: 'Whether account is active' })
  isActive?: boolean;
}


//Request With User Data

export interface RequestWithUserData extends Request {
  cookies: Record<string, string>;
  acc_profile?: DriverModel | AdminModel;
  acc_session?: DriverSessionModel | AdminSessionModel;
  acc_isActive?: boolean;
  acc_type?: 'ADMIN' | 'DRIVER' | 'PASSENGER';
}


//Action Status Enum

export enum ActionStatusEnum {
  DELETED = 'DELETED',
  UPDATED = 'UPDATED',
  CREATED = 'CREATED',
}


//Status Response DTO

export class StatusResponseDto {
  @ApiProperty({ type: String, enum: ActionStatusEnum, required: false })
  status?: ActionStatusEnum;

  @ApiProperty({ type: Object, required: false, description: 'Optional response data after action' })
  then?: any;

  @ApiProperty({ type: String, required: false, description: 'Optional cookie to clear' })
  clearCookie?: string;
}
