import type { ColorService } from './ColorService.ts';
import type { ColorKey } from '../../domain/graphics/ColorKey.ts';

class ColorServiceImpl implements ColorService {
  public async getColor(colorKey: ColorKey): Promise<{ color: string }> {
    //TODO: change later to real backend call to get color
    if (colorKey === 'user_chat_bubble') {
      return { color: '#7593A2' };
    }
    if (colorKey === 'chat_text') {
      return { color: 'black' };
    }
    return Promise.resolve({ color: 'black' });
  }
}

export const useColorService = () => new ColorServiceImpl();
