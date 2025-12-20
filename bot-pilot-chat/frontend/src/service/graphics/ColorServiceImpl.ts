class ColorServiceImpl implements ColorService {
  public async getColor(colorKey: ColorKey): Promise<{ color: string }> {
    return await Promise.resolve({ color: 'black' });
  }
}

export const useColorService = () => new ColorServiceImpl();
