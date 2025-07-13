// app/api/process-image/route.ts
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile) {
      return NextResponse.json(
        { success: false, message: 'No image provided' },
        { status: 400 }
      );
    }

    // Convert to base64
    const buffer = await (imageFile as Blob).arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // Analyze image with Groq
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyze this product image and extract the product name/category. Respond with JSON: {productQuery: string}" 
            },
            { 
              type: "image_url", 
              image_url: { url: imageUrl } 
            }
          ],
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    
    return NextResponse.json({
      success: true,
      productQuery: result.productQuery || "unknown product",
    });
    
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process image' },
      { status: 500 }
    );
  }
}