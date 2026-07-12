import { SettingsRepository } from './settings.repository';
import { HttpError } from '../../middleware/error.middleware';
import { CategoryType } from '@prisma/client';

export class SettingsService {
  private repository = new SettingsRepository();

  // Config
  async getConfig() {
    let config = await this.repository.getSystemConfig();
    if (!config) {
      config = await this.repository.updateSystemConfig({});
    }
    return config;
  }

  async updateConfig(data: any) {
    return this.repository.updateSystemConfig(data);
  }

  // Departments
  async getDepartments() {
    return this.repository.getAllDepartments();
  }

  async addDepartment(data: { name: string; code: string; head?: string; parentDepartmentId?: string }) {
    // Avoid circular department relationships
    if (data.parentDepartmentId) {
      const parent = await this.repository.findDepartmentById(data.parentDepartmentId);
      if (!parent) {
        throw new HttpError(400, 'Parent department not found');
      }
    }
    return this.repository.createDepartment(data);
  }

  async editDepartment(id: string, data: any) {
    const existing = await this.repository.findDepartmentById(id);
    if (!existing) {
      throw new HttpError(404, 'Department not found');
    }
    if (data.parentDepartmentId === id) {
      throw new HttpError(400, 'A department cannot be its own parent');
    }
    return this.repository.updateDepartment(id, data);
  }

  async removeDepartment(id: string) {
    const existing = await this.repository.findDepartmentById(id);
    if (!existing) {
      throw new HttpError(404, 'Department not found');
    }
    return this.repository.deleteDepartment(id);
  }

  // Categories
  async getCategories() {
    return this.repository.getAllCategories();
  }

  async addCategory(data: { name: string; type: CategoryType }) {
    return this.repository.createCategory(data);
  }

  async editCategory(id: string, data: any) {
    return this.repository.updateCategory(id, data);
  }
}
