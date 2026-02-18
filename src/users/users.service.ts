import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  // Constructor Injection (بحال Autowired)
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, // Repository واجدة بحال JpaRepository
  ) { }

  create(createUserDto: CreateUserDto) {
    // save() بحال ديال Spring Data
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    // find() بحال findAll()
    return this.usersRepository.find();
  }

  findOne(id: number) {
    // findOneBy بحال findById
    return this.usersRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // update() بحال save() مع ID في Spring
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number) {
    // delete() بحال deleteById() في Spring
    await this.usersRepository.delete(id);
  }
}