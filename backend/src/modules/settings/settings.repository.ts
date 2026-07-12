import prisma from '../../config/prisma';
import { CategoryType } from '@prisma/client';

export class SettingsRepository {
  // Config
  async getSystemConfig() {
    return prisma.systemConfig.findUnique({
      where: { id: 'singleton' },
    });
  }

  async updateSystemConfig(data: any) {
    return prisma.systemConfig.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    });
  }

  // Departments
  async getAllDepartments() {
    return prisma.department.findMany({
      include: {
        parentDepartment: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findDepartmentById(id: string) {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  async createDepartment(data: { name: string; code: string; head?: string; parentDepartmentId?: string }) {
    return prisma.department.create({
      data: {
        name: data.name,
        code: data.code,
        head: data.head || null,
        parentDepartmentId: data.parentDepartmentId || null,
        status: 'ACTIVE',
      },
    });
  }

  async updateDepartment(id: string, data: { name?: string; code?: string; head?: string; parentDepartmentId?: string; status?: string; employeeCount?: number }) {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  async deleteDepartment(id: string) {
    // Soft-delete: update status to INACTIVE
    return prisma.department.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  // Categories
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: { name: string; type: CategoryType }) {
    return prisma.category.create({
      data: {
        name: data.name,
        type: data.type,
        status: 'ACTIVE',
      },
    });
  }

  async updateCategory(id: string, data: { name?: string; type?: CategoryType; status?: string }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }
}
