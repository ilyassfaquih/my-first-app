import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockUser: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepository = {
  create: jest.fn().mockReturnValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockResolvedValue([mockUser]),
  findOneBy: jest.fn().mockResolvedValue(mockUser),
  remove: jest.fn().mockResolvedValue(mockUser),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: { ...mockRepository },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ──── CREATE ────────────────────────────────────────────
  describe('create', () => {
    it('should create a user successfully', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);

      const result = await service.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockUser);

      await expect(
        service.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ──── FIND ALL ──────────────────────────────────────────
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  // ──── FIND ONE ──────────────────────────────────────────
  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // ──── UPDATE ────────────────────────────────────────────
  describe('update', () => {
    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, firstName: 'Jane' };
      jest.spyOn(repository, 'save').mockResolvedValueOnce(updatedUser);

      const result = await service.update(1, { firstName: 'Jane' });
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.update(999, { firstName: 'Jane' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ──── REMOVE ────────────────────────────────────────────
  describe('remove', () => {
    it('should remove a user successfully', async () => {
      await service.remove(1);
      expect(repository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
