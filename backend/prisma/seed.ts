import { PrismaClient, Role, CategoryType, TransactionSourceType, Difficulty, ChallengeStatus, ApprovalStatus, ComplianceSeverity, ComplianceStatus, AuditOutcome } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function monthsAgo(n: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateInMonth(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day, 10, 0, 0);
}

async function main() {
  console.log('Clearing existing data...');
  await prisma.systemConfig.deleteMany().catch(() => {});
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.rewardRedemption.deleteMany().catch(() => {});
  await prisma.userBadge.deleteMany().catch(() => {});
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

  // ─── System Config ───
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

  // ─── Departments (6) ───
  console.log('Seeding Departments...');
  const depts = await Promise.all([
    prisma.department.create({ data: { name: 'Logistics', code: 'LOG', head: 'Alice Cooper', employeeCount: 18, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Manufacturing', code: 'MFG', head: 'Bob Dylan', employeeCount: 42, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Corporate', code: 'CORP', head: 'Carol King', employeeCount: 12, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Human Resources', code: 'HR', head: 'David Bowie', employeeCount: 8, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Finance', code: 'FIN', head: 'Eva Cassidy', employeeCount: 10, status: 'ACTIVE' } }),
    prisma.department.create({ data: { name: 'Research & Development', code: 'RD', head: 'Frank Zappa', employeeCount: 15, status: 'ACTIVE' } }),
  ]);
  const [logistics, manufacturing, corporate, hr, finance, rnd] = depts;

  // ─── Categories ───
  console.log('Seeding Categories...');
  const [csrCat, challengeCat] = await Promise.all([
    prisma.category.create({ data: { name: 'CSR Activity', type: CategoryType.CSR_ACTIVITY, status: 'ACTIVE' } }),
    prisma.category.create({ data: { name: 'Sustainability Challenge', type: CategoryType.CHALLENGE, status: 'ACTIVE' } }),
  ]);

  // ─── Emission Factors (15) ───
  console.log('Seeding Emission Factors (15)...');
  const factors = await Promise.all([
    prisma.emissionFactor.create({ data: { name: 'Purchased Electricity (Grid)', factor: 0.38, unit: 'kWh', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Natural Gas Heating', factor: 2.02, unit: 'kWh', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Diesel Fleet (Trucks)', factor: 2.68, unit: 'liter', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Employee Business Travel (Car)', factor: 0.12, unit: 'km', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Waste Disposal (Landfill)', factor: 0.45, unit: 'kg', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Water Consumption', factor: 0.0003, unit: 'liter', source: 'IPCC 2022' } }),
    prisma.emissionFactor.create({ data: { name: 'Air Freight Transport', factor: 0.602, unit: 'kg', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Rail Freight (Diesel)', factor: 0.028, unit: 'tonne-km', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Refrigerant Leak (R-410A)', factor: 2088.0, unit: 'kg', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Employee Commute (Bus)', factor: 0.089, unit: 'km', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'LPG Heating', factor: 1.51, unit: 'kWh', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Jet Fuel (Corporate Flights)', factor: 2.52, unit: 'kg', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Paper & Cardboard Recycling', factor: -0.68, unit: 'kg', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Steel Manufacturing', factor: 1.85, unit: 'kg', source: 'IPCC 2022' } }),
    prisma.emissionFactor.create({ data: { name: 'Aluminum Production', factor: 8.14, unit: 'kg', source: 'IPCC 2022' } }),
  ]);

  // ─── Product ESG Profiles (4) ───
  console.log('Seeding Product ESG Profiles...');
  await prisma.productEsgProfile.createMany({
    data: [
      { productId: 'PROD-ECOBOX', productName: 'EcoBox-100 Recycled Box', carbonFootprint: 0.15, recycledContentPercentage: 85.0, waterFootprint: 2.5, status: 'ACTIVE' },
      { productId: 'PROD-SOLAR', productName: 'Solar Charger X200', carbonFootprint: 12.4, recycledContentPercentage: 40.0, waterFootprint: 15.0, status: 'ACTIVE' },
      { productId: 'PROD-BIOPACK', productName: 'BioPack Compostable Mailer', carbonFootprint: 0.08, recycledContentPercentage: 95.0, waterFootprint: 1.2, status: 'ACTIVE' },
      { productId: 'PROD-LEDKIT', productName: 'LED Retrofit Kit Pro', carbonFootprint: 5.6, recycledContentPercentage: 30.0, waterFootprint: 8.0, status: 'ACTIVE' },
    ],
  });

  // ─── Badges (30) ───
  console.log('Seeding Badges (30)...');
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: 'Green Pioneer', description: 'Earn 100 XP in sustainability actions', unlockRule: JSON.stringify({ minXp: 100 }), icon: 'Leaf' } }),
    prisma.badge.create({ data: { name: 'Carbon Tamer', description: 'Log 5 or more carbon transactions', unlockRule: JSON.stringify({ minCarbonLogs: 5 }), icon: 'Flame' } }),
    prisma.badge.create({ data: { name: 'Sustainability Champion', description: 'Complete 3 sustainability challenges', unlockRule: JSON.stringify({ minCompletedChallenges: 3 }), icon: 'Trophy' } }),
    prisma.badge.create({ data: { name: 'Green Hero', description: 'Earn 500 XP total', unlockRule: JSON.stringify({ minXp: 500 }), icon: 'Crown' } }),
    prisma.badge.create({ data: { name: 'Policy Guardian', description: 'Acknowledge all active ESG policies', unlockRule: JSON.stringify({ allPoliciesAcknowledged: true }), icon: 'Shield' } }),
    prisma.badge.create({ data: { name: 'CSR Star', description: 'Participate in 3 or more CSR activities', unlockRule: JSON.stringify({ minCsrParticipations: 3 }), icon: 'Star' } }),
    prisma.badge.create({ data: { name: 'Zero Waste Warrior', description: 'Achieve zero waste for 7 consecutive days', unlockRule: JSON.stringify({ minZeroWasteDays: 7 }), icon: 'Recycle' } }),
    prisma.badge.create({ data: { name: 'Eco Commuter', description: 'Use green transportation for 20 work days', unlockRule: JSON.stringify({ minGreenCommuteDays: 20 }), icon: 'Bike' } }),
    prisma.badge.create({ data: { name: 'Energy Saver', description: 'Reduce personal energy use by 20%', unlockRule: JSON.stringify({ energyReductionPct: 20 }), icon: 'Zap' } }),
    prisma.badge.create({ data: { name: 'Water Champion', description: 'Log 10 water conservation actions', unlockRule: JSON.stringify({ minWaterActions: 10 }), icon: 'Droplets' } }),
    prisma.badge.create({ data: { name: 'Innovation Spark', description: 'Submit 2 green innovation proposals', unlockRule: JSON.stringify({ minInnovations: 2 }), icon: 'Lightbulb' } }),
    prisma.badge.create({ data: { name: 'Audit Ace', description: 'Pass 3 department audits with 90+ score', unlockRule: JSON.stringify({ minAuditScore90: 3 }), icon: 'ClipboardCheck' } }),
    prisma.badge.create({ data: { name: 'Social Butterfly', description: 'Participate in 5 social events', unlockRule: JSON.stringify({ minSocialEvents: 5 }), icon: 'Users' } }),
    prisma.badge.create({ data: { name: 'Data Driven', description: 'Export 5 compliance reports', unlockRule: JSON.stringify({ minReportExports: 5 }), icon: 'BarChart3' } }),
    prisma.badge.create({ data: { name: 'Compliance Rock', description: 'Resolve 5 compliance issues', unlockRule: JSON.stringify({ minIssuesResolved: 5 }), icon: 'CheckCircle' } }),
    prisma.badge.create({ data: { name: 'Carbon Negative', description: 'Achieve net-negative carbon for a month', unlockRule: JSON.stringify({ netNegativeMonth: true }), icon: 'TrendingDown' } }),
    prisma.badge.create({ data: { name: 'Team Player', description: 'Collaborate on 10 team challenges', unlockRule: JSON.stringify({ minTeamChallenges: 10 }), icon: 'Users' } }),
    prisma.badge.create({ data: { name: 'Policy Expert', description: 'Acknowledge 10 ESG policies', unlockRule: JSON.stringify({ minPolicyAcks: 10 }), icon: 'BookOpen' } }),
    prisma.badge.create({ data: { name: 'Green Machine', description: 'Log 50 carbon transactions', unlockRule: JSON.stringify({ minCarbonLogs: 50 }), icon: 'Cpu' } }),
    prisma.badge.create({ data: { name: 'Safety First', description: 'Complete all safety training modules', unlockRule: JSON.stringify({ allSafetyTraining: true }), icon: 'HardHat' } }),
    prisma.badge.create({ data: { name: 'Community Leader', description: 'Organize 3 community events', unlockRule: JSON.stringify({ minCommunityEvents: 3 }), icon: 'Megaphone' } }),
    prisma.badge.create({ data: { name: 'Waste Watcher', description: 'Track waste reduction for 30 days', unlockRule: JSON.stringify({ minWasteTrackingDays: 30 }), icon: 'Trash2' } }),
    prisma.badge.create({ data: { name: 'Renewable Advocate', description: 'Support 5 renewable energy initiatives', unlockRule: JSON.stringify({ minRenewableInitiatives: 5 }), icon: 'Sun' } }),
    prisma.badge.create({ data: { name: 'ESG Scholar', description: 'Complete ESG fundamentals certification', unlockRule: JSON.stringify({ esgCertification: true }), icon: 'GraduationCap' } }),
    prisma.badge.create({ data: { name: 'Planet Protector', description: 'Plant 20 trees in a single year', unlockRule: JSON.stringify({ minTreesPlanted: 20 }), icon: 'TreePine' } }),
    prisma.badge.create({ data: { name: 'Supply Chain Sage', description: 'Audit 10 suppliers for sustainability', unlockRule: JSON.stringify({ minSupplierAudits: 10 }), icon: 'Link' } }),
    prisma.badge.create({ data: { name: 'Carbon Analyst', description: 'Generate 10 carbon reports', unlockRule: JSON.stringify({ minCarbonReports: 10 }), icon: 'FileBarChart' } }),
    prisma.badge.create({ data: { name: 'Green Volunteer', description: 'Complete 15 volunteer hours', unlockRule: JSON.stringify({ minVolunteerHours: 15 }), icon: 'HandHelping' } }),
    prisma.badge.create({ data: { name: 'Eco Executive', description: 'Maintain 80+ ESG score for 6 months', unlockRule: JSON.stringify({ minEsgScore80Months: 6 }), icon: 'Award' } }),
    prisma.badge.create({ data: { name: 'Circular Economy Pioneer', description: 'Implement 3 circular economy practices', unlockRule: JSON.stringify({ minCircularPractices: 3 }), icon: 'RefreshCw' } }),
  ]);

  // ─── Rewards (20) ───
  console.log('Seeding Rewards (20)...');
  const rewards = await Promise.all([
    prisma.reward.create({ data: { name: 'Eco Coffee Mug', description: 'Reusable bamboo fiber coffee cup', pointsRequired: 150, stock: 50, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Solar Charger', description: 'Portable foldable solar panels', pointsRequired: 500, stock: 10, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Tree Plantation Certificate', description: 'We plant a tree in your name', pointsRequired: 100, stock: 1000, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Reusable Water Bottle', description: 'Stainless steel insulated bottle', pointsRequired: 200, stock: 30, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Public Transit Voucher', description: '$50 transit pass for eco commuting', pointsRequired: 350, stock: 20, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Eco Desk Plant Kit', description: 'Low-maintenance succulent with recycled pot', pointsRequired: 120, stock: 40, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Bamboo Keyboard', description: 'Wireless keyboard made from sustainable bamboo', pointsRequired: 450, stock: 15, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Organic Lunch Voucher', description: '$25 voucher for organic cafeteria meals', pointsRequired: 180, stock: 60, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Reusable Shopping Bag Set', description: 'Set of 5 organic cotton shopping bags', pointsRequired: 80, stock: 100, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Eco-Friendly Notebook', description: 'Recycled paper notebook with plantable cover', pointsRequired: 60, stock: 80, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Carbon Offset Credit', description: 'Offset 1 tonne of CO2 through verified projects', pointsRequired: 800, stock: 5, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Electric Scooter Rental Pass', description: '1-month free e-scooter rental for commuting', pointsRequired: 600, stock: 8, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Vegan Meal Kit', description: 'Weekly organic vegan meal kit for 2 weeks', pointsRequired: 300, stock: 25, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Rain Barrel', description: 'Collect and reuse rainwater for gardening', pointsRequired: 250, stock: 20, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'CSR Volunteer Day Off', description: 'Extra paid day off for personal volunteering', pointsRequired: 700, stock: 3, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Compost Bin Kit', description: 'Indoor composting system for food waste', pointsRequired: 220, stock: 35, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Energy Monitor Device', description: 'Smart plug to track household energy use', pointsRequired: 400, stock: 12, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Hemp Backpack', description: 'Durable backpack made from sustainable hemp', pointsRequired: 380, stock: 18, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Green Book Bundle', description: 'Collection of 3 sustainability best-sellers', pointsRequired: 160, stock: 45, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Donation to Charity', description: '$50 donation to environmental charity of choice', pointsRequired: 550, stock: 100, status: 'ACTIVE' } }),
  ]);

  // ─── Users (50) ───
  console.log('Seeding Users (50)...');
  const salt = 10;
  const adminHash = await bcrypt.hash('admin123', salt);
  const managerHash = await bcrypt.hash('manager123', salt);
  const empHash = await bcrypt.hash('employee123', salt);

  const firstNames = [
    'Alice', 'Bob', 'Carol', 'David', 'Eva', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack',
    'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Peter', 'Quinn', 'Rachel', 'Sam', 'Tina',
    'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zane', 'Aisha', 'Brandon', 'Clara', 'Derek',
    'Emma', 'Felix', 'Hannah', 'Ivan', 'Julia', 'Kevin', 'Luna', 'Marco', 'Nina', 'Oscar',
    'Priya', 'Ravi', 'Sofia', 'Tyler', 'Vera', 'Will', 'Xena', 'Yusuf', 'Zara', 'Amir',
  ];
  const lastNames = [
    'Cooper', 'Dylan', 'King', 'Bowie', 'Cassidy', 'Zappa', 'Hawking', 'Curie', 'Lovelace', 'Turing',
    'Patel', 'Nguyen', 'Chen', 'Mueller', 'Silva', 'Rossi', 'Garcia', 'Kim', 'Tanaka', 'Ali',
    'Okafor', 'Petrov', 'Johansson', 'Santos', 'Yamamoto', 'Novak', 'Andersen', 'Ferreira', 'Watanabe', 'Cohen',
    'Schmidt', 'Larsen', 'Moreau', 'Dubois', 'Ivanov', 'Kowalski', 'Bianchi', 'Svensson', 'Virtanen', 'Berg',
    'Hoffman', 'Reyes', 'Cho', 'Aoki', 'Eriksen', 'Balaji', 'Kovacs', 'Aarons', 'Fadel', 'Morales',
  ];

  const userCreates: Promise<any>[] = [];
  const userNames: { first: string; last: string }[] = [];
  const deptDistribution = [
    logistics, logistics, logistics, logistics, logistics,
    manufacturing, manufacturing, manufacturing, manufacturing, manufacturing,
    corporate, corporate, corporate,
    hr, hr, hr,
    finance, finance, finance,
    rnd, rnd, rnd, rnd,
  ];

  for (let i = 0; i < 50; i++) {
    const first = firstNames[i];
    const last = lastNames[i];
    userNames.push({ first, last });
    const isManager = i < 6;
    const dept = isManager ? depts[i] : deptDistribution[i % deptDistribution.length];

    const xpBase = i < 6 ? 350 + (i * 87) % 400 : 80 + (i * 43) % 300;
    const ptsBase = i < 6 ? 450 + (i * 63) % 500 : 100 + (i * 37) % 400;

    userCreates.push(
      prisma.user.create({
        data: {
          email: i === 0 ? 'admin@ecosphere.com' : i === 1 ? 'manager@ecosphere.com' : `${first.toLowerCase()}.${last.toLowerCase()}@ecosphere.com`,
          passwordHash: i === 0 ? adminHash : i === 1 ? managerHash : empHash,
          firstName: first,
          lastName: last,
          role: i === 0 ? Role.ADMIN : i === 1 ? Role.MANAGER : Role.CONTRIBUTOR,
          departmentId: dept.id,
          xpBalance: xpBase,
          pointsBalance: ptsBase,
        },
      })
    );
  }
  const users = await Promise.all(userCreates);
  console.log(`  → Created ${users.length} users`);

  // ─── Carbon Transactions (150, spanning 12 months) ───
  console.log('Seeding Carbon Transactions (150)...');
  const txCreates: Promise<any>[] = [];
  const sourceTypes: TransactionSourceType[] = [
    TransactionSourceType.PURCHASE, TransactionSourceType.MANUFACTURING,
    TransactionSourceType.EXPENSE, TransactionSourceType.FLEET,
  ];
  const txDepts = [logistics, manufacturing, corporate, finance, rnd];

  let txIndex = 0;
  const now = new Date();
  for (let monthsBack = 11; monthsBack >= 0; monthsBack--) {
    const refDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
    const txYear = refDate.getFullYear();
    const txMonth = refDate.getMonth() + 1;

    const txCount = monthsBack === 0 ? 20 : monthsBack <= 3 ? 15 : 12;
    for (let t = 0; t < txCount; t++) {
      const dept = txDepts[txIndex % txDepts.length];
      const factor = factors[txIndex % factors.length];
      const srcType = sourceTypes[txIndex % sourceTypes.length];
      const baseQty = srcType === TransactionSourceType.FLEET
        ? 100 + (txIndex * 13) % 400
        : 50 + (txIndex * 7) % 300;
      const calculatedEmissions = baseQty * factor.factor;
      const day = 1 + (txIndex % 27);

      txCreates.push(
        prisma.carbonTransaction.create({
          data: {
            sourceType: srcType,
            sourceId: `TX-${String(txYear).slice(2)}${String(txMonth).padStart(2, '0')}-${String(t + 1).padStart(3, '0')}`,
            quantity: baseQty,
            unit: factor.unit,
            emissionFactorId: factor.id,
            calculatedEmissions,
            departmentId: dept.id,
            transactionDate: dateInMonth(txYear, txMonth, day),
          },
        })
      );
      txIndex++;
    }
  }
  await Promise.all(txCreates);
  console.log(`  → Created ${txCreates.length} carbon transactions`);

  // ─── Environmental Goals (12) ───
  console.log('Seeding Environmental Goals (12)...');
  await prisma.environmentalGoal.createMany({
    data: [
      { title: 'Reduce Fleet Emissions 15%', departmentId: logistics.id, targetValue: 5000, currentValue: 3850, unit: 'kg CO2e', deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE },
      { title: 'Zero Waste to Landfill', departmentId: manufacturing.id, targetValue: 100, currentValue: 72, unit: '%', deadline: monthsAgo(-6), status: ChallengeStatus.ACTIVE },
      { title: '100% Renewable Electricity', departmentId: corporate.id, targetValue: 100, currentValue: 45, unit: '%', deadline: monthsAgo(-9), status: ChallengeStatus.ACTIVE },
      { title: 'Water Consumption Reduction', departmentId: rnd.id, targetValue: 20000, currentValue: 14500, unit: 'liters', deadline: monthsAgo(-4), status: ChallengeStatus.ACTIVE },
      { title: 'Paperless Office Initiative', departmentId: hr.id, targetValue: 100, currentValue: 88, unit: '%', deadline: monthsAgo(-2), status: ChallengeStatus.COMPLETED },
      { title: 'Solar Panel Installation', departmentId: manufacturing.id, targetValue: 500, currentValue: 280, unit: 'kW capacity', deadline: monthsAgo(-8), status: ChallengeStatus.ACTIVE },
      { title: 'Green Commute Program', departmentId: finance.id, targetValue: 80, currentValue: 35, unit: '% employees', deadline: monthsAgo(-5), status: ChallengeStatus.ACTIVE },
      { title: 'Supply Chain Carbon Audit', departmentId: logistics.id, targetValue: 50, currentValue: 50, unit: 'suppliers audited', deadline: monthsAgo(-1), status: ChallengeStatus.COMPLETED },
      { title: 'Office Energy Efficiency', departmentId: corporate.id, targetValue: 30, currentValue: 18, unit: '% reduction', deadline: monthsAgo(-7), status: ChallengeStatus.ACTIVE },
      { title: 'Packaging Waste Reduction', departmentId: manufacturing.id, targetValue: 60, currentValue: 42, unit: '% reduction', deadline: monthsAgo(-4), status: ChallengeStatus.ACTIVE },
      { title: 'Green Building Certification', departmentId: rnd.id, targetValue: 100, currentValue: 65, unit: '% compliance', deadline: monthsAgo(-10), status: ChallengeStatus.ACTIVE },
      { title: 'Biodiversity Impact Mitigation', departmentId: logistics.id, targetValue: 25, currentValue: 12, unit: 'projects', deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE },
    ],
  });

  // ─── ESG Policies (20) ───
  console.log('Seeding ESG Policies (20)...');
  const policies = await Promise.all([
    prisma.esgPolicy.create({ data: { title: 'Environmental Sustainability Policy', description: 'Corporate commitment to minimizing environmental impact across all operations.', contentUrl: '/policies/env-sustainability-v2.pdf', version: '2.1.0', effectiveDate: monthsAgo(11), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Anti-Corruption & Ethics Policy', description: 'Zero tolerance for bribery, corruption, and unethical business practices.', contentUrl: '/policies/anti-corruption-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(10), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Diversity & Inclusion Policy', description: 'Commitment to building a diverse, equitable, and inclusive workplace.', contentUrl: '/policies/diversity-inclusion-v1.5.pdf', version: '1.5.0', effectiveDate: monthsAgo(10), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Data Privacy & Protection Policy', description: 'GDPR-aligned data protection standards for employee and customer data.', contentUrl: '/policies/data-privacy-v2.pdf', version: '2.0.0', effectiveDate: monthsAgo(9), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Health & Safety Policy', description: 'Ensuring safe and healthy working conditions for all employees.', contentUrl: '/policies/health-safety-v3.pdf', version: '3.0.0', effectiveDate: monthsAgo(9), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Carbon Neutrality Roadmap', description: 'Detailed plan to achieve net-zero carbon emissions by 2030.', contentUrl: '/policies/carbon-neutral-2030.pdf', version: '1.2.0', effectiveDate: monthsAgo(8), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Supply Chain Ethics Code', description: 'ESG requirements for all tier-1 and tier-2 suppliers.', contentUrl: '/policies/supply-chain-ethics-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(8), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Waste Management Directive', description: 'Mandatory waste sorting, recycling targets, and landfill reduction goals.', contentUrl: '/policies/waste-management-v2.pdf', version: '2.0.0', effectiveDate: monthsAgo(7), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Water Stewardship Policy', description: 'Guidelines for responsible water use and wastewater treatment.', contentUrl: '/policies/water-stewardship-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(7), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Employee Grievance Mechanism', description: 'Confidential channel for reporting ESG concerns and violations.', contentUrl: '/policies/grievance-v1.5.pdf', version: '1.5.0', effectiveDate: monthsAgo(6), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Community Engagement Framework', description: 'Structured approach to CSR partnerships and community investments.', contentUrl: '/policies/community-engagement-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(6), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Climate Risk Disclosure', description: 'TCFD-aligned climate risk assessment and disclosure requirements.', contentUrl: '/policies/climate-risk-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(5), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Sustainable Procurement Guidelines', description: 'Criteria for evaluating environmental impact of purchasing decisions.', contentUrl: '/policies/sustainable-procurement-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(5), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Biodiversity Protection Policy', description: 'Commitment to minimizing corporate impact on local ecosystems.', contentUrl: '/policies/biodiversity-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(4), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Green Travel Policy', description: 'Guidelines for low-carbon business travel and accommodation choices.', contentUrl: '/policies/green-travel-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(4), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Circular Economy Strategy', description: 'Framework for product lifecycle management and material recovery.', contentUrl: '/policies/circular-economy-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(3), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Renewable Energy Transition Plan', description: 'Targets and milestones for switching to 100% renewable energy sources.', contentUrl: '/policies/renewable-transition-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(3), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Modern Slavery Statement', description: 'Zero tolerance for forced labor across all business operations.', contentUrl: '/policies/modern-slavery-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(2), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Stakeholder Engagement Policy', description: 'Framework for transparent communication with ESG stakeholders.', contentUrl: '/policies/stakeholder-engagement-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(2), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'ESG Reporting Standards', description: 'Internal guidelines aligned with GRI and SASB reporting frameworks.', contentUrl: '/policies/esg-reporting-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(1), status: 'ACTIVE' } }),
  ]);

  // ─── Policy Acknowledgments ───
  console.log('Seeding Policy Acknowledgments...');
  const ackCreates: Promise<any>[] = [];
  for (let pi = 0; pi < policies.length; pi++) {
    const ackCount = Math.min(users.length, 25 + (pi % 4) * 5);
    for (let ui = 0; ui < ackCount; ui++) {
      ackCreates.push(
        prisma.policyAcknowledgment.create({
          data: {
            policyId: policies[pi].id,
            userId: users[ui].id,
            acknowledgedAt: new Date(monthsAgo(Math.max(0, 11 - pi)).getTime() + ui * 86400000),
          },
        })
      );
    }
  }
  await Promise.all(ackCreates);
  console.log(`  → Created ${ackCreates.length} policy acknowledgments`);

  // ─── CSR Activities (25) ───
  console.log('Seeding CSR Activities (25)...');
  const csrActivities = await Promise.all([
    prisma.csrActivity.create({ data: { title: 'Beach Cleanup Drive', description: 'Volunteer beach cleanup to remove plastic waste and protect marine life.', categoryId: csrCat.id, pointsXp: 150, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Tree Plantation Week', description: 'Plant 500 native trees across three urban locations.', categoryId: csrCat.id, pointsXp: 200, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Food Bank Volunteer Day', description: 'Sort and distribute food donations at the city food bank.', categoryId: csrCat.id, pointsXp: 100, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'STEM Education Outreach', description: 'Teach coding and robotics to underprivileged school students.', categoryId: csrCat.id, pointsXp: 175, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'River Restoration Project', description: 'Remove invasive species and restore native vegetation along the riverbank.', categoryId: csrCat.id, pointsXp: 180, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Winter Clothing Drive', description: 'Collect and distribute warm clothing for homeless communities.', categoryId: csrCat.id, pointsXp: 120, deadline: monthsAgo(1), status: ChallengeStatus.COMPLETED } }),
    prisma.csrActivity.create({ data: { title: 'Office Recycling Program', description: 'Set up and maintain recycling stations across all office floors.', categoryId: csrCat.id, pointsXp: 80, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Mental Health Awareness Week', description: 'Organize workshops, meditation sessions, and peer support groups.', categoryId: csrCat.id, pointsXp: 90, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Community Garden Build', description: 'Construct raised-bed gardens for a local community center.', categoryId: csrCat.id, pointsXp: 160, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'E-Waste Collection Drive', description: 'Organize safe collection and recycling of electronic waste.', categoryId: csrCat.id, pointsXp: 130, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Elderly Home Visit Program', description: 'Weekly visits to senior care facilities for companionship activities.', categoryId: csrCat.id, pointsXp: 110, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Park Restoration Day', description: 'Clean and restore trails, benches, and green spaces in city parks.', categoryId: csrCat.id, pointsXp: 140, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Literacy Campaign', description: 'Donate books and conduct reading sessions at local schools.', categoryId: csrCat.id, pointsXp: 95, deadline: monthsAgo(-2), status: ChallengeStatus.COMPLETED } }),
    prisma.csrActivity.create({ data: { title: 'Clean Water Initiative', description: 'Install water purification filters in underserved communities.', categoryId: csrCat.id, pointsXp: 250, deadline: monthsAgo(-4), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Wildlife Habitat Restoration', description: 'Restore degraded habitats in the nearby nature reserve.', categoryId: csrCat.id, pointsXp: 170, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Sustainable Fashion Workshop', description: 'Host workshops on upcycling clothing and sustainable fashion choices.', categoryId: csrCat.id, pointsXp: 75, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Disaster Relief Fund Drive', description: 'Collect donations and assemble relief kits for disaster-affected regions.', categoryId: csrCat.id, pointsXp: 200, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Bee Keeping Awareness Day', description: 'Educate employees on pollinator importance and install bee boxes.', categoryId: csrCat.id, pointsXp: 105, deadline: monthsAgo(-3), status: ChallengeStatus.COMPLETED } }),
    prisma.csrActivity.create({ data: { title: 'Blood Donation Camp', description: 'Partner with Red Cross for an on-site blood donation event.', categoryId: csrCat.id, pointsXp: 85, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'School Science Lab Renovation', description: 'Upgrade lab equipment and furniture at an underfunded school.', categoryId: csrCat.id, pointsXp: 220, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Anti-Littering Awareness Campaign', description: 'Launch social media and poster campaign against urban littering.', categoryId: csrCat.id, pointsXp: 65, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Organic Farm Volunteering', description: 'Spend a day helping at a local organic farm with harvesting.', categoryId: csrCat.id, pointsXp: 125, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Housing for Homeless Build', description: 'Join Habitat for Humanity to build affordable housing units.', categoryId: csrCat.id, pointsXp: 300, deadline: monthsAgo(-5), status: ChallengeStatus.COMPLETED } }),
    prisma.csrActivity.create({ data: { title: 'Corporate Mentorship Program', description: 'Mentor high school students on career paths in STEM fields.', categoryId: csrCat.id, pointsXp: 145, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Ocean Plastic Awareness Run', description: 'Organize a 5K charity run to raise awareness about ocean plastic.', categoryId: csrCat.id, pointsXp: 155, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
  ]);

  // ─── Employee Participations (80) ───
  console.log('Seeding Employee Participations (80)...');
  const epCreates: Promise<any>[] = [];
  for (let ci = 0; ci < csrActivities.length; ci++) {
    const participants = 2 + (ci % 4);
    for (let p = 0; p < participants && epCreates.length < 80; p++) {
      const user = users[(ci * 5 + p + 3) % users.length];
      const statuses: ApprovalStatus[] = [ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.REJECTED];
      const status = statuses[p % 3];
      epCreates.push(
        prisma.employeeParticipation.create({
          data: {
            userId: user.id,
            csrActivityId: csrActivities[ci].id,
            proofUrl: status !== ApprovalStatus.REJECTED ? `/proofs/csr-${ci}-${p}.jpg` : null,
            approvalStatus: status,
            pointsEarned: status === ApprovalStatus.APPROVED ? csrActivities[ci].pointsXp : 0,
            completionDate: status === ApprovalStatus.APPROVED ? new Date(monthsAgo(0).getTime() - p * 86400000) : null,
          },
        })
      );
    }
  }
  await Promise.all(epCreates);
  console.log(`  → Created ${epCreates.length} CSR participations`);

  // ─── Challenges (20) ───
  console.log('Seeding Challenges (20)...');
  const challenges = await Promise.all([
    prisma.challenge.create({ data: { title: '30-Day Zero Waste Challenge', categoryId: challengeCat.id, description: 'Produce zero landfill waste for 30 consecutive days.', xp: 300, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Bike to Work Week', categoryId: challengeCat.id, description: 'Commute by bicycle for an entire work week.', xp: 100, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Energy Audit Your Workspace', categoryId: challengeCat.id, description: 'Conduct a personal energy audit and submit a reduction plan.', xp: 150, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-3), status: ChallengeStatus.COMPLETED } }),
    prisma.challenge.create({ data: { title: 'Plant 10 Trees', categoryId: challengeCat.id, description: 'Plant and nurture at least 10 native trees.', xp: 250, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-4), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Meatless Monday Marathon', categoryId: challengeCat.id, description: 'Follow a plant-based diet every Monday for 2 months.', xp: 180, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Green Innovation Pitch', categoryId: challengeCat.id, description: 'Propose an innovative sustainability solution for the company.', xp: 400, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-5), status: ChallengeStatus.UNDER_REVIEW } }),
    prisma.challenge.create({ data: { title: 'Water Conservation Sprint', categoryId: challengeCat.id, description: 'Reduce personal water usage by 30% for 2 weeks.', xp: 120, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Reusable Container Challenge', categoryId: challengeCat.id, description: 'Use only reusable containers for food and drinks for 30 days.', xp: 90, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(1), status: ChallengeStatus.COMPLETED } }),
    prisma.challenge.create({ data: { title: 'Public Transit Challenge', categoryId: challengeCat.id, description: 'Use only public transit for 2 weeks instead of driving.', xp: 140, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Digital Detox Day', categoryId: challengeCat.id, description: 'Spend a full day without electronic devices to save energy.', xp: 60, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Carbon Footprint Calculator', categoryId: challengeCat.id, description: 'Calculate and submit your annual personal carbon footprint.', xp: 110, difficulty: Difficulty.EASY, evidenceRequired: true, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Green Office Makeover', categoryId: challengeCat.id, description: 'Propose and implement 3 eco-friendly changes in your workspace.', xp: 200, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Sustainable Cooking Sprint', categoryId: challengeCat.id, description: 'Prepare 5 meals using only locally-sourced ingredients.', xp: 130, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'No Single-Use Plastic Month', categoryId: challengeCat.id, description: 'Avoid all single-use plastics for 30 days.', xp: 220, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-4), status: ChallengeStatus.COMPLETED } }),
    prisma.challenge.create({ data: { title: 'Community Clean-Up Leader', categoryId: challengeCat.id, description: 'Organize and lead a neighborhood clean-up event.', xp: 280, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Recycling Sorting Champion', categoryId: challengeCat.id, description: 'Correctly sort all household waste for 2 weeks.', xp: 70, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Green Commute Log', categoryId: challengeCat.id, description: 'Log 20 days of eco-friendly commuting (bike, walk, transit).', xp: 160, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Eco-Hackathon Sprint', categoryId: challengeCat.id, description: 'Build a prototype tool that helps track personal emissions.', xp: 350, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-6), status: ChallengeStatus.COMPLETED } }),
    prisma.challenge.create({ data: { title: 'Seed Swap & Share', categoryId: challengeCat.id, description: 'Organize a seed exchange to promote urban gardening.', xp: 80, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Climate Literacy Quiz', categoryId: challengeCat.id, description: 'Complete the climate literacy assessment with 80%+ score.', xp: 50, difficulty: Difficulty.EASY, evidenceRequired: true, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
  ]);

  // ─── Challenge Participations (60+) ───
  console.log('Seeding Challenge Participations (60+)...');
  const cpCreates: Promise<any>[] = [];
  const challengeProgress = [100, 65, 100, 80, 45, 70, 30, 100, 55, 40, 75, 60, 35, 95, 20, 90, 50, 100, 85, 25];
  for (let ci = 0; ci < challenges.length; ci++) {
    const participants = 2 + (ci % 3);
    for (let p = 0; p < participants; p++) {
      const user = users[(ci * 7 + p + 5) % users.length];
      const progress = Math.min(100, challengeProgress[ci] * ((p + 2) / (p + 3)));
      const isCompleted = progress >= 95;
      cpCreates.push(
        prisma.challengeParticipation.create({
          data: {
            challengeId: challenges[ci].id,
            userId: user.id,
            progress,
            proofUrl: isCompleted ? `/proofs/ch-${ci}-${p}.pdf` : null,
            approvalStatus: isCompleted ? ApprovalStatus.APPROVED : p % 2 === 0 ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED,
            xpAwarded: isCompleted && p % 2 === 0 ? challenges[ci].xp : 0,
            completedAt: isCompleted ? new Date(monthsAgo(0).getTime() - p * 86400000) : null,
          },
        })
      );
    }
  }
  await Promise.all(cpCreates);
  console.log(`  → Created ${cpCreates.length} challenge participations`);

  // ─── Audits (15) ───
  console.log('Seeding Audits (15)...');
  const audits = await Promise.all([
    prisma.audit.create({ data: { departmentId: manufacturing.id, auditorName: 'Sarah Chen (External)', auditDate: monthsAgo(11), score: 74, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Initial manufacturing baseline audit. Several gaps identified in emissions tracking.' } }),
    prisma.audit.create({ data: { departmentId: logistics.id, auditorName: 'James Wright (External)', auditDate: monthsAgo(10), score: 62, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Fleet emissions measurement systems need upgrade. Missing quarterly reports.' } }),
    prisma.audit.create({ data: { departmentId: corporate.id, auditorName: 'Priya Nair (Internal)', auditDate: monthsAgo(9), score: 85, outcome: AuditOutcome.COMPLIANT, findings: 'Corporate office baseline strong. Renewable energy procurement on track.' } }),
    prisma.audit.create({ data: { departmentId: rnd.id, auditorName: 'Marcus Lee (Internal)', auditDate: monthsAgo(8), score: 70, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Lab energy consumption high. Equipment scheduling optimization needed.' } }),
    prisma.audit.create({ data: { departmentId: hr.id, auditorName: 'Elena Vasquez (External)', auditDate: monthsAgo(7), score: 78, outcome: AuditOutcome.COMPLIANT, findings: 'HR processes aligned with diversity targets. Training records well maintained.' } }),
    prisma.audit.create({ data: { departmentId: finance.id, auditorName: 'Laura Schmidt (External)', auditDate: monthsAgo(6), score: 82, outcome: AuditOutcome.COMPLIANT, findings: 'ESG reporting framework compliance strong. Minor Scope 3 tracking gaps.' } }),
    prisma.audit.create({ data: { departmentId: manufacturing.id, auditorName: 'Sarah Chen (External)', auditDate: monthsAgo(5), score: 79, outcome: AuditOutcome.COMPLIANT, findings: 'Improved waste segregation. Fleet emissions trending down 8%.' } }),
    prisma.audit.create({ data: { departmentId: logistics.id, auditorName: 'James Wright (External)', auditDate: monthsAgo(4), score: 71, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Fleet emissions still above target by 12%. Diesel replacement plan needed.' } }),
    prisma.audit.create({ data: { departmentId: corporate.id, auditorName: 'Priya Nair (Internal)', auditDate: monthsAgo(3), score: 91, outcome: AuditOutcome.COMPLIANT, findings: 'Corporate offices exceed sustainability benchmarks. Strong renewable adoption.' } }),
    prisma.audit.create({ data: { departmentId: rnd.id, auditorName: 'Marcus Lee (Internal)', auditDate: monthsAgo(2), score: 75, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'HVAC system running 24/7 in unused spaces. 30% estimated energy waste.' } }),
    prisma.audit.create({ data: { departmentId: hr.id, auditorName: 'Elena Vasquez (External)', auditDate: monthsAgo(2), score: 83, outcome: AuditOutcome.COMPLIANT, findings: 'ESG training completion rate at 92%. Strong internal governance culture.' } }),
    prisma.audit.create({ data: { departmentId: finance.id, auditorName: 'Laura Schmidt (External)', auditDate: monthsAgo(1), score: 88, outcome: AuditOutcome.COMPLIANT, findings: 'ESG financial disclosures aligned with TCFD. Minor documentation improvements.' } }),
    prisma.audit.create({ data: { departmentId: manufacturing.id, auditorName: 'Sarah Chen (External)', auditDate: monthsAgo(1), score: 84, outcome: AuditOutcome.COMPLIANT, findings: 'Zero-waste initiative achieving 72% diversion rate. On track for targets.' } }),
    prisma.audit.create({ data: { departmentId: logistics.id, auditorName: 'James Wright (External)', auditDate: monthsAgo(0), score: 76, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Fleet optimization yielding results but targets still missed by 5%.' } }),
    prisma.audit.create({ data: { departmentId: rnd.id, auditorName: 'Marcus Lee (Internal)', auditDate: monthsAgo(0), score: 80, outcome: AuditOutcome.COMPLIANT, findings: 'Lab equipment scheduling implemented. Energy consumption down 18%.' } }),
  ]);

  // ─── Compliance Issues (25) ───
  console.log('Seeding Compliance Issues (25)...');
  await prisma.complianceIssue.createMany({
    data: [
      { auditId: audits[0].id, title: 'Waste Segregation Non-Compliance', description: 'Two production lines showing incorrect waste segregation practices.', severity: ComplianceSeverity.MEDIUM, departmentId: manufacturing.id, ownerId: users[3].id, dueDate: monthsAgo(9), status: ComplianceStatus.RESOLVED },
      { auditId: audits[1].id, title: 'Missing Fleet Maintenance Logs', description: 'Three vehicles lack mandatory quarterly maintenance documentation.', severity: ComplianceSeverity.MEDIUM, departmentId: logistics.id, ownerId: users[2].id, dueDate: monthsAgo(8), status: ComplianceStatus.OPEN },
      { auditId: audits[3].id, title: 'Equipment Standby Power', description: '15 lab instruments left on standby overnight consuming unnecessary power.', severity: ComplianceSeverity.LOW, departmentId: rnd.id, ownerId: users[6].id, dueDate: monthsAgo(7), status: ComplianceStatus.RESOLVED },
      { auditId: audits[7].id, title: 'Fleet Emissions Over Limit', description: 'Diesel fleet emissions exceeded the quarterly cap by 12%. Needs corrective action plan.', severity: ComplianceSeverity.HIGH, departmentId: logistics.id, ownerId: users[1].id, dueDate: monthsAgo(2), status: ComplianceStatus.OPEN },
      { auditId: audits[9].id, title: 'Lab HVAC Energy Waste', description: 'HVAC system running 24/7 in unused lab spaces. Estimated 30% energy waste.', severity: ComplianceSeverity.HIGH, departmentId: rnd.id, ownerId: users[5].id, dueDate: monthsAgo(1), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Unreported Chemical Spill', description: 'Minor chemical spill in storage area not reported within 24-hour window.', severity: ComplianceSeverity.HIGH, departmentId: manufacturing.id, ownerId: users[4].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Incomplete Vendor Sustainability Assessment', description: '2 of 8 new vendors missing sustainability questionnaires.', severity: ComplianceSeverity.LOW, departmentId: finance.id, ownerId: users[8].id, dueDate: monthsAgo(0), status: ComplianceStatus.RESOLVED },
      { auditId: null, title: 'Missing Data Privacy Impact Assessment', description: 'New HR software deployment lacks required DPIA documentation.', severity: ComplianceSeverity.MEDIUM, departmentId: hr.id, ownerId: users[7].id, dueDate: monthsAgo(-1), status: ComplianceStatus.OPEN },
      { auditId: audits[11].id, title: 'Scope 3 Reporting Gaps', description: 'Incomplete Scope 3 emissions data for Q4 supply chain activities.', severity: ComplianceSeverity.LOW, departmentId: finance.id, ownerId: users[9].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Overdue ESG Training Completion', description: '12 employees have not completed mandatory annual ESG training module.', severity: ComplianceSeverity.MEDIUM, departmentId: corporate.id, ownerId: users[0].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: audits[1].id, title: 'Fuel Consumption Reporting Delay', description: 'Monthly fuel consumption data submitted 3 weeks late.', severity: ComplianceSeverity.MEDIUM, departmentId: logistics.id, ownerId: users[2].id, dueDate: monthsAgo(8), status: ComplianceStatus.RESOLVED },
      { auditId: audits[4].id, title: 'Employee Grievance Response Time', description: 'Average grievance response time exceeds 14-day policy requirement.', severity: ComplianceSeverity.LOW, departmentId: hr.id, ownerId: users[7].id, dueDate: monthsAgo(5), status: ComplianceStatus.RESOLVED },
      { auditId: null, title: 'Packaging Material Non-Recyclable', description: 'Three product lines still using non-recyclable packaging materials.', severity: ComplianceSeverity.HIGH, departmentId: manufacturing.id, ownerId: users[3].id, dueDate: monthsAgo(-1), status: ComplianceStatus.OPEN },
      { auditId: audits[9].id, title: 'Refrigerant Leak Detection Failure', description: 'Quarterly refrigerant leak detection not performed on schedule.', severity: ComplianceSeverity.HIGH, departmentId: rnd.id, ownerId: users[6].id, dueDate: monthsAgo(1), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Community Investment Disclosure Missing', description: 'Q3 community investment data not included in ESG report.', severity: ComplianceSeverity.LOW, departmentId: corporate.id, ownerId: users[0].id, dueDate: monthsAgo(1), status: ComplianceStatus.RESOLVED },
      { auditId: audits[12].id, title: 'Water Recycling System Maintenance', description: 'Water recycling filters overdue for replacement by 2 weeks.', severity: ComplianceSeverity.MEDIUM, departmentId: manufacturing.id, ownerId: users[4].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Supplier Code of Conduct Violation', description: 'One tier-2 supplier cited for inadequate waste disposal practices.', severity: ComplianceSeverity.HIGH, departmentId: logistics.id, ownerId: users[1].id, dueDate: monthsAgo(-1), status: ComplianceStatus.OPEN },
      { auditId: audits[13].id, title: 'EV Charging Infrastructure Gap', description: 'Current EV charging stations insufficient for projected fleet transition.', severity: ComplianceSeverity.MEDIUM, departmentId: logistics.id, ownerId: users[2].id, dueDate: monthsAgo(-2), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Carbon Offset Verification Pending', description: 'Q2 carbon offset purchases awaiting third-party verification.', severity: ComplianceSeverity.LOW, departmentId: finance.id, ownerId: users[9].id, dueDate: monthsAgo(1), status: ComplianceStatus.OPEN },
      { auditId: audits[5].id, title: 'Internal Carbon Price Update', description: 'Internal carbon price not updated to reflect current market rate.', severity: ComplianceSeverity.MEDIUM, departmentId: finance.id, ownerId: users[8].id, dueDate: monthsAgo(4), status: ComplianceStatus.RESOLVED },
      { auditId: null, title: 'Biodiversity Survey Overdue', description: 'Annual biodiversity impact assessment not completed for logistics corridors.', severity: ComplianceSeverity.MEDIUM, departmentId: logistics.id, ownerId: users[1].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: audits[14].id, title: 'Energy Benchmark Update Required', description: 'Energy performance benchmarks need updating for new lab equipment.', severity: ComplianceSeverity.LOW, departmentId: rnd.id, ownerId: users[5].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Gender Pay Gap Report Delay', description: 'Annual gender pay gap report submitted 2 weeks past deadline.', severity: ComplianceSeverity.MEDIUM, departmentId: hr.id, ownerId: users[7].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Travel Policy Non-Compliance', description: '4 business class flights booked without required pre-approval.', severity: ComplianceSeverity.LOW, departmentId: corporate.id, ownerId: users[0].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: audits[6].id, title: 'Green Certification Renewal', description: 'ISO 14001 certification renewal application submitted late.', severity: ComplianceSeverity.MEDIUM, departmentId: manufacturing.id, ownerId: users[3].id, dueDate: monthsAgo(3), status: ComplianceStatus.RESOLVED },
    ],
  });

  // ─── Department Scores (12 months × 6 departments = 72) ───
  console.log('Seeding Department Scores (12 months × 6 departments)...');
  const scoreCreates: Promise<any>[] = [];
  const baseScores = [
    { env: 65, soc: 58, gov: 70 },
    { env: 52, soc: 63, gov: 55 },
    { env: 78, soc: 75, gov: 85 },
    { env: 55, soc: 70, gov: 65 },
    { env: 63, soc: 60, gov: 78 },
    { env: 72, soc: 55, gov: 65 },
  ];
  for (let monthsBack = 11; monthsBack >= 0; monthsBack--) {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsBack);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    for (let di = 0; di < depts.length; di++) {
      const base = baseScores[di];
      const improvement = (11 - monthsBack) * 1.2;
      const variation = ((monthsBack * 7 + di * 3) % 11) - 5;
      const env = Math.min(100, Math.max(30, Math.round(base.env + improvement + variation)));
      const soc = Math.min(100, Math.max(30, Math.round(base.soc + improvement + variation - 2)));
      const gov = Math.min(100, Math.max(30, Math.round(base.gov + improvement + variation + 1)));
      const total = Math.round(env * 0.4 + soc * 0.3 + gov * 0.3);
      scoreCreates.push(
        prisma.departmentScore.create({
          data: {
            departmentId: depts[di].id,
            year,
            month,
            environmentalScore: env,
            socialScore: soc,
            governanceScore: gov,
            totalScore: total,
          },
        })
      );
    }
  }
  await Promise.all(scoreCreates);
  console.log(`  → Created ${scoreCreates.length} department scores`);

  // ─── User Badges (40) ───
  console.log('Seeding User Badges (40)...');
  const userBadgeData: { userId: string; badgeId: string; unlockedAt: Date }[] = [];
  for (let i = 0; i < 40; i++) {
    const user = users[i % users.length];
    const badge = badges[i % badges.length];
    const monthOffset = 11 - (i % 12);
    userBadgeData.push({
      userId: user.id,
      badgeId: badge.id,
      unlockedAt: monthsAgo(monthOffset),
    });
  }
  const uniqueBadges = new Map<string, typeof userBadgeData[0]>();
  for (const ub of userBadgeData) {
    const key = `${ub.userId}-${ub.badgeId}`;
    if (!uniqueBadges.has(key)) {
      uniqueBadges.set(key, ub);
    }
  }
  await prisma.userBadge.createMany({
    data: Array.from(uniqueBadges.values()),
  });
  console.log(`  → Created ${uniqueBadges.size} user badges`);

  // ─── Reward Redemptions (15) ───
  console.log('Seeding Reward Redemptions (15)...');
  const redemptionStatuses: ApprovalStatus[] = [
    ApprovalStatus.APPROVED, ApprovalStatus.APPROVED, ApprovalStatus.PENDING,
    ApprovalStatus.APPROVED, ApprovalStatus.APPROVED, ApprovalStatus.PENDING,
    ApprovalStatus.APPROVED, ApprovalStatus.APPROVED, ApprovalStatus.APPROVED,
    ApprovalStatus.PENDING, ApprovalStatus.APPROVED, ApprovalStatus.APPROVED,
    ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.APPROVED,
  ];
  await prisma.rewardRedemption.createMany({
    data: [
      { userId: users[1].id, rewardId: rewards[0].id, pointsDeducted: 150, status: redemptionStatuses[0] },
      { userId: users[2].id, rewardId: rewards[2].id, pointsDeducted: 100, status: redemptionStatuses[1] },
      { userId: users[3].id, rewardId: rewards[1].id, pointsDeducted: 500, status: redemptionStatuses[2] },
      { userId: users[5].id, rewardId: rewards[3].id, pointsDeducted: 200, status: redemptionStatuses[3] },
      { userId: users[7].id, rewardId: rewards[2].id, pointsDeducted: 100, status: redemptionStatuses[4] },
      { userId: users[9].id, rewardId: rewards[4].id, pointsDeducted: 350, status: redemptionStatuses[5] },
      { userId: users[11].id, rewardId: rewards[5].id, pointsDeducted: 120, status: redemptionStatuses[6] },
      { userId: users[13].id, rewardId: rewards[2].id, pointsDeducted: 100, status: redemptionStatuses[7] },
      { userId: users[15].id, rewardId: rewards[7].id, pointsDeducted: 180, status: redemptionStatuses[8] },
      { userId: users[17].id, rewardId: rewards[9].id, pointsDeducted: 60, status: redemptionStatuses[9] },
      { userId: users[19].id, rewardId: rewards[6].id, pointsDeducted: 450, status: redemptionStatuses[10] },
      { userId: users[21].id, rewardId: rewards[8].id, pointsDeducted: 80, status: redemptionStatuses[11] },
      { userId: users[23].id, rewardId: rewards[10].id, pointsDeducted: 800, status: redemptionStatuses[12] },
      { userId: users[25].id, rewardId: rewards[11].id, pointsDeducted: 600, status: redemptionStatuses[13] },
      { userId: users[27].id, rewardId: rewards[12].id, pointsDeducted: 300, status: redemptionStatuses[14] },
    ],
  });

  // ─── Notifications (50) ───
  console.log('Seeding Notifications (50)...');
  const notifCreates: Promise<any>[] = [];
  const notifTemplates = [
    { title: 'Badge Unlocked!', message: 'You earned the Green Pioneer badge. Keep up the great work!', type: 'BADGE_UNLOCK' },
    { title: 'CSR Participation Approved', message: 'Your Beach Cleanup Drive participation was approved. +150 points!', type: 'APPROVAL' },
    { title: 'Policy Acknowledgment Reminder', message: 'Please review and acknowledge the Environmental Sustainability Policy.', type: 'POLICY_REMINDER' },
    { title: 'Challenge Completed', message: 'Congratulations! You completed the Bike to Work Week challenge.', type: 'BADGE_UNLOCK' },
    { title: 'Compliance Issue Filed', message: 'A new compliance issue has been filed in your department. Please review.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Reward Redemption Pending', message: 'Your reward redemption request for Eco Coffee Mug is under review.', type: 'APPROVAL' },
    { title: 'Environmental Goal Update', message: 'Fleet Emissions goal is at 77% progress. Keep pushing!', type: 'POLICY_REMINDER' },
    { title: 'Audit Completed', message: 'Manufacturing department audit completed. Score: 84/100.', type: 'COMPLIANCE_ISSUE' },
    { title: 'New Challenge Available', message: '30-Day Zero Waste Challenge is now open. Join to earn 300 XP!', type: 'BADGE_UNLOCK' },
    { title: 'Training Reminder', message: 'Complete your annual ESG training by end of month.', type: 'POLICY_REMINDER' },
    { title: 'CSR Activity Starting Soon', message: 'Tree Plantation Week begins next Monday. Register now!', type: 'APPROVAL' },
    { title: 'Compliance Issue Resolved', message: 'Waste Segregation Non-Compliance issue has been marked as resolved.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Points Earned', message: 'You earned 200 points for completing the Tree Plantation CSR activity.', type: 'APPROVAL' },
    { title: 'New Policy Published', message: 'Climate Risk Disclosure policy has been published. Please review.', type: 'POLICY_REMINDER' },
    { title: 'Leaderboard Update', message: 'Your department moved up 2 spots on the ESG leaderboard!', type: 'BADGE_UNLOCK' },
    { title: 'Carbon Target Approaching', message: 'Water Consumption Reduction goal is 72% complete. Stay on track!', type: 'POLICY_REMINDER' },
    { title: 'Volunteer Hours Logged', message: 'Your 8 volunteer hours for the Food Bank event were recorded.', type: 'APPROVAL' },
    { title: 'Compliance Deadline Warning', message: 'Fleet Emissions Over Limit issue is due in 7 days. Please take action.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Badge Upgrade Available', message: 'You are 2 challenges away from earning Sustainability Champion badge.', type: 'BADGE_UNLOCK' },
    { title: 'Monthly ESG Report Ready', message: 'Your department ESG report for this month is ready for review.', type: 'POLICY_REMINDER' },
    { title: 'Reward Shipped', message: 'Your Eco Coffee Mug reward has been shipped. Track your delivery.', type: 'APPROVAL' },
    { title: 'Audit Scheduled', message: 'Your department has an upcoming compliance audit next week.', type: 'COMPLIANCE_ISSUE' },
    { title: 'New CSR Activity', message: 'Community Garden Build is now accepting volunteers. 160 XP available!', type: 'BADGE_UNLOCK' },
    { title: 'Policy Renewal Required', message: 'Data Privacy & Protection Policy v2.0 requires re-acknowledgment.', type: 'POLICY_REMINDER' },
    { title: 'Sustainability Milestone', message: 'Your department has reduced carbon emissions by 15% this quarter!', type: 'BADGE_UNLOCK' },
    { title: 'Challenge Reminder', message: 'You have 3 active challenges with pending progress updates.', type: 'POLICY_REMINDER' },
    { title: 'Points Balance Low', message: 'You need 80 more points to redeem the next reward tier.', type: 'APPROVAL' },
    { title: 'E-Waste Drive Results', message: 'The E-Waste Collection Drive collected 2.5 tonnes of electronics.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Green Commute Recognition', message: 'You have been recognized as an Eco Commuter for 20 consecutive days!', type: 'BADGE_UNLOCK' },
    { title: 'Audit Score Improved', message: 'R&D department audit score improved from 70 to 80 over 8 months.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Goal Completed!', message: 'Paperless Office Initiative has reached 88% — target achieved!', type: 'BADGE_UNLOCK' },
    { title: 'Compliance Training Due', message: '12 employees are overdue for annual ESG compliance training.', type: 'POLICY_REMINDER' },
    { title: 'Reward Catalog Updated', message: '5 new rewards added to the catalog. Check them out!', type: 'BADGE_UNLOCK' },
    { title: 'Carbon Transaction Logged', message: 'Monthly carbon report for Manufacturing shows 12% reduction.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Peer Recognition', message: 'David Bowie recognized your environmental leadership this quarter.', type: 'APPROVAL' },
    { title: 'New Challenge Level', message: 'You unlocked HARD difficulty challenges. Higher XP rewards await!', type: 'BADGE_UNLOCK' },
    { title: 'Policy Compliance Rate', message: 'Company-wide policy acknowledgment rate is at 87%. Target: 95%.', type: 'POLICY_REMINDER' },
    { title: 'CSR Event Photo Gallery', message: 'Photos from the Beach Cleanup Drive are now available.', type: 'APPROVAL' },
    { title: 'Quarterly ESG Summary', message: 'Q3 ESG performance summary is available in the Reports section.', type: 'POLICY_REMINDER' },
    { title: 'Reward Redemption Approved', message: 'Your Solar Charger redemption has been approved! Shipping soon.', type: 'APPROVAL' },
    { title: 'Compliance Issue Assigned', message: 'You have been assigned a new HIGH priority compliance issue.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Environmental Streak', message: 'You maintained a green commute streak for 30 days!', type: 'BADGE_UNLOCK' },
    { title: 'Reminder: Submit Proof', message: 'Please submit volunteer proof for the River Restoration Project.', type: 'POLICY_REMINDER' },
    { title: 'Department ESG Award', message: 'Corporate department earned the Highest ESG Score award this month!', type: 'BADGE_UNLOCK' },
    { title: 'Green Innovation Update', message: 'Your Green Innovation Pitch submission is under review.', type: 'APPROVAL' },
    { title: 'ESG Certification Achieved', message: 'Your department completed the ESG Fundamentals certification.', type: 'BADGE_UNLOCK' },
    { title: 'Annual Sustainability Report', message: 'The 2025 Annual Sustainability Report is now available.', type: 'POLICY_REMINDER' },
    { title: 'Platform Maintenance', message: 'Scheduled maintenance on Saturday 2AM-4AM. Data will be preserved.', type: 'POLICY_REMINDER' },
  ];
  for (let i = 0; i < 50; i++) {
    const tmpl = notifTemplates[i % notifTemplates.length];
    const user = users[i % users.length];
    notifCreates.push(
      prisma.notification.create({
        data: {
          userId: user.id,
          title: tmpl.title,
          message: tmpl.message,
          type: tmpl.type,
          isRead: i > 30,
          createdAt: new Date(monthsAgo(0).getTime() - i * 172800000),
        },
      })
    );
  }
  await Promise.all(notifCreates);
  console.log(`  → Created ${notifCreates.length} notifications`);

  // ─── Summary ───
  console.log('\n✅ Seed completed successfully!');
  console.log('─────────────────────────────');
  console.log(`  Departments:         6`);
  console.log(`  Users:               50`);
  console.log(`  Emission Factors:    15`);
  console.log(`  Carbon Transactions: ${txCreates.length}`);
  console.log(`  Environmental Goals: 12`);
  console.log(`  CSR Activities:      25 (${epCreates.length} participations)`);
  console.log(`  Challenges:          20 (${cpCreates.length} participations)`);
  console.log(`  Policies:            20 (${ackCreates.length} acknowledgments)`);
  console.log(`  Audits:              15`);
  console.log(`  Compliance Issues:   25`);
  console.log(`  Department Scores:   ${scoreCreates.length} (12 months × 6 departments)`);
  console.log(`  Badges:              30`);
  console.log(`  Rewards:             20 (15 redemptions)`);
  console.log(`  Notifications:       50`);
  console.log('─────────────────────────────');
  console.log('  Demo accounts:');
  console.log('    Admin:     admin@ecosphere.com / admin123');
  console.log('    Manager:   manager@ecosphere.com / manager123');
  console.log('    Employee:  employee@ecosphere.com / employee123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
