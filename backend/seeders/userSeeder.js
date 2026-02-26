require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { query } = require('../db/database');

async function seed() {
  const users = [
    { name: 'Admin User', email: 'admin@example.com', password: 'password123' },
    { name: 'John Doe',   email: 'john@example.com',  password: 'password123' },
    { name: 'Jane Smith', email: 'jane@example.com',  password: 'password123' },
  ];

  console.log('Seeding users...');

  for (const user of users) {
    const existing = await query('SELECT id FROM users WHERE email = $1', [user.email]);
    if (existing.rows.length > 0) {
      console.log(`  ⚠️  ${user.email} already exists, skipping.`);
      continue;
    }
    const hashed = await bcrypt.hash(user.password, 10);
    await query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [user.name, user.email, hashed]);
    console.log(`  ✅ Created: ${user.email} / ${user.password}`);
  }

  console.log('\nDone! Login with admin@example.com / password123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });