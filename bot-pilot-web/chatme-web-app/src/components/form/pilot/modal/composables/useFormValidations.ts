import { computed, type Ref } from 'vue';
import type { FormData } from '@components/form/pilot/modal/composables/useFormData.ts';

const useFormValidations = (formData: Ref<FormData>) => {
  const kontaktdatenValid = computed(() => {
    return (
      formData.value.kontaktdaten.kanzlei !== '' &&
      formData.value.kontaktdaten.telefon !== '' &&
      formData.value.kontaktdaten.email !== '' &&
      formData.value.kontaktdaten.ansprechpartner !== ''
    );
  });
  const faqsValid = computed(() => {
    return formData.value.faqs.filter((f) => f.question !== '' && f.response !== '').length === 10;
  });
  const formDataValid = computed(() => {
    return kontaktdatenValid.value && faqsValid.value;
  });
  return {
    kontaktdatenValid,
    faqsValid,
    formDataValid,
  };
};

export default useFormValidations;
