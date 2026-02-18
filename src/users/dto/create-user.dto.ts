import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    firstName: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName: string;

    @ApiProperty({ description: 'User email address', example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ description: 'Whether the user is active', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
