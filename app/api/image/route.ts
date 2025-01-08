import { generateImage } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        console.log("prompt = ",prompt);
    
        if (!prompt) {
            return NextResponse.json(
            { error: 'Prompt is required' },
            { status: 400 }
            );
        }
    
        const imageBase64 = await generateImage(prompt);
        
        return NextResponse.json({ image: imageBase64 });
    
    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}
  