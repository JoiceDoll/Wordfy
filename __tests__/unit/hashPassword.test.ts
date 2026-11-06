import { createSalt, hashPassword } from '@/shared/utils';

describe('hashPassword', () => {
  it('produces stable hashes for the same password and salt', () => {
    const salt = createSalt();
    const a = hashPassword('secret123', salt);
    const b = hashPassword('secret123', salt);
    const c = hashPassword('other', salt);

    expect(a).toBe(b);
    expect(a).not.toBe(c);
    expect(a).toHaveLength(64);
  });
});
