import type { ColorKey } from '../../domain/graphics/ColorKey.ts';

export interface ColorService {
  getColor(colorKey: ColorKey): Promise<{ textColor: string }>;
}
