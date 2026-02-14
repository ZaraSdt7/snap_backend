import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional, IsString, IsBoolean, IsDate, IsPhoneNumber, Length, IsNotEmpty
} from 'class-validator';



//Base Driver Model
export class DriverModel {
    @ApiProperty({ type: String, required: false, description: 'Unique driver ID' })
    @IsOptional() @IsString() id?: string;

    @ApiProperty({ type: String, required: true, description: 'Driver phone number' })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;

    @ApiProperty({ type: String, required: false, description: 'Driver email address' })
    @IsOptional() @IsString() email?: string;

    @ApiProperty({ type: String, required: false, description: 'Driver password' })
    @IsOptional() @IsString() password?: string;

    @ApiProperty({ type: String, required: false, description: 'Driver first name' })
    @IsOptional() @IsString() firstName?: string;

    @ApiProperty({ type: String, required: false, description: 'Driver last name' })
    @IsOptional() @IsString() lastName?: string;

    @ApiProperty({ type: String, required: false, description: 'Car model' })
    @IsOptional() @IsString() carModel?: string;

    @ApiProperty({ type: String, required: false, description: 'Car color' })
    @IsOptional() @IsString() carColor?: string;

    @ApiProperty({ type: String, required: false, description: 'Car plate number' })
    @IsOptional() @IsString() plateNumber?: string;

    @ApiProperty({ type: Boolean, required: false, description: 'Whether driver is active' })
    @IsOptional() @IsBoolean() isActive?: boolean;

    @ApiProperty({ type: Boolean, required: false, description: 'Whether driver is online' })
    @IsOptional() @IsBoolean() isOnline?: boolean;

    @ApiProperty({ type: Boolean, required: false, description: 'Whether driver is verified' })
    @IsOptional() @IsBoolean() isVerified?: boolean;

    @ApiProperty({ type: Date, required: false, description: 'Record creation date' })
    @IsOptional() @IsDate() createdAt?: Date;

    @ApiProperty({ type: Date, required: false, description: 'Record last update date' })
    @IsOptional() @IsDate() updatedAt?: Date;
}


//Driver Session Model
export class DriverSessionModel {
    @ApiProperty({ type: String, required: false, description: 'Session ID' })
    @IsOptional() @IsString() id?: string;

    @ApiProperty({ type: String, required: false, description: 'Associated driver ID' })
    @IsOptional() @IsString() driverId?: string;

    @ApiProperty({ type: Date, required: false, description: 'Refresh token expiration date' })
    @IsOptional() @IsDate() refreshExpiresAt?: Date;

    @ApiProperty({ type: Date, required: false, description: 'Session creation date' })
    @IsOptional() @IsDate() createdAt?: Date;

    @ApiProperty({ type: Date, required: false, description: 'Session last update date' })
    @IsOptional() @IsDate() updatedAt?: Date;
}

//Request OTP DTO
export class DriverRequestOtpInputDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '+989121234567',
        description: 'Driver phone number to request OTP',
    })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;
}


//Verify OTP DTO
export class DriverVerifyOtpInputDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '+989121234567',
        description: 'Driver phone number',
    })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;

    @ApiProperty({ type: String, required: true, example: '1234', description: 'OTP code' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 6)
    otp!: string;
}


//Driver Profile DTO
export class GetDriverProfileOutputDto {
    @ApiProperty({ type: DriverModel, required: false, description: 'Driver profile data' })
    @IsOptional()
    profile?: DriverModel;

    @ApiProperty({ type: DriverSessionModel, required: false, description: 'Driver session data' })
    @IsOptional()
    session?: DriverSessionModel;
}
