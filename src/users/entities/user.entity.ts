import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // بحال @Entity في Java
export class User {
    @PrimaryGeneratedColumn() // بحال @Id @GeneratedValue
    id: number;

    @Column() // بحال @Column
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;
}