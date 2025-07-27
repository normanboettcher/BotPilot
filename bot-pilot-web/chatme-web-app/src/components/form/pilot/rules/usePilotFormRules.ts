/**
 * Custom hook for form validation rules in a pilot form.
 */
export const useEmailValidation = () => {
  return {
    rules: [
      (value: string) => {
        const emailPattern = /^[^\s@]+@(?:[^\s@.]+\.)+[^\s@.]+$/;
        return emailPattern.test(value) || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      },
      (value: string) =>
        (value && value.trim().length > 0) || 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
    ],
  };
};

/**
 * Custom hook for phone number validation rules.
 */
export const usePhoneNumberValidation = () => {
  return {
    rules: [
      (value: string) => {
        const phonePattern = /^\+?[0-9\s-]+$/;
        return phonePattern.test(value) || 'Bitte geben Sie eine gültige Telefonnummer ein.';
      },
      (value: string) =>
        (value && value.trim().length > 0) || 'Bitte geben Sie Ihre Telefonnummer ein.',
    ],
  };
};

/**
 * Custom hook for pilot form validation rules.
 */
const usePilotFormRules = () => {
  const { rules: emailRules } = useEmailValidation();
  const { rules: phoneRules } = usePhoneNumberValidation();
  return {
    textFieldRules: [(value: string) => !!value || 'Bitte geben Sie einen gültigen Text ein.'],
    emailRules,
    phoneRules,
  };
};

export default usePilotFormRules;
