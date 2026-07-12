import prisma from '../../config/prisma';
import { Role } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  departmentId?: string;
}

export class AuthRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { department: true },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { department: true },
    });
  }

  async createUser(dto: CreateUserDto) {
    return prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: Role.CONTRIBUTOR,
        departmentId: dto.departmentId || null,
      },
      include: { department: true },
    });
  }

  async updateUserBalance(userId: string, xpDelta: number, pointsDelta: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        xpBalance: { increment: xpDelta },
        pointsBalance: { increment: pointsDelta },
      },
    });
  }
}
