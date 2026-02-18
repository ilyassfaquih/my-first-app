import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
    @ApiProperty({ description: 'Auto-generated user ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'User first name', example: 'John' })
    @Column({ length: 100 })
    firstName: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @Column({ length: 100 })
    lastName: string;

    @ApiProperty({ description: 'User email address', example: 'john@example.com' })
    @Column({ unique: true, length: 255 })
    email: string;

    @ApiProperty({ description: 'Whether the user is active', default: true })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Record creation timestamp' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Record last update timestamp' })
    @UpdateDateColumn()
    updatedAt: Date;
}