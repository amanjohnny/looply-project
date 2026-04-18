import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createBurst } from './motion.ts';

describe('createBurst', () => {
  it('should return 12 particles by default', () => {
    const burst = createBurst();
    assert.strictEqual(burst.length, 12);
  });

  it('should return the specified number of particles', () => {
    const burst = createBurst(5);
    assert.strictEqual(burst.length, 5);
  });

  it('should return an empty array when count is 0', () => {
    const burst = createBurst(0);
    assert.strictEqual(burst.length, 0);
  });

  it('should calculate particle properties correctly for index 0', () => {
    const burst = createBurst(12);
    const p = burst[0];

    assert.strictEqual(p.id, 0);
    assert.strictEqual(p.x, 40); // cos(0) * 40
    assert.strictEqual(p.y, 0);  // sin(0) * 40
    assert.strictEqual(p.size, 6); // 6 + (0%3)*2
    assert.strictEqual(p.duration, 0.55); // 0.55 + (0%4)*0.08
    assert.strictEqual(p.delay, 0); // (0%5)*0.02
  });

  it('should calculate particle properties correctly for a non-zero index', () => {
    const count = 4;
    const burst = createBurst(count);
    // index 1:
    // angle = (2 * PI * 1) / 4 = PI / 2
    // radius = 40 + (1%4)*10 = 50
    // x = cos(PI/2) * 50 = 0
    // y = sin(PI/2) * 50 = 50

    const p = burst[1];
    assert.strictEqual(p.id, 1);
    assert.ok(Math.abs(p.x - 0) < 0.000001);
    assert.ok(Math.abs(p.y - 50) < 0.000001);
    assert.strictEqual(p.size, 6 + (1 % 3) * 2); // 8
    assert.strictEqual(p.duration, 0.55 + (1 % 4) * 0.08); // 0.63
    assert.strictEqual(p.delay, (1 % 5) * 0.02); // 0.02
  });

  it('should have unique IDs for all particles', () => {
    const count = 20;
    const burst = createBurst(count);
    const ids = new Set(burst.map(p => p.id));
    assert.strictEqual(ids.size, count);
  });
});
