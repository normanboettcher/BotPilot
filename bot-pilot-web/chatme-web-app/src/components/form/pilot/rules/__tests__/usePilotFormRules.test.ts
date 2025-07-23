import { useEmailValidation } from '@components/form/pilot/rules/usePilotFormRules.ts';
import { describe, it, expect } from 'vitest';

describe('Testcases for useEmailValidation', () => {
  const { rules: emailRules } = useEmailValidation();
  const [emailFormatRule, emailRequiredRule] = emailRules;

  describe('Email Format Validation', () => {
    it.each([
      ['test@example.com', true],
      ['user.name@domain.com', true],
      ['user+label@example.com', true],
      ['test@subdomain.domain.com', true],
      ['test@domain.co.uk', true],
      ['test.email@domain.com', true],
      ['123@domain.com', true],
      ['test@123.com', true],
      ['test', false],
      ['test@', false],
      ['@domain.com', false],
      ['test@domain', false],
      ['test@.com', false],
      ['test@domain..com', false],
      ['test@dom ain.com', false],
      ['', false],
      ['test@@domain.com', false],
      [' test@domain.com', false],
      ['test@domain.com ', false],
    ])('should validate email "%s" as %s', (email: string, expected: boolean) => {
      const result = emailFormatRule(email);
      if (expected) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      }
    });
  });
  describe('Required Field Validation', () => {
    it.each([
      ['test@example.com', true],
      ['', false],
      [' ', false],
      ['  ', false],
      ['\t', false],
      ['\n', false],
      ['    ', false],
    ])('should validate required field "%s" as %s', (value: string, expected: boolean) => {
      const result = emailRequiredRule(value);
      if (expected) {
        expect(result).toBe(true);
      } else {
        expect(result).toBe('Bitte geben Sie Ihre E-Mail-Adresse ein.');
      }
    });
  });
});
