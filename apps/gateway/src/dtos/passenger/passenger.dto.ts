import { ApiProperty } from '@nestjs/swagger';
import {
    IsOptional, IsString, IsBoolean, IsDate, IsPhoneNumber, IsNotEmpty, Length
} from 'class-validator';


//Base Passenger Model

export class PassengerModel {
    @ApiProperty({ type: String, description: 'Unique passenger ID' })
    @IsString()
    id!: string;

    @ApiProperty({ type: String, example: '+989121234567', description: 'Passenger phone number' })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;

    @ApiProperty({ type: String, required: false, description: 'Passenger email address' })
    @IsOptional() @IsString() email?: string;

    @ApiProperty({ type: String, required: false, description: 'Passenger first name' })
    @IsOptional() @IsString() firstName?: string;

    @ApiProperty({ type: String, required: false, description: 'Passenger last name' })
    @IsOptional() @IsString() lastName?: string;

    @ApiProperty({ type: Boolean, default: true, description: 'Whether passenger is active' })
    @IsBoolean() isActive!: boolean;

    @ApiProperty({ type: Boolean, default: false, description: 'Whether passenger is verified' })
    @IsBoolean() isVerified!: boolean;

    @ApiProperty({ type: Date, description: 'Record creation date' })
    @IsDate() createdAt!: Date;

    @ApiProperty({ type: Date, description: 'Record last update date' })
    @IsDate() updatedAt!: Date;
}


//Passenger Session Model
export class PassengerSessionModel {
    @ApiProperty({ type: String, description: 'Session ID' })
    @IsString()
    id!: string;

    @ApiProperty({ type: String, description: 'Associated passenger ID' })
    @IsString()
    passengerId!: string;

    @ApiProperty({ type: Date, description: 'Refresh token expiration date' })
    @IsDate()
    refreshExpiresAt!: Date;

    @ApiProperty({ type: Date, description: 'Session creation date' })
    @IsDate()
    createdAt!: Date;

    @ApiProperty({ type: Date, description: 'Session last update date' })
    @IsDate()
    updatedAt!: Date;
}


//OTP Request DTO

export class PassengerRequestOtpInputDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '+989121234567',
        description: 'Passenger phone number to request OTP',
    })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;
}


//OTP Verify DTO
export class PassengerVerifyOtpInputDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '+989121234567',
        description: 'Passenger phone number',
    })
    @IsPhoneNumber('IR', { message: 'Enter a valid phone number' })
    phone!: string;

    @ApiProperty({ type: String, required: true, example: '1234', description: 'OTP code' })
    @IsString()
    @IsNotEmpty()
    @Length(4, 6)
    otp!: string;
}


//Passenger Profile DTO
export class GetPassengerProfileOutputDto {
    @ApiProperty({ type: PassengerModel, required: false, description: 'Passenger profile data' })
    @IsOptional()
    profile?: PassengerModel;

    @ApiProperty({ type: PassengerSessionModel, required: false, description: 'Passenger session data' })
    @IsOptional()
    session?: PassengerSessionModel;
}
