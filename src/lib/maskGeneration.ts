export async function generateBackgroundMask(imageData: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      // 白い背景を作成（マスクされる部分）
      ctx!.fillStyle = 'white'
      ctx!.fillRect(0, 0, canvas.width, canvas.height)
      
      // 中央部分（人物がいると想定される部分）を黒で塗りつぶし（保持される部分）
      ctx!.fillStyle = 'black'
      
      // 人物がいそうな中央エリアを推定
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const personWidth = Math.min(canvas.width * 0.6, canvas.height * 0.8)
      const personHeight = Math.min(canvas.height * 0.9, canvas.width * 1.2)
      
      // 楕円形で人物エリアをマスク
      ctx!.beginPath()
      ctx!.ellipse(
        centerX, 
        centerY, 
        personWidth / 2, 
        personHeight / 2, 
        0, 0, 2 * Math.PI
      )
      ctx!.fill()
      
      resolve(canvas.toDataURL('image/png'))
    }
    
    img.src = imageData
  })
}

export async function createInteractiveMask(
  imageData: string, 
  maskPoints: { x: number; y: number; radius: number }[]
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      canvas.width = img.width
      canvas.height = img.height
      
      // 白い背景（編集される部分）
      ctx!.fillStyle = 'white'
      ctx!.fillRect(0, 0, canvas.width, canvas.height)
      
      // ユーザーが指定した部分を黒で塗る（保持される部分）
      ctx!.fillStyle = 'black'
      
      maskPoints.forEach(point => {
        ctx!.beginPath()
        ctx!.arc(point.x, point.y, point.radius, 0, 2 * Math.PI)
        ctx!.fill()
      })
      
      resolve(canvas.toDataURL('image/png'))
    }
    
    img.src = imageData
  })
}