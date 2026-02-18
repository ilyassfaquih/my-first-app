import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  /**
   * Create a new user.
   * Throws ConflictException if email already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(`User with email "${createUserDto.email}" already exists`);
    }

    const user = this.usersRepository.create(createUserDto);
    const saved = await this.usersRepository.save(user);
    this.logger.log(`Created user #${saved.id}`);
    return saved;
  }

  /** Retrieve all users. */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Retrieve a single user by ID.
   * Throws NotFoundException if not found.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  /**
   * Update an existing user.
   * Throws NotFoundException if not found.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // reuse — throws if not found

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    this.logger.log(`Updated user #${id}`);
    return updated;
  }

  /**
   * Remove a user by ID.
   * Throws NotFoundException if not found.
   */
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id); // throws if not found
    await this.usersRepository.remove(user);
    this.logger.log(`Removed user #${id}`);
  }
}