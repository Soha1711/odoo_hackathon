import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository, CreateUserDto } from './auth.repository';
import { env } from '../../config/environment';
import { HttpError } from '../../middleware/error.middleware';

export class AuthService {
  private authRepository = new AuthRepository();

  async register(dto: CreateUserDto) {
    const existing = await this.authRepository.findByEmail(dto.email);
    if (existing) {
      throw new HttpError(400, 'A user with this email address already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.passwordHash, saltRounds);

    const user = await this.authRepository.createUser({
      ...dto,
      passwordHash,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async login(email: string, passwordHash: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getUserById(id: string) {
    const user = await this.authRepository.findById(id);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    return user;
  }

  private generateToken(user: any): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId,
    };
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }
}
