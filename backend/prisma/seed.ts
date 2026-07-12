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

function randomDateInMonth(year: number, month: number, dayMin = 1, dayMax = 28): Date {
  const day = dayMin + (((dayMax - dayMin) * (month * 7 + dayMin * 3)) % (dayMax - dayMin + 1));
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

  // ─── Emission Factors (6) ───
  console.log('Seeding Emission Factors...');
  const factors = await Promise.all([
    prisma.emissionFactor.create({ data: { name: 'Purchased Electricity (Grid)', factor: 0.38, unit: 'kWh', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Natural Gas Heating', factor: 2.02, unit: 'kWh', source: 'EPA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Diesel Fleet (Trucks)', factor: 2.68, unit: 'liter', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Employee Business Travel (Car)', factor: 0.12, unit: 'km', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Waste Disposal (Landfill)', factor: 0.45, unit: 'kg', source: 'DEFRA 2023' } }),
    prisma.emissionFactor.create({ data: { name: 'Water Consumption', factor: 0.0003, unit: 'liter', source: 'IPCC 2022' } }),
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

  // ─── Badges (6) ───
  console.log('Seeding Badges...');
  const badges = await Promise.all([
    prisma.badge.create({ data: { name: 'Green Pioneer', description: 'Earn 100 XP in sustainability actions', unlockRule: JSON.stringify({ minXp: 100 }), icon: 'Leaf' } }),
    prisma.badge.create({ data: { name: 'Carbon Tamer', description: 'Log 5 or more carbon transactions', unlockRule: JSON.stringify({ minCarbonLogs: 5 }), icon: 'Flame' } }),
    prisma.badge.create({ data: { name: 'Sustainability Champion', description: 'Complete 3 sustainability challenges', unlockRule: JSON.stringify({ minCompletedChallenges: 3 }), icon: 'Trophy' } }),
    prisma.badge.create({ data: { name: 'Green Hero', description: 'Earn 500 XP total', unlockRule: JSON.stringify({ minXp: 500 }), icon: 'Crown' } }),
    prisma.badge.create({ data: { name: 'Policy Guardian', description: 'Acknowledge all active ESG policies', unlockRule: JSON.stringify({ allPoliciesAcknowledged: true }), icon: 'Shield' } }),
    prisma.badge.create({ data: { name: 'CSR Star', description: 'Participate in 3 or more CSR activities', unlockRule: JSON.stringify({ minCsrParticipations: 3 }), icon: 'Star' } }),
  ]);

  // ─── Rewards (6) ───
  console.log('Seeding Rewards...');
  const rewards = await Promise.all([
    prisma.reward.create({ data: { name: 'Eco Coffee Mug', description: 'Reusable bamboo fiber coffee cup', pointsRequired: 150, stock: 50, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Solar Charger', description: 'Portable foldable solar panels', pointsRequired: 500, stock: 10, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Tree Plantation Certificate', description: 'We plant a tree in your name', pointsRequired: 100, stock: 1000, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Reusable Water Bottle', description: 'Stainless steel insulated bottle', pointsRequired: 200, stock: 30, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Public Transit Voucher', description: '$50 transit pass for eco commuting', pointsRequired: 350, stock: 20, status: 'ACTIVE' } }),
    prisma.reward.create({ data: { name: 'Eco Desk Plant Kit', description: 'Low-maintenance succulent with recycled pot', pointsRequired: 120, stock: 40, status: 'ACTIVE' } }),
  ]);

  // ─── Users (50) ───
  console.log('Seeding Users...');
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
    logistics, logistics, logistics,
    manufacturing, manufacturing, manufacturing, manufacturing,
    corporate, corporate,
    hr, hr,
    finance, finance,
    rnd, rnd, rnd,
  ];

  for (let i = 0; i < 50; i++) {
    const first = firstNames[i];
    const last = lastNames[i];
    userNames.push({ first, last });
    const isManager = i < 6;
    const dept = isManager ? depts[i] : deptDistribution[i % deptDistribution.length];
    userCreates.push(
      prisma.user.create({
        data: {
          email: i === 0 ? 'admin@ecosphere.com' : i === 1 ? 'manager@ecosphere.com' : `${first.toLowerCase()}.${last.toLowerCase()}@ecosphere.com`,
          passwordHash: i === 0 ? adminHash : i === 1 ? managerHash : empHash,
          firstName: first,
          lastName: last,
          role: i === 0 ? Role.ADMIN : i === 1 ? Role.MANAGER : Role.CONTRIBUTOR,
          departmentId: dept.id,
          xpBalance: (i * 37 + 23) % 600,
          pointsBalance: (i * 53 + 11) % 800,
        },
      })
    );
  }
  const users = await Promise.all(userCreates);

  // ─── Carbon Transactions (120+) ───
  console.log('Seeding Carbon Transactions (120+)...');
  const txCreates: Promise<any>[] = [];
  const sourceTypes: TransactionSourceType[] = [TransactionSourceType.PURCHASE, TransactionSourceType.MANUFACTURING, TransactionSourceType.EXPENSE, TransactionSourceType.FLEET];
  const units = ['kWh', 'liter', 'km', 'kg'];
  const deptsForTx = [logistics, manufacturing, corporate, finance, rnd];

  let txIndex = 0;
  for (let monthsBack = 5; monthsBack >= 0; monthsBack--) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1 - monthsBack;
    const adjustedMonth = month <= 0 ? month + 12 : month;
    const adjustedYear = month <= 0 ? year - 1 : year;

    const txPerMonth = monthsBack === 0 ? 35 : 20;
    for (let t = 0; t < txPerMonth; t++) {
      const dept = deptsForTx[txIndex % deptsForTx.length];
      const factor = factors[txIndex % factors.length];
      const srcType = sourceTypes[txIndex % sourceTypes.length];
      const unit = units[txIndex % units.length];
      const baseQty = srcType === TransactionSourceType.FLEET ? 100 + (txIndex * 13) % 400 : 50 + (txIndex * 7) % 300;
      const calculatedEmissions = baseQty * factor.factor;
      const day = 1 + (txIndex % 27);
      txCreates.push(
        prisma.carbonTransaction.create({
          data: {
            sourceType: srcType,
            sourceId: `TX-${String(adjustedYear).slice(2)}${String(adjustedMonth).padStart(2, '0')}-${String(t + 1).padStart(3, '0')}`,
            quantity: baseQty,
            unit,
            emissionFactorId: factor.id,
            calculatedEmissions,
            departmentId: dept.id,
            transactionDate: new Date(adjustedYear, adjustedMonth - 1, day, 10, 0, 0),
          },
        })
      );
      txIndex++;
    }
  }
  await Promise.all(txCreates);
  console.log(`  → Created ${txCreates.length} carbon transactions`);

  // ─── Environmental Goals (8) ───
  console.log('Seeding Environmental Goals...');
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
    ],
  });

  // ─── ESG Policies (4) ───
  console.log('Seeding ESG Policies...');
  const policies = await Promise.all([
    prisma.esgPolicy.create({ data: { title: 'Environmental Sustainability Policy', description: 'Corporate commitment to minimizing environmental impact across all operations.', contentUrl: '/policies/env-sustainability-v2.pdf', version: '2.1.0', effectiveDate: monthsAgo(6), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Anti-Corruption & Ethics Policy', description: 'Zero tolerance for bribery, corruption, and unethical business practices.', contentUrl: '/policies/anti-corruption-v1.pdf', version: '1.0.0', effectiveDate: monthsAgo(4), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Diversity & Inclusion Policy', description: 'Commitment to building a diverse, equitable, and inclusive workplace.', contentUrl: '/policies/diversity-inclusion-v1.5.pdf', version: '1.5.0', effectiveDate: monthsAgo(3), status: 'ACTIVE' } }),
    prisma.esgPolicy.create({ data: { title: 'Data Privacy & Protection Policy', description: 'GDPR-aligned data protection standards for employee and customer data.', contentUrl: '/policies/data-privacy-v2.pdf', version: '2.0.0', effectiveDate: monthsAgo(2), status: 'ACTIVE' } }),
  ]);

  // ─── Policy Acknowledgments ───
  console.log('Seeding Policy Acknowledgments...');
  const ackCreates: Promise<any>[] = [];
  for (let pi = 0; pi < policies.length; pi++) {
    const ackCount = 25 + pi * 5;
    for (let ui = 0; ui < ackCount && ui < users.length; ui++) {
      ackCreates.push(
        prisma.policyAcknowledgment.create({
          data: {
            policyId: policies[pi].id,
            userId: users[ui].id,
            acknowledgedAt: new Date(monthsAgo(5 - pi).getTime() + ui * 86400000),
          },
        })
      );
    }
  }
  await Promise.all(ackCreates);
  console.log(`  → Created ${ackCreates.length} policy acknowledgments`);

  // ─── CSR Activities (8) ───
  console.log('Seeding CSR Activities...');
  const csrActivities = await Promise.all([
    prisma.csrActivity.create({ data: { title: 'Beach Cleanup Drive', description: 'Volunteer beach cleanup to remove plastic waste and protect marine life.', categoryId: csrCat.id, pointsXp: 150, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Tree Plantation Week', description: 'Plant 500 native trees across three urban locations.', categoryId: csrCat.id, pointsXp: 200, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Food Bank Volunteer Day', description: 'Sort and distribute food donations at the city food bank.', categoryId: csrCat.id, pointsXp: 100, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'STEM Education Outreach', description: 'Teach coding and robotics to underprivileged school students.', categoryId: csrCat.id, pointsXp: 175, deadline: monthsAgo(-3), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'River Restoration Project', description: 'Remove invasive species and restore native vegetation along the riverbank.', categoryId: csrCat.id, pointsXp: 180, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Winter Clothing Drive', description: 'Collect and distribute warm clothing for homeless communities.', categoryId: csrCat.id, pointsXp: 120, deadline: monthsAgo(1), status: ChallengeStatus.COMPLETED } }),
    prisma.csrActivity.create({ data: { title: 'Office Recycling Program', description: 'Set up and maintain recycling stations across all office floors.', categoryId: csrCat.id, pointsXp: 80, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.csrActivity.create({ data: { title: 'Mental Health Awareness Week', description: 'Organize workshops, meditation sessions, and peer support groups.', categoryId: csrCat.id, pointsXp: 90, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
  ]);

  // ─── Employee Participations (40+) ───
  console.log('Seeding Employee Participations...');
  const epCreates: Promise<any>[] = [];
  for (let ci = 0; ci < csrActivities.length; ci++) {
    const participants = 3 + (ci % 4);
    for (let p = 0; p < participants; p++) {
      const user = users[(ci * 5 + p + 3) % users.length];
      const statuses: ApprovalStatus[] = [ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.REJECTED];
      epCreates.push(
        prisma.employeeParticipation.create({
          data: {
            userId: user.id,
            csrActivityId: csrActivities[ci].id,
            proofUrl: p % 2 === 0 ? `/proofs/csr-${ci}-${p}.jpg` : null,
            approvalStatus: statuses[p % 3],
            pointsEarned: statuses[p % 3] === ApprovalStatus.APPROVED ? csrActivities[ci].pointsXp : 0,
            completionDate: statuses[p % 3] === ApprovalStatus.APPROVED ? new Date(monthsAgo(0).getTime() - p * 86400000) : null,
          },
        })
      );
    }
  }
  await Promise.all(epCreates);
  console.log(`  → Created ${epCreates.length} CSR participations`);

  // ─── Challenges (8) ───
  console.log('Seeding Challenges...');
  const challenges = await Promise.all([
    prisma.challenge.create({ data: { title: '30-Day Zero Waste Challenge', categoryId: challengeCat.id, description: 'Produce zero landfill waste for 30 consecutive days.', xp: 300, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-2), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Bike to Work Week', categoryId: challengeCat.id, description: 'Commute by bicycle for an entire work week.', xp: 100, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Energy Audit Your Workspace', categoryId: challengeCat.id, description: 'Conduct a personal energy audit and submit a reduction plan.', xp: 150, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-3), status: ChallengeStatus.COMPLETED } }),
    prisma.challenge.create({ data: { title: 'Plant 10 Trees', categoryId: challengeCat.id, description: 'Plant and nurture at least 10 native trees.', xp: 250, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(-4), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Meatless Monday Marathon', categoryId: challengeCat.id, description: 'Follow a plant-based diet every Monday for 2 months.', xp: 180, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(-1), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Green Innovation Pitch', categoryId: challengeCat.id, description: 'Propose an innovative sustainability solution for the company.', xp: 400, difficulty: Difficulty.HARD, evidenceRequired: true, deadline: monthsAgo(-5), status: ChallengeStatus.UNDER_REVIEW } }),
    prisma.challenge.create({ data: { title: 'Water Conservation Sprint', categoryId: challengeCat.id, description: 'Reduce personal water usage by 30% for 2 weeks.', xp: 120, difficulty: Difficulty.MEDIUM, evidenceRequired: true, deadline: monthsAgo(0), status: ChallengeStatus.ACTIVE } }),
    prisma.challenge.create({ data: { title: 'Reusable Container Challenge', categoryId: challengeCat.id, description: 'Use only reusable containers for food and drinks for 30 days.', xp: 90, difficulty: Difficulty.EASY, evidenceRequired: false, deadline: monthsAgo(1), status: ChallengeStatus.COMPLETED } }),
  ]);

  // ─── Challenge Participations (30+) ───
  console.log('Seeding Challenge Participations...');
  const cpCreates: Promise<any>[] = [];
  for (let ci = 0; ci < challenges.length; ci++) {
    const participants = 2 + (ci % 3);
    for (let p = 0; p < participants; p++) {
      const user = users[(ci * 7 + p + 5) % users.length];
      const progress = [100, 65, 30, 100, 45, 80, 20, 100][ci];
      const statuses: ApprovalStatus[] = [ApprovalStatus.APPROVED, ApprovalStatus.PENDING];
      cpCreates.push(
        prisma.challengeParticipation.create({
          data: {
            challengeId: challenges[ci].id,
            userId: user.id,
            progress: progress * ((p + 2) / (p + 3)),
            proofUrl: progress === 100 ? `/proofs/ch-${ci}-${p}.pdf` : null,
            approvalStatus: progress === 100 ? ApprovalStatus.APPROVED : statuses[p % 2],
            xpAwarded: progress === 100 && p % 2 === 0 ? challenges[ci].xp : 0,
            completedAt: progress === 100 ? new Date(monthsAgo(0).getTime() - p * 86400000) : null,
          },
        })
      );
    }
  }
  await Promise.all(cpCreates);
  console.log(`  → Created ${cpCreates.length} challenge participations`);

  // ─── Audits (5) ───
  console.log('Seeding Audits...');
  const audits = await Promise.all([
    prisma.audit.create({ data: { departmentId: manufacturing.id, auditorName: 'Sarah Chen (External)', auditDate: monthsAgo(4), score: 82, outcome: AuditOutcome.COMPLIANT, findings: 'Manufacturing floor meets emissions targets. Minor improvements recommended for waste sorting.' } }),
    prisma.audit.create({ data: { departmentId: logistics.id, auditorName: 'James Wright (External)', auditDate: monthsAgo(3), score: 68, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Fleet emissions exceed targets by 12%. Diesel vehicle replacement plan needed.' } }),
    prisma.audit.create({ data: { departmentId: corporate.id, auditorName: 'Priya Nair (Internal)', auditDate: monthsAgo(2), score: 91, outcome: AuditOutcome.COMPLIANT, findings: 'Corporate offices exceed sustainability benchmarks. Strong renewable energy adoption.' } }),
    prisma.audit.create({ data: { departmentId: rnd.id, auditorName: 'Marcus Lee (Internal)', auditDate: monthsAgo(1), score: 75, outcome: AuditOutcome.ACTION_REQUIRED, findings: 'Lab energy consumption high. Recommend equipment scheduling optimization.' } }),
    prisma.audit.create({ data: { departmentId: finance.id, auditorName: 'Laura Schmidt (External)', auditDate: monthsAgo(0), score: 88, outcome: AuditOutcome.COMPLIANT, findings: 'ESG reporting framework compliance strong. Minor documentation gaps in Scope 3 tracking.' } }),
  ]);

  // ─── Compliance Issues (10) ───
  console.log('Seeding Compliance Issues...');
  await prisma.complianceIssue.createMany({
    data: [
      { auditId: audits[1].id, title: 'Fleet Emissions Over Limit', description: 'Diesel fleet emissions exceeded the quarterly cap by 12%. Needs corrective action plan.', severity: ComplianceSeverity.HIGH, departmentId: logistics.id, ownerId: users[1].id, dueDate: monthsAgo(-1), status: ComplianceStatus.OPEN },
      { auditId: audits[1].id, title: 'Missing Fleet Maintenance Logs', description: 'Three vehicles lack mandatory quarterly maintenance documentation.', severity: ComplianceSeverity.MEDIUM, departmentId: logistics.id, ownerId: users[2].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: audits[3].id, title: 'Lab HVAC Energy Waste', description: 'HVAC system running 24/7 in unused lab spaces. Estimated 30% energy waste.', severity: ComplianceSeverity.HIGH, departmentId: rnd.id, ownerId: users[5].id, dueDate: monthsAgo(-2), status: ComplianceStatus.OPEN },
      { auditId: audits[3].id, title: 'Equipment Standby Power', description: '15 lab instruments left on standby overnight consuming unnecessary power.', severity: ComplianceSeverity.LOW, departmentId: rnd.id, ownerId: users[6].id, dueDate: monthsAgo(0), status: ComplianceStatus.RESOLVED },
      { auditId: audits[0].id, title: 'Waste Segregation Non-Compliance', description: 'Two production lines showing incorrect waste segregation practices.', severity: ComplianceSeverity.MEDIUM, departmentId: manufacturing.id, ownerId: users[3].id, dueDate: monthsAgo(1), status: ComplianceStatus.RESOLVED },
      { auditId: null, title: 'Unreported Chemical Spill', description: 'Minor chemical spill in storage area not reported within 24-hour window.', severity: ComplianceSeverity.HIGH, departmentId: manufacturing.id, ownerId: users[4].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Incomplete Vendor Sustainability Assessment', description: '2 of 8 new vendors missing sustainability questionnaires.', severity: ComplianceSeverity.LOW, departmentId: finance.id, ownerId: users[8].id, dueDate: monthsAgo(-1), status: ComplianceStatus.RESOLVED },
      { auditId: null, title: 'Missing Data Privacy Impact Assessment', description: 'New HR software deployment lacks required DPIA documentation.', severity: ComplianceSeverity.MEDIUM, departmentId: hr.id, ownerId: users[7].id, dueDate: monthsAgo(-1), status: ComplianceStatus.OPEN },
      { auditId: audits[4].id, title: 'Scope 3 Reporting Gaps', description: 'Incomplete Scope 3 emissions data for Q4 supply chain activities.', severity: ComplianceSeverity.LOW, departmentId: finance.id, ownerId: users[9].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
      { auditId: null, title: 'Overdue ESG Training Completion', description: '12 employees have not completed mandatory annual ESG training module.', severity: ComplianceSeverity.MEDIUM, departmentId: corporate.id, ownerId: users[0].id, dueDate: monthsAgo(0), status: ComplianceStatus.OPEN },
    ],
  });

  // ─── Department Scores (6 months × 6 departments = 36) ───
  console.log('Seeding Department Scores...');
  const scoreCreates: Promise<any>[] = [];
  const baseScores = [
    { env: 72, soc: 65, gov: 78 },
    { env: 58, soc: 70, gov: 62 },
    { env: 85, soc: 82, gov: 90 },
    { env: 60, soc: 75, gov: 70 },
    { env: 70, soc: 68, gov: 85 },
    { env: 80, soc: 60, gov: 72 },
  ];
  for (let monthsBack = 5; monthsBack >= 0; monthsBack--) {
    const d = new Date();
    d.setMonth(d.getMonth() - monthsBack);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    for (let di = 0; di < depts.length; di++) {
      const base = baseScores[di];
      const variation = (monthsBack * 3 + di * 2) % 15 - 7;
      const env = Math.min(100, Math.max(20, base.env + variation));
      const soc = Math.min(100, Math.max(20, base.soc + variation - 2));
      const gov = Math.min(100, Math.max(20, base.gov + variation + 1));
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

  // ─── User Badges (15) ───
  console.log('Seeding User Badges...');
  await prisma.userBadge.createMany({
    data: [
      { userId: users[1].id, badgeId: badges[0].id, unlockedAt: monthsAgo(5) },
      { userId: users[1].id, badgeId: badges[3].id, unlockedAt: monthsAgo(3) },
      { userId: users[2].id, badgeId: badges[0].id, unlockedAt: monthsAgo(4) },
      { userId: users[3].id, badgeId: badges[1].id, unlockedAt: monthsAgo(4) },
      { userId: users[3].id, badgeId: badges[4].id, unlockedAt: monthsAgo(2) },
      { userId: users[4].id, badgeId: badges[0].id, unlockedAt: monthsAgo(3) },
      { userId: users[5].id, badgeId: badges[2].id, unlockedAt: monthsAgo(2) },
      { userId: users[6].id, badgeId: badges[5].id, unlockedAt: monthsAgo(1) },
      { userId: users[7].id, badgeId: badges[0].id, unlockedAt: monthsAgo(2) },
      { userId: users[8].id, badgeId: badges[1].id, unlockedAt: monthsAgo(3) },
      { userId: users[9].id, badgeId: badges[4].id, unlockedAt: monthsAgo(1) },
      { userId: users[10].id, badgeId: badges[0].id, unlockedAt: monthsAgo(4) },
      { userId: users[11].id, badgeId: badges[5].id, unlockedAt: monthsAgo(2) },
      { userId: users[12].id, badgeId: badges[2].id, unlockedAt: monthsAgo(1) },
      { userId: users[13].id, badgeId: badges[3].id, unlockedAt: monthsAgo(0) },
    ],
  });

  // ─── Reward Redemptions (8) ───
  console.log('Seeding Reward Redemptions...');
  await prisma.rewardRedemption.createMany({
    data: [
      { userId: users[1].id, rewardId: rewards[0].id, pointsDeducted: 150, status: ApprovalStatus.APPROVED },
      { userId: users[2].id, rewardId: rewards[2].id, pointsDeducted: 100, status: ApprovalStatus.APPROVED },
      { userId: users[3].id, rewardId: rewards[1].id, pointsDeducted: 500, status: ApprovalStatus.PENDING },
      { userId: users[5].id, rewardId: rewards[3].id, pointsDeducted: 200, status: ApprovalStatus.APPROVED },
      { userId: users[7].id, rewardId: rewards[2].id, pointsDeducted: 100, status: ApprovalStatus.APPROVED },
      { userId: users[9].id, rewardId: rewards[4].id, pointsDeducted: 350, status: ApprovalStatus.PENDING },
      { userId: users[11].id, rewardId: rewards[5].id, pointsDeducted: 120, status: ApprovalStatus.APPROVED },
      { userId: users[13].id, rewardId: rewards[2].id, pointsDeducted: 100, status: ApprovalStatus.APPROVED },
    ],
  });

  // ─── Notifications (25) ───
  console.log('Seeding Notifications...');
  const notifCreates: Promise<any>[] = [];
  const notifTemplates = [
    { title: 'Badge Unlocked!', message: 'You earned the Green Pioneer badge. Keep up the great work!', type: 'BADGE_UNLOCK' },
    { title: 'CSR Participation Approved', message: 'Your Beach Cleanup Drive participation was approved. +150 points!', type: 'APPROVAL' },
    { title: 'Policy Acknowledgment Reminder', message: 'Please review and acknowledge the Environmental Sustainability Policy.', type: 'POLICY_REMINDER' },
    { title: 'Challenge Completed', message: 'Congratulations! You completed the Bike to Work Week challenge.', type: 'BADGE_UNLOCK' },
    { title: 'Compliance Issue Filed', message: 'A new compliance issue has been filed in your department. Please review.', type: 'COMPLIANCE_ISSUE' },
    { title: 'Reward Redemption Pending', message: 'Your reward redemption request for Eco Coffee Mug is under review.', type: 'APPROVAL' },
    { title: 'Environmental Goal Update', message: 'Fleet Emissions goal is at 77% progress. Keep pushing!', type: 'POLICY_REMINDER' },
    { title: 'Audit Completed', message: 'Manufacturing department audit completed. Score: 82/100.', type: 'COMPLIANCE_ISSUE' },
    { title: 'New Challenge Available', message: '30-Day Zero Waste Challenge is now open. Join to earn 300 XP!', type: 'BADGE_UNLOCK' },
    { title: 'Training Reminder', message: 'Complete your annual ESG training by end of month.', type: 'POLICY_REMINDER' },
    { title: 'CSR Activity Starting Soon', message: 'Tree Plantation Week begins next Monday. Register now!', type: 'APPROVAL' },
    { title: 'Compliance Issue Resolved', message: 'Waste Segregation Non-Compliance issue has been marked as resolved.', type: 'COMPLIANCE_ISSUE' },
  ];
  for (let i = 0; i < 25; i++) {
    const tmpl = notifTemplates[i % notifTemplates.length];
    const user = users[i % users.length];
    notifCreates.push(
      prisma.notification.create({
        data: {
          userId: user.id,
          title: tmpl.title,
          message: tmpl.message,
          type: tmpl.type,
          isRead: i > 15,
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
  console.log(`  Departments:        6`);
  console.log(`  Users:              50 (admin@ecosphere.com / manager@ecosphere.com / employee@ecosphere.com)`);
  console.log(`  Emission Factors:   6`);
  console.log(`  Carbon Transactions: ${txCreates.length}`);
  console.log(`  Environmental Goals: 8`);
  console.log(`  CSR Activities:     8 (${epCreates.length} participations)`);
  console.log(`  Challenges:         8 (${cpCreates.length} participations)`);
  console.log(`  Policies:           4 (${ackCreates.length} acknowledgments)`);
  console.log(`  Audits:             5`);
  console.log(`  Compliance Issues:  10`);
  console.log(`  Department Scores:  ${scoreCreates.length} (6 months × 6 departments)`);
  console.log(`  Badges:             6 (15 awarded)`);
  console.log(`  Rewards:            6 (8 redemptions)`);
  console.log(`  Notifications:      25`);
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
