type ColorKey = 'chat_text';

export interface ColorService {
  getColor(colorKey: ColorKey): Promise<{ color: string }>;
}
