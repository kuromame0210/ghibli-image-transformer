export interface FaceData {
  x: number
  y: number
  width: number
  height: number
}

export async function detectFaces(imageData: string): Promise<FaceData[]> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      
      // 簡易的な顔検出（実際の実装では機械学習ライブラリを使用）
      // ここでは画像の中央部分を顔として仮定
      const faceWidth = Math.min(img.width, img.height) * 0.4
      const faceHeight = faceWidth * 1.2
      const faceX = (img.width - faceWidth) / 2
      const faceY = (img.height - faceHeight) / 2.5
      
      resolve([{
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight
      }])
    }
    img.src = imageData
  })
}

export async function extractFace(imageData: string, faceData: FaceData): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = faceData.width
      canvas.height = faceData.height
      
      ctx?.drawImage(
        img,
        faceData.x, faceData.y, faceData.width, faceData.height,
        0, 0, faceData.width, faceData.height
      )
      
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = imageData
  })
}

export async function compositeImages(
  backgroundImage: string,
  faceImage: string,
  facePosition: FaceData
): Promise<string> {
  return new Promise((resolve) => {
    const bgImg = new Image()
    const faceImg = new Image()
    let loadedCount = 0
    
    // CORSを許可
    bgImg.crossOrigin = 'anonymous'
    faceImg.crossOrigin = 'anonymous'
    
    const onLoad = () => {
      loadedCount++
      if (loadedCount === 2) {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        canvas.width = bgImg.width
        canvas.height = bgImg.height
        
        // 背景を描画
        ctx?.drawImage(bgImg, 0, 0)
        
        // 顔を描画（適切な位置に配置）
        ctx?.drawImage(
          faceImg,
          facePosition.x,
          facePosition.y,
          facePosition.width,
          facePosition.height
        )
        
        resolve(canvas.toDataURL('image/png'))
      }
    }
    
    bgImg.onload = onLoad
    faceImg.onload = onLoad
    
    bgImg.src = backgroundImage
    faceImg.src = faceImage
  })
}