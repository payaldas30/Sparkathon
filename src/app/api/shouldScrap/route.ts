import { NextResponse } from 'next/server';
import { makeScrapingDecision } from '@/lib/shouldScrapProducts';

export async function POST(request: Request) {
  try {
    const { userQuery } = await request.json();

    if (!userQuery) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing userQuery parameter" 
        },
        { status: 400 }
      );
    }

    const decision = await makeScrapingDecision(userQuery);

    return NextResponse.json({
      success: true,
      ...decision
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}