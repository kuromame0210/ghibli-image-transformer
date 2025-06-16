'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import ImageGenerator from '@/components/ImageGenerator'
import DebugPanel from '@/components/DebugPanel'
import { Upload, Sparkles, Heart } from 'lucide-react'


export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any[]>([])

  const handleDebugInfo = (info: any) => {
    setDebugInfo(prev => [...prev, info])
  }

  const handleDirectGenerate = async (prompt: string) => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
      }
    } catch (error) {
      console.error('Direct generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen ghibli-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-ghibli-brown">
              ジブリ風画像変換ジェネレータ
            </h1>
            <Sparkles className="text-ghibli-blue w-8 h-8" />
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            スタジオジブリ風の画像を生成するジェネレーターです
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="text-ghibli-green w-5 h-5" />
                <h2 className="text-xl font-semibold text-ghibli-brown">
                  写真をアップロード
                </h2>
              </div>
              <ImageUploader onImageUpload={setUploadedImage} />
              
              {uploadedImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    アップロードされた画像:
                  </h3>
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-48 object-cover rounded-lg border-2 border-ghibli-green/30"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generation Section */}
          <div className="lg:col-span-2">
            <ImageGenerator
              uploadedImage={uploadedImage}
              onGenerated={setGeneratedImage}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onDebugInfo={handleDebugInfo}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>スタジオジブリ風の画像を生成するジェネレーターです</p>
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel 
        onDirectGenerate={handleDirectGenerate} 
        debugInfo={debugInfo}
      />
    </main>
  )
}