import assert from 'node:assert';
import { test, describe } from 'node:test';

// We'll define the secure randomness logic here to test it in isolation
// before applying it to the main file.
const secureMathRandom = () => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
};

describe('Security Fix Verification', () => {
  test('secureMathRandom returns values in range [0, 1)', () => {
    for (let i = 0; i < 1000; i++) {
      const val = secureMathRandom();
      assert.ok(val >= 0 && val < 1, `Value ${val} should be between 0 and 1`);
    }
  });

  test('secureMathRandom distribution looks reasonable', () => {
    let sum = 0;
    const iterations = 10000;
    for (let i = 0; i < iterations; i++) {
      sum += secureMathRandom();
    }
    const average = sum / iterations;
    // Average should be around 0.5
    assert.ok(average > 0.45 && average < 0.55, `Average ${average} is too far from 0.5`);
  });

  test('Invite code generation format matches GL-XXXX', () => {
    const generateCode = () => `GL-${secureMathRandom().toString(36).slice(2, 6).toUpperCase()}`;
    for (let i = 0; i < 100; i++) {
      const code = generateCode();
      assert.match(code, /^GL-[A-Z0-9]{4}$/, `Code ${code} does not match expected format`);
    }
  });

  test('getRandomInt secure implementation', () => {
    const getRandomInt = (min: number, max: number) =>
      Math.floor(secureMathRandom() * (max - min + 1)) + min;

    const results = new Set();
    for (let i = 0; i < 1000; i++) {
      const val = getRandomInt(1, 10);
      assert.ok(val >= 1 && val <= 10);
      results.add(val);
    }
    // Should hit all numbers eventually
    assert.strictEqual(results.size, 10);
  });
});
