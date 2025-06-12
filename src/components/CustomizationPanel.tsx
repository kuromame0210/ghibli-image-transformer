'use client'

import { CustomizationOptions } from '@/app/page'
import { Settings2, Palette, Clock, Sparkles } from 'lucide-react'

interface CustomizationPanelProps {
  options: CustomizationOptions
  onChange: (options: CustomizationOptions) => void
}

export default function CustomizationPanel({ options, onChange }: CustomizationPanelProps) {
  const updateOption = <K extends keyof CustomizationOptions>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    onChange({ ...options, [key]: value })
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="text-ghibli-green w-5 h-5" />
        <h2 className="text-xl font-semibold text-ghibli-brown">
          カスタマイズ設定
        </h2>
      </div>

      <div className="space-y-6">
        {/* Season Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="text-ghibli-blue w-4 h-4" />
            <label className="text-sm font-medium text-ghibli-brown">
              季節設定
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['春', '夏', '秋', '冬'] as const).map((season) => (
              <button
                key={season}
                onClick={() => updateOption('season', season)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${options.season === season
                    ? 'bg-ghibli-green text-white shadow-md'
                    : 'bg-ghibli-cream hover:bg-ghibli-green/20 text-ghibli-brown'
                  }
                `}
              >
                {season === '春' && '🌸'} {season === '夏' && '🌻'} 
                {season === '秋' && '🍁'} {season === '冬' && '❄️'} {season}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="text-ghibli-blue w-4 h-4" />
            <label className="text-sm font-medium text-ghibli-brown">
              時間帯
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['マジックアワー', '朝', '昼', '夜'] as const).map((time) => (
              <button
                key={time}
                onClick={() => updateOption('timeOfDay', time)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${options.timeOfDay === time
                    ? 'bg-ghibli-blue text-white shadow-md'
                    : 'bg-ghibli-cream hover:bg-ghibli-blue/20 text-ghibli-brown'
                  }
                `}
              >
                {time === 'マジックアワー' && '🌅'} {time === '朝' && '🌄'} 
                {time === '昼' && '☀️'} {time === '夜' && '🌙'} {time}
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="text-ghibli-blue w-4 h-4" />
            <label className="text-sm font-medium text-ghibli-brown">
              色彩設計
            </label>
          </div>
          <div className="space-y-2">
            {([
              'パールホワイト',
              'ワインレッド', 
              'アンバーグロウ',
              'パステルブルー'
            ] as const).map((color) => (
              <button
                key={color}
                onClick={() => updateOption('colorScheme', color)}
                className={`
                  w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 text-left
                  ${options.colorScheme === color
                    ? 'bg-wedding-gold text-ghibli-brown shadow-md'
                    : 'bg-ghibli-cream hover:bg-wedding-gold/20 text-ghibli-brown'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    color === 'パールホワイト' ? 'bg-white border-2 border-gray-300' :
                    color === 'ワインレッド' ? 'bg-wedding-rose' :
                    color === 'アンバーグロウ' ? 'bg-wedding-gold' :
                    'bg-ghibli-blue'
                  }`} />
                  {color}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fantasy Level Slider */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-ghibli-blue w-4 h-4" />
            <label className="text-sm font-medium text-ghibli-brown">
              ファンタジー度: {options.fantasyLevel}/5
            </label>
          </div>
          <div className="space-y-3">
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={options.fantasyLevel}
              onChange={(e) => updateOption('fantasyLevel', parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
              className="w-full h-2 bg-ghibli-cream rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>控えめ</span>
              <span>標準</span>
              <span>強い</span>
              <span>とても強い</span>
              <span>最大</span>
            </div>
          </div>
        </div>

        {/* Preview Description */}
        <div className="bg-ghibli-cream/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-ghibli-brown mb-2">
            現在の設定プレビュー
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• {options.season}の季節設定</p>
            <p>• {options.timeOfDay}の時間帯</p>
            <p>• {options.colorScheme}の色彩</p>
            <p>• ファンタジー度 {options.fantasyLevel}/5</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8FBC8F;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8FBC8F;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}