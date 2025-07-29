import type { Kontaktdaten } from '@domain/Kontaktdaten.ts';
import type { Faq } from '@domain/Faq.ts';
import { reactive } from 'vue';

export type FormData = {
  kontaktdaten: Kontaktdaten;
  faqs: Array<Faq>;
};
const useFormData = () => {
  const formData = reactive<FormData>({
    kontaktdaten: {
      anmerkungen: '',
      kanzlei: '',
      telefon: '',
      email: '',
      ansprechpartner: '',
    },
    faqs: Array.from({ length: 10 }, () => ({
      question: '',
      response: '',
    })),
  });
  return { formData };
};
export default useFormData;
