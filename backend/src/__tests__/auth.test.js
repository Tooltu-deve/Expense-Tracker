import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

vi.mock('../config/db.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

import pool from '../config/db.js';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when email and password are missing', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalid', password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid email');
  });

  it('returns 400 when password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: '12345' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('6 characters');
  });

  it('returns 409 when email already exists', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1 }]]);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'exists@example.com', password: 'password123' });
    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already registered');
  });

  it('returns 201 and token when registration succeeds', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe('new@example.com');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when email and password are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('required');
  });

  it('returns 401 when user not found', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Invalid');
  });
});
