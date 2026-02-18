import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUsersService = {
  create: jest.fn().mockResolvedValue(mockUser),
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, firstName: 'Jane' }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: { ...mockUsersService },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const result = await controller.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result).toEqual(mockUser);
      expect(service.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(new NotFoundException());
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const result = await controller.update(1, { firstName: 'Jane' });
      expect(result.firstName).toBe('Jane');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
