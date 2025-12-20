import type { ColorService } from './ColorService.ts';
import type { ColorKey } from '../../domain/graphics/ColorKey.ts';

class ColorServiceImpl implements ColorService {
  public async getColor(_colorKey: ColorKey): Promise<{ textColor: string }> {
    //TODO: change later to real backend call to get color
    const payload = await Promise.resolve({ color: 'black' });
    return { textColor: payload.color };
  }
}

export const useColorService = () => new ColorServiceImpl();
