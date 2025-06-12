'use client'

import { useState } from 'react'
import { Settings, Eye, EyeOff } from 'lucide-react'
import { generateGhibliWeddingPrompt } from '@/lib/promptTemplates'

interface DebugPanelProps {
  onDirectGenerate?: (prompt: string) => void
  debugInfo?: any[]
}

export default function DebugPanel({ onDirectGenerate, debugInfo }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const handleDirectGenerate = () => {
    if (onDirectGenerate && customPrompt) {
      // ダミーのFormDataを作成してテスト用プロンプトを送信
      const form = new FormData()
      form.append('prompt', customPrompt)
      // テスト用には固定画像を使用
      fetch('/api/generate', {
        method: 'POST',
        body: form
      }).then(response => response.json())
        .then(data => console.log('Debug test result:', data))
        .catch(error => console.error('Debug test error:', error))
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-ghibli-green text-white rounded-full shadow-lg hover:bg-ghibli-green/80"
      >
        <Settings className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-[600px] bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-ghibli-green/30 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-ghibli-brown">
          デバッグ情報
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在のプロンプト:
          </label>
          <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-sm">
            {generateGhibliWeddingPrompt()}
          </div>
        </div>

        {/* API リクエスト/レスポンス履歴 */}
        {debugInfo && debugInfo.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API リクエスト/レスポンス履歴:
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {debugInfo.slice(-5).reverse().map((info, index) => (
                <div key={index} className={`p-3 border rounded text-xs ${
                  info.type === 'request' ? 'bg-blue-50 border-blue-200' :
                  info.type === 'response' ? 'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {info.type === 'request' ? '📤 Request' :
                       info.type === 'response' ? '📥 Response' :
                       '❌ Error'}
                    </span>
                    <span className="text-gray-500">
                      {new Date(info.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(info.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カスタムプロンプト（テスト用）:
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="テスト用のプロンプトを入力..."
            className="w-full h-24 p-2 border border-gray-300 rounded text-sm resize-none"
          />
        </div>

        <button
          onClick={handleDirectGenerate}
          disabled={!customPrompt}
          className="w-full py-2 px-4 bg-ghibli-blue text-white rounded hover:bg-ghibli-blue/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
        >
          カスタムプロンプトで生成
        </button>

        <div className="text-xs text-gray-600">
          <p>APIリクエスト/レスポンスの詳細とテスト用カスタムプロンプトを確認できます</p>
        </div>
      </div>
    </div>
  )
}