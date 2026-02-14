import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsString, IsEnum, IsDate } from 'class-validator';

//Trip Status Enum

export enum TripStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

//Trip Model

export class TripModel {
  @ApiProperty({ type: String, description: 'Unique trip ID' })
  @IsString()
  id!: string;

  @ApiProperty({ type: String, required: true, description: 'Passenger ID' })
  @IsString()
  passengerId!: string;

  @ApiProperty({ type: String, required: true, description: 'Driver ID' })
  @IsString()
  driverId!: string;

  @ApiProperty({ type: Number, required: true, example: 35.6892, description: 'Origin latitude' })
  @IsNumber()
  originLat!: number;

  @ApiProperty({ type: Number, required: true, example: 51.389, description: 'Origin longitude' })
  @IsNumber()
  originLng!: number;

  @ApiProperty({ type: Number, required: true, example: 35.732, description: 'Destination latitude' })
  @IsNumber()
  destinationLat!: number;

  @ApiProperty({ type: Number, required: true, example: 51.422, description: 'Destination longitude' })
  @IsNumber()
  destinationLng!: number;

  @ApiProperty({ type: String, enum: TripStatus, description: 'Current status of the trip' })
  @IsEnum(TripStatus)
  status!: TripStatus;

  @ApiProperty({ type: Number, required: false, description: 'Trip distance in kilometers' })
  @IsOptional() @IsNumber() distance?: number;

  @ApiProperty({ type: Number, required: false, description: 'Estimated duration in minutes' })
  @IsOptional() @IsNumber() duration?: number;

  @ApiProperty({ type: Date, required: false, description: 'Trip creation date' })
  @IsOptional() @IsDate() createdAt?: Date;

  @ApiProperty({ type: Date, required: false, description: 'Trip last update date' })
  @IsOptional() @IsDate() updatedAt?: Date;
}


//Create Trip DTO

export class CreateTripInputDto {
  @ApiProperty({ example: 35.6892, description: 'Origin latitude' })
  @IsNumber() @IsNotEmpty() originLat!: number;

  @ApiProperty({ example: 51.389, description: 'Origin longitude' })
  @IsNumber() @IsNotEmpty() originLng!: number;

  @ApiProperty({ example: 35.732, description: 'Destination latitude' })
  @IsNumber() @IsNotEmpty() destinationLat!: number;

  @ApiProperty({ example: 51.422, description: 'Destination longitude' })
  @IsNumber() @IsNotEmpty() destinationLng!: number;

  @ApiProperty({ type: String, required: true, description: 'Passenger ID' })
  @IsString() @IsNotEmpty() passengerId!: string;

  @ApiProperty({ type: String, required: true, description: 'Driver ID' })
  @IsString() @IsNotEmpty() driverId!: string;
}


//Trip Output DTO

export class TripOutputDto {
  @ApiProperty({ type: TripModel, description: 'Trip details' })
  trip!: TripModel;
}
