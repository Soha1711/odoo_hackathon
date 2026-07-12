import { PrismaClient, Role, CategoryType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in order of dependencies to avoid foreign key violations
  await prisma.systemConfig.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.rewardRedemption.deleteMany().catch(() => {});
  await prisma.departmentScore.deleteMany().catch(() => {});
  await prisma.complianceIssue.deleteMany().catch(() => {});
  await prisma.audit.deleteMany().catch(() => {});
  await prisma.policyAcknowledgment.deleteMany().catch(() => {});
  await prisma.challengeParticipation.deleteMany().catch(() => {});
  await prisma.employeeParticipation.deleteMany().catch(() => {});
  await prisma.carbonTransaction.deleteMany().catch(() => {});
  await prisma.reward.deleteMany().catch(() => {});
  await prisma.badge.deleteMany().catch(() => {});
  await prisma.esgPolicy.deleteMany().catch(() => {});
  await prisma.environmentalGoal.deleteMany().catch(() => {});
  await prisma.productEsgProfile.deleteMany().catch(() => {});
  await prisma.emissionFactor.deleteMany().catch(() => {});
  await prisma.csrActivity.deleteMany().catch(() => {});
  await prisma.challenge.deleteMany().catch(() => {});
  await prisma.category.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  await prisma.department.deleteMany().catch(() => {});

  console.log('Seeding System Config...');
  await prisma.systemConfig.create({
    data: {
      id: 'singleton',
      enableAutoEmission: true,
      requireEvidenceCsr: true,
      autoAwardBadges: true,
      pushAlertCompliance: true,
      environmentalWeight: 0.40,
      socialWeight: 0.30,
      governanceWeight: 0.30,
    },
  });

  console.log('Seeding Departments...');
  const logistics = await prisma.department.create({
    data: { name: 'Logistics', code: 'LOG', head: 'Alice Cooper', employeeCount: 15, status: 'ACTIVE' },
  });
  await prisma.department.create({
    data: { name: 'Manufacturing', code: 'MFG', head: 'Bob Dylan', employeeCount: 45, status: 'ACTIVE' },
  });
  const corporate = await prisma.department.create({
    data: { name: 'Corporate', code: 'CORP', head: 'Carol King', employeeCount: 10, status: 'ACTIVE' },
  });
  await prisma.department.create({
    data: { name: 'HR', code: 'HR', head: 'David Bowie', employeeCount: 5, status: 'ACTIVE' },
  });
  await prisma.department.create({
    data: { name: 'Finance', code: 'FIN', head: 'Eva Cassidy', employeeCount: 8, status: 'ACTIVE' },
  });

  console.log('Seeding Categories...');
  await prisma.category.create({
    data: { name: 'CSR Activity', type: CategoryType.CSR_ACTIVITY, status: 'ACTIVE' },
  });
  await prisma.category.create({
    data: { name: 'Sustainability Challenge', type: CategoryType.CHALLENGE, status: 'ACTIVE' },
  });

  console.log('Seeding Emission Factors...');
  await prisma.emissionFactor.create({
    data: { name: 'Purchased Electricity (Grid)', factor: 0.38, unit: 'kWh', source: 'EPA 2023' },
  });
  await prisma.emissionFactor.create({
    data: { name: 'Company Facilities (Natural Gas)', factor: 2.02, unit: 'kWh', source: 'EPA 2023' },
  });
  await prisma.emissionFactor.create({
    data: { name: 'Employee Business Travel (Car)', factor: 0.12, unit: 'km', source: 'DEFRA 2023' },
  });
  await prisma.emissionFactor.create({
    data: { name: 'Waste Disposal (Landfill)', factor: 0.45, unit: 'kg', source: 'DEFRA 2023' },
  });

  console.log('Seeding Product ESG Profiles...');
  await prisma.productEsgProfile.createMany({
    data: [
      { productId: 'PROD-ECOBOX', productName: 'EcoBox-100 Recycled Box', carbonFootprint: 0.15, recycledContentPercentage: 85.0, waterFootprint: 2.5, status: 'ACTIVE' },
      { productId: 'PROD-SOLAR', productName: 'Solar Charger X', carbonFootprint: 12.4, recycledContentPercentage: 40.0, waterFootprint: 15.0, status: 'ACTIVE' },
    ],
  });

  console.log('Seeding Badges...');
  await prisma.badge.createMany({
    data: [
      { name: 'Green Pioneer', description: 'Earn 100 XP', unlockRule: JSON.stringify({ minXp: 100 }), icon: 'Leaf' },
      { name: 'Carbon Tamer', description: 'Log 5 carbon transactions', unlockRule: JSON.stringify({ minCarbonLogs: 5 }), icon: 'FlameKindling' },
      { name: 'Sustainability Champion', description: 'Complete 3 challenges', unlockRule: JSON.stringify({ minCompletedChallenges: 3 }), icon: 'Trophy' },
      { name: 'Green Hero', description: 'Earn 500 XP', unlockRule: JSON.stringify({ minXp: 500 }), icon: 'Crown' },
    ],
  });

  console.log('Seeding Rewards...');
  await prisma.reward.createMany({
    data: [
      { name: 'Eco Coffee Mug', description: 'Reusable bamboo fiber coffee cup', pointsRequired: 150, stock: 50, status: 'ACTIVE' },
      { name: 'Solar Charger', description: 'Portable solar panels', pointsRequired: 500, stock: 10, status: 'ACTIVE' },
      { name: 'Tree Plantation Certificate', description: 'We plant a tree in your name', pointsRequired: 100, stock: 1000, status: 'ACTIVE' },
    ],
  });

  console.log('Seeding Users...');
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('admin123', saltRounds);
  const managerPasswordHash = await bcrypt.hash('manager123', saltRounds);
  const employeePasswordHash = await bcrypt.hash('employee123', saltRounds);

  await prisma.user.create({
    data: {
      email: 'admin@ecosphere.com',
      passwordHash: adminPasswordHash,
      firstName: 'System',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: 'manager@ecosphere.com',
      passwordHash: managerPasswordHash,
      firstName: 'Sustainability',
      lastName: 'Manager',
      role: Role.MANAGER,
      departmentId: logistics.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'employee@ecosphere.com',
      passwordHash: employeePasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      role: Role.CONTRIBUTOR,
      departmentId: corporate.id,
      xpBalance: 120,
      pointsBalance: 200,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
