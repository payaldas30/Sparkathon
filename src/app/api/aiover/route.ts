import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import type {
  //ChatCompletionContentPart,
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
  stars: string;
  reviewCount: string;
  reviews: {
    rating5: string[];
    rating4: string[];
    rating3: string[];
    rating2: string[];
    rating1: string[];
  };
}

interface RequestBody {
  userInput: string;
  products?: Product[];
  imageUrl?: string;
}

// Separate function for image analysis
async function analyzeImage(imageUrl: string): Promise<{ productQuery: string; description: string }> {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: [
        { type: "text", text: "Analyze this product image and extract: 1. The main product name/category, 2. Key visual features. Respond with JSON format: {productQuery: string, description: string}" },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    },
  ];

  const response = await groq.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages,
    temperature: 0.3, // Lower temperature for more factual responses
    response_format: { type: "json_object" },
    max_tokens: 300,
  });

  try {
    const result = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      productQuery: result.productQuery || "unknown product",
      description: result.description || "No description available"
    };
  } catch (error) {
    console.error("Error parsing image analysis response:", error);
    return {
      productQuery: "unknown product",
      description: "Unable to analyze image"
    };
  }
}

// Main processing function
async function processUserRequest(userInput: string, products?: Product[]) {
  let messages: ChatCompletionMessageParam[] = [];

  if (products && products.length > 0) {
    const productSummary = products.map((p) => ({
      title: p.title,
      price: p.price,
      rating: p.stars,
      reviewCount: p.reviewCount,
      keyFeatures: [
        `Price: ${p.price}`,
        `Rating: ${p.stars} (${p.reviewCount} reviews)`,
        ...Object.entries(p.reviews).flatMap(([rating, reviews]) =>
          reviews.slice(0, 2).map((review) => `${rating} star: ${review}`))
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
  } else {
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

  return response.choices[0]?.message?.content || "No response generated";
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

    const analysisResult = {
      message: "",
      products: products || undefined,
      productQuery: "",
      imageDescription: ""
    };

    if (imageUrl) {
      // Step 1: Image analysis
      const imageAnalysis = await analyzeImage(imageUrl);
      analysisResult.productQuery = imageAnalysis.productQuery;
      analysisResult.imageDescription = imageAnalysis.description;
      
      // Step 2: Process the extracted product query
      analysisResult.message = await processUserRequest(
        `I found this product: ${imageAnalysis.productQuery}. ${userInput || "Tell me about it"}`,
        products
      );
    } else {
      // Regular text processing
      analysisResult.message = await processUserRequest(userInput, products);
    }

    return NextResponse.json({
      success: true,
      ...analysisResult
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