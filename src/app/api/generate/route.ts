import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import fetch from 'node-fetch'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const imageFile = formData.get('image') as File

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (!imageFile) {
      // 画像がない場合は固定画像を使用（デバッグ用）
      const imagePath = path.join(process.cwd(), 'src', 'image', '1000_F_493438708_qN7H3so9umkuzzVhnRTMRFue15p6HWsx.jpg')
      
      if (!fs.existsSync(imagePath)) {
        return NextResponse.json(
          { error: 'Image file is required' },
          { status: 400 }
        )
      }

      const form = new FormData()
      form.append('image', fs.createReadStream(imagePath), {
        filename: '1000_F_493438708_qN7H3so9umkuzzVhnRTMRFue15p6HWsx.jpg',
        contentType: 'image/jpeg'
      })
      form.append('prompt', prompt || "この画像をスタジオジブリ風にして欲しい。")
      form.append('model', 'gpt-image-1')
      form.append('n', '1')
      form.append('size', '1024x1024')

      const apiResponse = await fetch('https://api.openai.com/v1/images/edits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          ...form.getHeaders()
        },
        body: form
      })

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text()
        return NextResponse.json(
          { 
            error: `OpenAI API Error: ${apiResponse.status}`,
            details: errorText
          },
          { status: 500 }
        )
      }

      const response = await apiResponse.json() as { data: Array<{ b64_json?: string; url?: string }> }
      const imageData = response.data[0]
      
      if (!imageData) {
        return NextResponse.json(
          { error: 'No image data received' },
          { status: 500 }
        )
      }

      if (imageData.b64_json) {
        const base64Image = `data:image/png;base64,${imageData.b64_json}`
        return NextResponse.json({ imageUrl: base64Image })
      } else if (imageData.url) {
        return NextResponse.json({ imageUrl: imageData.url })
      } else {
        return NextResponse.json(
          { error: 'No valid image format received' },
          { status: 500 }
        )
      }
    }

    // アップロードされた画像をBufferに変換
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

    const form = new FormData()
    form.append('image', imageBuffer, {
      filename: imageFile.name,
      contentType: imageFile.type
    })
    form.append('prompt', prompt || "この画像をスタジオジブリ風にして欲しい。")
    form.append('model', 'gpt-image-1')
    form.append('n', '1')
    form.append('size', '1024x1024')
    const apiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    })

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text()
      return NextResponse.json(
        { 
          error: `OpenAI API Error: ${apiResponse.status}`,
          details: errorText
        },
        { status: 500 }
      )
    }

    const response = await apiResponse.json() as { data: Array<{ b64_json?: string; url?: string }> }
    const imageData = response.data[0]
    
    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data received' },
        { status: 500 }
      )
    }

    if (imageData.b64_json) {
      const base64Image = `data:image/png;base64,${imageData.b64_json}`
      return NextResponse.json({ imageUrl: base64Image })
    } else if (imageData.url) {
      return NextResponse.json({ imageUrl: imageData.url })
    } else {
      return NextResponse.json(
        { error: 'No valid image format received' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('API Route Error Details:', {
      error,
      message: error?.message || 'Unknown error occurred',
      stack: error?.stack,
      name: error?.name,
      cause: (error as any)?.cause,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        openAIKeyLength: process.env.OPENAI_API_KEY?.length || 0
      }
    })
    
    const errorMessage = error?.message || 'Unknown error occurred'
    return NextResponse.json(
      { 
        error: `画像編集エラー: ${errorMessage}`,
        details: error?.stack || 'No stack trace available',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}