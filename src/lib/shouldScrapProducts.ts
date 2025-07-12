import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export type ScrapingDecision = {
  shouldScrape: boolean;
  productQuery?: string;
  confidence?: number;
};

export async function makeScrapingDecision(userQuery: string): Promise<ScrapingDecision> {
  try {
    // First check if we should scrape
    const shouldScrape = await shouldScrapeProducts(userQuery);
    
    // If we should scrape, extract the product name
    let productQuery = '';
    if (shouldScrape) {
      productQuery = await extractProductName(userQuery);
    }

    return {
      shouldScrape,
      productQuery: shouldScrape ? productQuery : undefined,
      confidence: 0.9 // Could be made dynamic based on response
    };
  } catch (error) {
    console.error('Scraping decision failed:', error);
    return {
      shouldScrape: false,
      confidence: 0
    };
  }
}

async function shouldScrapeProducts(userQuery: string): Promise<boolean> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `Determine if the user is asking about a specific product to buy or compare. 
          Respond ONLY with "yes" or "no".`
        },
        {
          role: "user",
          content: userQuery
        }
      ],
      temperature: 0,
      max_tokens: 3,
    });

    const decision = response.choices[0]?.message?.content?.trim().toLowerCase();
    return decision === "yes";
  } catch (error) {
    console.error('Intent classification failed:', error);
    return false;
  }
}

async function extractProductName(userQuery: string): Promise<string> {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: "Extract the main product name or category from the user's query in 2-3 words. Return ONLY the product name with no additional text."
        },
        {
          role: "user",
          content: userQuery
        }
      ],
      temperature: 0.3,
      max_tokens: 10,
    });

    const productName = response.choices[0]?.message?.content?.trim();
    return productName || userQuery;
  } catch (error) {
    console.error('Product name extraction failed:', error);
    return userQuery;
  }
}