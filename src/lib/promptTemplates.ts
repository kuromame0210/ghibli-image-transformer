
export interface PromptTemplate {
  basePrompt: string
  seasonalElements: Record<string, string>
  timeElements: Record<string, string>
  colorSchemes: Record<string, string>
  fantasyLevels: Record<number, string>
}

export const ghibliWeddingTemplate: PromptTemplate = {
  basePrompt: `
    Studio Ghibli style wedding scene with a couple blessed by forest fairies,
    highly detailed anime art in the style of Hayao Miyazaki and Kazuo Oga,
    
    [Character Description]
    • Bride in white wedding dress with lace wing patterns and flowing veil
    • Groom in elegant morning coat
    • Crossed hands with ribbons of light flowing between them
    • Blushing smiles with stars sparkling in their eyes
    • Veil and corsage petals dancing in magical wind
    
    [Background Details]
    • Stone castle converted into wedding venue with spiral staircase and stained glass
    • Floating blessing text made of light particles in the air
    • Giant flower clock in the center of the venue decorated with seasonal flowers
    • Glass ceiling with golden twilight light streaming through
    
    [Natural Elements]
    • Ivy vines crawling on the floor with small blooming flowers
    • Fairy butterflies entering through windows
    • Rose vines wrapped around venue pillars
    • Countless floating candles providing soft ambient lighting
    
    [Additional Details]
    • Precise background art in the style of Studio Ghibli art director Kazuo Oga
    • Hidden forest creatures in venue decorations (deer sculptures that seem to blink)
    • Cloud sea reflection on glass floor
    • Small grimoire peeking from groom's pocket
    `,

  seasonalElements: {
    '春': 'Cherry blossom petals and wisteria flowers blooming, soft pink and purple hues, gentle spring breeze',
    '夏': 'Lush green foliage, sunflowers and lavender, bright vibrant colors, warm golden light',
    '秋': 'Autumn maple leaves, chrysanthemums, warm orange and red tones, harvest atmosphere',
    '冬': 'Snow crystals, evergreen branches, white and silver tones, crystalline magic particles'
  },

  timeElements: {
    'マジックアワー': 'Golden hour lighting just after sunset, amber glow gradient, magical atmosphere',
    '朝': 'Soft morning light, dew drops, fresh and pure atmosphere, gentle sunrise colors',
    '昼': 'Bright daylight streaming through glass, clear and vibrant colors, cheerful atmosphere',
    '夜': 'Moonlight and starlight, deep blue tones, mysterious and romantic atmosphere with fireflies'
  },

  colorSchemes: {
    'パールホワイト': 'Pearl white and ecru color palette, elegant and pure tones',
    'ワインレッド': 'Wine red roses as accent colors, rich and passionate tones',
    'アンバーグロウ': 'Amber glow gradient lighting, warm golden atmosphere',
    'パステルブルー': 'Pastel blue magical effects, soft and dreamy atmosphere'
  },

  fantasyLevels: {
    1: 'Subtle magical elements, realistic with slight fantasy touches',
    2: 'Light magical particles, gentle fantasy atmosphere',
    3: 'Moderate magical effects, floating objects and glowing elements',
    4: 'Strong magical presence, multiple fairy creatures and magical phenomena',
    5: 'Maximum magical particles and effects, full fantasy wonderland atmosphere'
  }
}

export function generateGhibliWeddingPrompt(): string {
  return `この画像をスタジオジブリ風にして欲しい。`
}

export function generateCompleteGhibliPrompt(): string {
  return `この画像をスタジオジブリ風にして欲しい。`
}

export function generateBackgroundOnlyPrompt(): string {
  return `この画像をスタジオジブリ風にして欲しい。`
}

export function generateRealisticWeddingPrompt(): string {
  return `この画像をスタジオジブリ風にして欲しい。`
}

export function generateNaturalEditPrompt(): string {
  return `この画像をスタジオジブリ風にして欲しい。`
}