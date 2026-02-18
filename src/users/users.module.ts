import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import this
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';   // Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <-- ضيف هاد السطر
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }