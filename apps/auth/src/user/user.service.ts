import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
// import { User } from './graphql'; // Assuming this was for GraphQL, may need to be re-evaluated if GQL types are different

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserInput: CreateUserDto): Promise<User> {
    await this.validateCreateUserDto(createUserInput);
    const passwordHashed: string = await bcrypt.hash(
      createUserInput.password,
      12,
    );
    return await this.userRepository.create({
      ...createUserInput,
      password: passwordHashed,
    });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll({});
  }

  async findOne(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ id });
  }

  async update(id: string, updateUserInput: UpdateUserDto): Promise<User | null> {
    // The partial entity for TypeORM update doesn't use $set
    return await this.userRepository.findOneAndUpdate(
      { id },
      updateUserInput,
    );
  }

  async remove(id: string): Promise<User | null> {
    return await this.userRepository.findOneAndDelete({ id });
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      throw new UnauthorizedException('User or password is incorrect');
    }
    return user;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new UnprocessableEntityException('Email already exists');
      }
    } catch (e) {
      // If findOne throws NotFoundException, it means email is not taken, which is good.
      if (e instanceof NotFoundException) {
        return;
      }
      // Re-throw other errors
      throw e;
    }
  }
}
