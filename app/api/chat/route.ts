import { generateChat, generateImage } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { message, messageHistory } = body;

    try {
        const chatResponse = await generateChat(message, messageHistory);
        
        if (chatResponse.shouldGenerateImage) {
            const imageBase64 = await generateImage(message);
            return NextResponse.json({
                text: chatResponse.text, 
                image: imageBase64
            }, { status: 200 });
        }

        return NextResponse.json({
            text: chatResponse.text  
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            error: "An error occurred" 
        }, { status: 500 });
    }
}