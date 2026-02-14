import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, IsOptional, IsString, Matches, IsBoolean, IsDate, MinLength, MaxLength 
} from 'class-validator';


//Base Admin Model

export class AdminModel {
  @ApiProperty({ type: String, required: false, description: 'Unique admin ID' })
  @IsOptional() @IsString() id?: string;

  @ApiProperty({ type: String, required: false, description: 'Admin email address' })
  @IsOptional() @IsEmail() email?: string;

  @ApiProperty({ type: String, required: false, description: 'Admin full name' })
  @IsOptional() @IsString() name?: string;

  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsString() salt?: string;

  @ApiProperty({ type: Boolean, required: false, description: 'Whether this is a default admin account' })
  @IsOptional() @IsBoolean() isDefault?: boolean;

  @ApiProperty({ type: Boolean, required: false, description: 'Whether the admin is active' })
  @IsOptional() @IsBoolean() isActive?: boolean;

  @ApiProperty({ type: Date, required: false, description: 'Record creation date' })
  @IsOptional() @IsDate() createdAt?: Date;

  @ApiProperty({ type: Date, required: false, description: 'Record last update date' })
  @IsOptional() @IsDate() updatedAt?: Date;
}

//Admin Session Model

export class AdminSessionModel {
  @ApiProperty({ type: String, required: false, description: 'Session ID' })
  @IsOptional() @IsString() id?: string;

  @ApiProperty({ type: String, required: false, description: 'Associated admin ID' })
  @IsOptional() @IsString() adminId?: string;

  @ApiProperty({ type: Date, required: false, description: 'Refresh token expiration date' })
  @IsOptional() @IsDate() refreshExpiresAt?: Date;

  @ApiProperty({ type: Date, required: false, description: 'Session creation date' })
  @IsOptional() @IsDate() createdAt?: Date;

  @ApiProperty({ type: Date, required: false, description: 'Session last update date' })
  @IsOptional() @IsDate() updatedAt?: Date;
}


//Sign In DTO

export class AdminSignInInputDto {
  @ApiProperty({ type: String, required: true, example: 'root@snapp.com', description: 'Admin login email' })
  @IsEmail() @IsString() email!: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Root@1234!',
    description: 'Password (8-32 chars, 1 uppercase, 1 number, 1 symbol)',
  })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-_]).{8,32}$/, {
    message: 'Password must be 8-32 chars, include uppercase, lowercase, number, and symbol (#?!@$%^&*-_)',
  })
  password!: string;
}

export class AdminSignInOutputDto {
  @ApiProperty({ type: Object, description: 'JWT token and refresh token data' })
  tokenData!: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  };

  @ApiProperty({ type: AdminModel, description: 'Admin profile data' })
  profile!: AdminModel;

  @ApiProperty({ type: AdminSessionModel, description: 'Admin session data' })
  session!: AdminSessionModel;
}


//Get Profile DTO

export class GetProfileOutputDto {
  @ApiProperty({ type: String, example: 'ADMIN', description: 'Type of user' })
  userType: 'ADMIN' = 'ADMIN';
}

export class GetAdminProfileOutputDto extends GetProfileOutputDto {
  @ApiProperty({ type: AdminModel, required: false, description: 'Admin profile data' })
  @IsOptional() profile?: AdminModel;

  @ApiProperty({ type: AdminSessionModel, required: false, description: 'Admin session data' })
  @IsOptional() session?: AdminSessionModel;
}


//Update Profile DTO

export class UpdateAdminProfileDto {
  @ApiProperty({ type: String, required: false, description: 'Admin full name' })
  @IsOptional() @IsString() name?: string;

  @ApiProperty({ type: String, required: false, description: 'Admin email address' })
  @IsOptional() @IsEmail() email?: string;
}


//Change Password DTO

export class AdminChangePasswordDto {
  @ApiProperty({ type: String, required: true, example: 'OldPass@123', description: 'Current password' })
  @IsString() oldPassword!: string;

  @ApiProperty({ type: String, required: true, example: 'NewPass@123', description: 'New password' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-_]).{8,32}$/, {
    message: 'New password must be 8-32 chars, include uppercase, lowercase, number, and symbol (#?!@$%^&*-_)',
  })
  newPassword!: string;
}


//Reset Password Request DTO
export class AdminResetPasswordRequestDto {
  @ApiProperty({ type: String, required: true, example: 'root@snapp.com', description: 'Admin email for reset' })
  @IsEmail() email!: string;
}

export class AdminResetPasswordConfirmDto {
  @ApiProperty({ type: String, required: true, example: 'token123', description: 'Reset token' })
  @IsString() token!: string;

  @ApiProperty({ type: String, required: true, example: 'NewPass@123', description: 'New password' })
  @IsString()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*\-_]).{8,32}$/, {
    message: 'New password must be 8-32 chars, include uppercase, lowercase, number, and symbol (#?!@$%^&*-_)',
  })
  newPassword!: string;
}
