// app/api/aiover/route.ts
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { scrapeWalmartSearch } from "@/lib/walmart-scrapper";
import type {
  ChatCompletionContentPart,
  ChatCompletionMessageParam,
} from "groq-sdk/resources/chat/completions";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface Product {
  title: string;
  link: string;
  image: string;
  price: string;
  stars: string; // or number if you prefer
  reviewCount: string; // or number
  reviews: {
    rating5: string[];
    rating4: string[];
    rating3: string[];
    rating2: string[];
    rating1: string[];
  };
}

// async function scrapeProductData(query: string): Promise<Product[]> {
//   try {
//     const walmartProducts = await scrapeWalmartSearch(query, 3);

//     return walmartProducts.map(product => ({
//       name: product.title,
//       rating: parseFloat(product.stars) || 4.0,
//       reviews: product.reviewCount,
//       features: [
//         `Price: ${product.price}`,
//         ...Object.values(product.reviews)
//           .flat()
//           .filter((review): review is string => typeof review === 'string')
//       ],
//       platform: 'Walmart',
//       price: product.price
//     }));
//   } catch (error) {
//     console.error('Scraping failed:', error);
//     return [];
//   }
// }

// async function runAssistant(userInput: string | null, imageUrl: string | null = null): Promise<string> {
//   let messages: ChatCompletionMessageParam[] = [];

//   if (imageUrl) {
//     const content: ChatCompletionContentPart[] = [
//       {
//         type: 'text',
//         text: 'Describe or analyze the image.'
//       },
//       {
//         type: 'image_url',
//         image_url: {
//           url: imageUrl
//         }
//       }
//     ];

//     messages = [
//       {
//         role: 'user',
//         content
//       }
//     ];
//   } else if (userInput && /which variant|is better|compare|difference between|buy/i.test(userInput)) {
//     const jsonText = JSON.stringify({ userInput }, null, 2);
//     console.log("JSON text",jsonText)

//     const prompt = `You are a product review analyst. Given the following product data in JSON format from Walmart, summarize the comparison between products.
// Explain each product in a point-wise manner. Only include relevant buyer information like features, ratings, and price indicators.

// JSON data:
// ${jsonText}`;

//     messages = [
//       { role: 'system', content: 'You are a helpful assistant.' },
//       { role: 'user', content: prompt }
//     ];
//   } else if (userInput) {
//     const prompt = `Answer the following question in under 100 words.\n\n${userInput}`;
//     messages = [
//       { role: 'system', content: 'You are a concise assistant.' },
//       { role: 'user', content: prompt }
//     ];
//   } else {
//     return 'Please provide either text or image input.';
//   }

//   try {
//     const response = await groq.chat.completions.create({
//       model: 'meta-llama/llama-4-scout-17b-16e-instruct',
//       messages,
//       temperature: 1,
//       max_tokens: 1024,
//       top_p: 1,
//       stream: false
//     });

//     return response.choices[0]?.message?.content || 'No response generated';
//   } catch (error) {
//     console.error('Groq API error:', error);
//     return 'Sorry, I encountered an error processing your request.';
//   }
// }

// export async function POST(request: Request) {
//   const { userInput, imageUrl } = await request.json();

//   try {
//     if (!userInput && !imageUrl) {
//       return NextResponse.json(
//         { success: false, message: 'Missing input parameters' },
//         { status: 400 }
//       );
//     }

//     const response = await runAssistant(userInput, imageUrl);

//     return NextResponse.json({
//       success: true,
//       message: response
//     });

//   } catch (error) {
//     console.error('API error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Internal server error',
//         error: process.env.NODE_ENV === 'development' ? error : undefined
//       },
//       { status: 500 }
//     );
//   }
// }
interface RequestBody {
  userInput: string;
  products?: Product[];
  imageUrl?: string;
}

export async function POST(request: Request) {
  const { userInput, products, imageUrl }: RequestBody = await request.json();

  try {
    if (!userInput && !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Missing input parameters" },
        { status: 400 }
      );
    }

    let messages: ChatCompletionMessageParam[] = [];

    // Handle image analysis case
    if (imageUrl) {
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image:" },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ];
    }
    // Handle product comparison case
    // In the product comparison case section:
    else if (products && products.length > 0) {
      const productSummary = products.map((p) => ({
        title: p.title,
        price: p.price,
        rating: p.stars,
        reviewCount: p.reviewCount,
        keyFeatures: [
          `Price: ${p.price}`,
          `Rating: ${p.stars} (${p.reviewCount} reviews)`,
          ...Object.entries(p.reviews).flatMap(([rating, reviews]) =>
            reviews.slice(0, 2).map((review) => `${rating} star: ${review}`)
          ),
        ],
      }));

      messages = [
        {
          role: "system",
          content: `You are an expert shopping assistant and product analyst. Your task is to:
1. Thoroughly analyze all provided product data
2. Compare products across these key dimensions:
   - Price value
   - Rating and review sentiment
   - Feature completeness
   - Overall value proposition
3. Identify the best product based on analysis, explaining your reasoning
4. Provide a detailed comparison highlighting pros/cons of each
5. Give personalized recommendations based on the user's query: "${userInput}"
6. Consider both objective metrics and subjective review sentiment
7. Format your response with clear headings and bullet points

Structure your response as:
- **Analysis Summary**: Brief overview
- **Product Comparison**: Detailed feature-by-feature comparison
- **Best Overall**: Your top pick with justification
- **Alternatives**: Other good options with their strengths
- **Recommendation**: Final advice based on user needs`,
        },
        {
          role: "user",
          content: `Please analyze and compare these products based on the user request: "${userInput}"
      
Product Data:
${JSON.stringify(productSummary, null, 2)}`,
        },
      ];
    }
    // Regular text query
    else {
      messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userInput },
      ];
    }

    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return NextResponse.json({
      success: true,
      message: response.choices[0]?.message?.content || "No response generated",
      products: products || undefined, // Return products if we have them
      imageUrl: imageUrl || undefined, // Return imageUrl if we have it
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
