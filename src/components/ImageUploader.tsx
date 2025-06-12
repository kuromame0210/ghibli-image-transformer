'use client'

import { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('ファイルサイズは10MB以下にしてください')
      return
    }

    setIsUploading(true)
    
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImageUpload(result)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('File upload error:', error)
      alert('ファイルのアップロードに失敗しました')
      setIsUploading(false)
    }
  }, [onImageUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragging 
            ? 'border-ghibli-blue bg-ghibli-blue/10' 
            : 'border-ghibli-green hover:border-ghibli-blue hover:bg-ghibli-blue/5'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <div className="animate-spin">
              <Upload className="w-12 h-12 text-ghibli-blue" />
            </div>
          ) : (
            <ImageIcon className="w-12 h-12 text-ghibli-green" />
          )}
          
          <div>
            <p className="text-lg font-medium text-ghibli-brown mb-2">
              {isUploading ? 'アップロード中...' : '画像をドラッグ&ドロップ'}
            </p>
            <p className="text-sm text-gray-600">
              または <span className="text-ghibli-blue font-medium">クリックして選択</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, GIF (最大10MB)
            </p>
          </div>
        </div>
      </div>

      {/* <div className="mt-4 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 bg-ghibli-green rounded-full"></span>
          カップルの写真を推奨します
        </p>
        <p className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-ghibli-blue rounded-full"></span>
          結婚式や婚約写真が最適です
        </p>
      </div> */}
    </div>
  )
}