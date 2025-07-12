// app/api/aiover/route.ts
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { scrapeWalmartSearch } from '@/lib/walmart-scrapper';
import type {
  ChatCompletionContentPart,
  ChatCompletionMessageParam
} from 'groq-sdk/resources/chat/completions';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

interface Product {
  name: string;
  rating: number;
  reviews: string;
  features: string[];
  platform: string;
  price?: string;
}

async function scrapeProductData(query: string): Promise<Product[]> {
  try {
    const walmartProducts = await scrapeWalmartSearch(query, 3);

    return walmartProducts.map(product => ({
      name: product.title,
      rating: parseFloat(product.stars) || 4.0,
      reviews: product.reviewCount,
      features: [
        `Price: ${product.price}`,
        ...Object.values(product.reviews)
          .flat()
          .filter((review): review is string => typeof review === 'string')
      ],
      platform: 'Walmart',
      price: product.price
    }));
  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  }
}

async function runAssistant(userInput: string | null, imageUrl: string | null = null): Promise<string> {
  let messages: ChatCompletionMessageParam[] = [];

  if (imageUrl) {
    const content: ChatCompletionContentPart[] = [
      {
        type: 'text',
        text: 'Describe or analyze the image.'
      },
      {
        type: 'image_url',
        image_url: {
          url: imageUrl
        }
      }
    ];

    messages = [
      {
        role: 'user',
        content
      }
    ];
  } else if (userInput && /which variant|is better|compare|difference between|buy/i.test(userInput)) {
    const products = await scrapeProductData(userInput);
    const jsonText = JSON.stringify({ products }, null, 2);

    const prompt = `You are a product review analyst. Given the following product data in JSON format, summarize the comparison between products.
Explain each product in a point-wise manner. Only include relevant buyer information like features, ratings, and price indicators.

JSON data:
${jsonText}`;

    messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ];
  } else if (userInput) {
    const prompt = `Answer the following question in under 100 words.\n\n${userInput}`;
    messages = [
      { role: 'system', content: 'You are a concise assistant.' },
      { role: 'user', content: prompt }
    ];
  } else {
    return 'Please provide either text or image input.';
  }

  try {
    const response = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Groq API error:', error);
    return 'Sorry, I encountered an error processing your request.';
  }
}

export async function POST(request: Request) {
  const { userInput, imageUrl } = await request.json();

  try {
    if (!userInput && !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing input parameters' },
        { status: 400 }
      );
    }

    const response = await runAssistant(userInput, imageUrl);

    return NextResponse.json({
      success: true,
      message: response
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
