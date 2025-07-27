import type { Kontaktdaten } from '@domain/Kontaktdaten.ts';
import type { Faq } from '@domain/Faq.ts';
import { ref } from 'vue';

export type FormData = {
  kontaktdaten: Kontaktdaten;
  faqs: Array<Faq>;
};
const useFormData = () => {
  const formData = ref<FormData>({
    kontaktdaten: {
      anmerkungen: '',
      kanzlei: '',
      telefon: '',
      email: '',
      ansprechpartner: '',
    },
    faqs: Array(10).fill({ question: '', response: '' }),
  });
  return { formData };
};
export default useFormData;
