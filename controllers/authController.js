const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const SALT_ROUNDS = 12;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT configuration is missing', 500);
  }

  return process.env.JWT_SECRET;
};

const signToken = (userId) =>
  jwt.sign({ user_id: userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, phone, role_id } = req.body;

  if (!full_name || !email || !password || !phone || role_id === undefined || role_id === null) {
    throw new AppError('full_name, email, password, phone, and role_id are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!normalizedEmail.includes('@')) {
    throw new AppError('A valid email address is required', 400);
  }

  if (String(password).length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  const roleResult = await pool.query('SELECT role_id FROM roles WHERE role_id = $1', [role_id]);

  if (roleResult.rowCount === 0) {
    throw new AppError('Invalid role_id', 400);
  }

  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);

  try {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, full_name, email, phone, role_id, created_at`,
      [full_name.trim(), normalizedEmail, passwordHash, String(phone).trim(), role_id]
    );

    res.status(201).json({
      status: 'OK',
      message: 'User registered successfully',
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      throw new AppError('Email is already registered', 409);
    }

    throw error;
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const result = await pool.query(
    `SELECT u.user_id, u.full_name, u.password_hash, r.role_name
     FROM users u
     INNER JOIN roles r ON r.role_id = u.role_id
     WHERE u.email = $1`,
    [normalizedEmail]
  );

  if (result.rowCount === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(String(password), user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user.user_id);

  res.status(200).json({
    status: 'OK',
    message: 'Login successful',
    data: {
      token,
      user_id: user.user_id,
      full_name: user.full_name,
      role_name: user.role_name,
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT u.user_id, u.full_name, u.email, u.phone, u.role_id, r.role_name, u.created_at
     FROM users u
     INNER JOIN roles r ON r.role_id = u.role_id
     WHERE u.user_id = $1`,
    [req.user.user_id]
  );

  if (result.rowCount === 0) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    status: 'OK',
    data: result.rows[0],
  });
});

module.exports = {
  register,
  login,
  getProfile,
};
