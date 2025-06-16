'use client'

import { useState } from 'react'
import { generateGhibliWeddingPrompt } from '@/lib/promptTemplates'
import { Sparkles, Download, RefreshCw, Edit3 } from 'lucide-react'

interface ImageGeneratorProps {
  uploadedImage: string | null
  onGenerated: (imageUrl: string) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  onDebugInfo?: (debugInfo: any) => void
}

export default function ImageGenerator({
  uploadedImage,
  onGenerated,
  isGenerating,
  setIsGenerating,
  onDebugInfo
}: ImageGeneratorProps) {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [customPrompt, setCustomPrompt] = useState<string>(generateGhibliWeddingPrompt())
  const [useCustomPrompt, setUseCustomPrompt] = useState<boolean>(false)

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('画像をアップロードしてください')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const prompt = useCustomPrompt && customPrompt.trim() ? customPrompt : generateGhibliWeddingPrompt()

      // デバッグ情報を送信
      if (onDebugInfo) {
        onDebugInfo({
          type: 'request',
          timestamp: new Date().toISOString(),
          data: {
            prompt,
            hasImage: !!uploadedImage
          }
        })
      }

      // uploadedImageをBlobに変換
      const imageResponse = await fetch(uploadedImage)
      const imageBlob = await imageResponse.blob()
      
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('image', imageBlob, 'uploaded-image.jpg')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries()),
          errorData
        })
        throw new Error(`画像生成に失敗しました (${response.status}): ${errorData.error || 'Unknown error'}`)
      }

      const data = await response.json()
      
      // レスポンスのデバッグ情報を送信
      if (onDebugInfo) {
        onDebugInfo({
          type: 'response',
          timestamp: new Date().toISOString(),
          data: {
            status: response.status,
            statusText: response.statusText,
            responseData: data,
            success: !data.error
          }
        })
      }
      
      if (data.error) {
        throw new Error(data.error)
      }

      setGeneratedImage(data.imageUrl)
      onGenerated(data.imageUrl)
      
    } catch (err) {
      console.error('Generation error:', {
        error: err,
        message: err instanceof Error ? err.message : '画像生成に失敗しました',
        stack: err instanceof Error ? err.stack : null,
        name: err instanceof Error ? err.name : 'Unknown',
        cause: err instanceof Error ? (err as any).cause : null,
        timestamp: new Date().toISOString(),
        uploadedImagePresent: !!uploadedImage,
        promptUsed: useCustomPrompt && customPrompt.trim() ? customPrompt : 'default'
      })
      
      // エラーのデバッグ情報を送信
      if (onDebugInfo) {
        onDebugInfo({
          type: 'error',
          timestamp: new Date().toISOString(),
          data: {
            error: err instanceof Error ? err.message : '画像生成に失敗しました',
            stack: err instanceof Error ? err.stack : null,
            name: err instanceof Error ? err.name : 'Unknown',
            cause: err instanceof Error ? (err as any).cause : null,
            uploadedImagePresent: !!uploadedImage,
            promptUsed: useCustomPrompt && customPrompt.trim() ? customPrompt : 'default'
          }
        })
      }
      
      setError(err instanceof Error ? err.message : '画像生成に失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `ghibli-wedding-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download error:', err)
      setError('ダウンロードに失敗しました')
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg h-fit">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-ghibli-blue w-5 h-5" />
        <h2 className="text-xl font-semibold text-ghibli-brown">
          ジブリ風画像生成
        </h2>
      </div>

      {/* Prompt Customization */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="useCustomPrompt"
            checked={useCustomPrompt}
            onChange={(e) => setUseCustomPrompt(e.target.checked)}
            className="w-4 h-4 text-ghibli-green bg-gray-100 border-gray-300 rounded focus:ring-ghibli-green focus:ring-2"
          />
          <label htmlFor="useCustomPrompt" className="flex items-center gap-2 text-sm font-medium text-ghibli-brown cursor-pointer">
            <Edit3 className="w-4 h-4" />
            カスタムプロンプトを使用
          </label>
        </div>
        
        {useCustomPrompt && (
          <div>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="生成したい画像のスタイルや内容を詳しく説明してください...&#10;例：柔らかい水彩画のような、緑豊かな森の中の幻想的なシーン"
              className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ghibli-green focus:border-transparent resize-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              空欄の場合はデフォルトのジブリ風プロンプトが使用されます
            </p>
          </div>
        )}
      </div>

      {/* Generation Button */}
      <div className="mb-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !uploadedImage}
          className={`
            w-full py-4 px-6 rounded-lg font-medium text-white transition-all duration-200
            flex items-center justify-center gap-3
            ${isGenerating || !uploadedImage
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-ghibli-green to-ghibli-blue hover:from-ghibli-blue hover:to-ghibli-green transform hover:scale-105'
            }
          `}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              ジブリ風画像生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              ジブリ風画像を生成
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Generated Image Display */}
      {generatedImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated Ghibli-style wedding scene"
              className="w-full rounded-lg shadow-lg border-2 border-ghibli-gold/30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 px-4 bg-wedding-gold hover:bg-wedding-gold/80 text-ghibli-brown font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              ダウンロード
            </button>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 py-3 px-4 bg-ghibli-green hover:bg-ghibli-green/80 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              再生成
            </button>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {isGenerating && (
        <div className="space-y-4">
          <div className="w-full h-64 bg-ghibli-cream/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="magic-particles-container relative w-16 h-16 mx-auto mb-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="magic-particles"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
              <p className="text-ghibli-brown font-medium">
                画像を変換しています...
              </p>
              <p className="text-sm text-gray-600 mt-1">
                完成まで約30-60秒お待ちください
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}