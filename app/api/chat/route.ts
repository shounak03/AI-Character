import { generateChat } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";
import { log } from "util";

export const POST = async(req: NextRequest) =>{
    
    try {
        const body = await req.json();
      const { message } = body;
    
        console.log("MESSAGE = ",message);
        if(!message)
            return NextResponse.json({message:"Please provide a prompt"},{status:400});
        
        
        const res = await generateChat(message);

        console.log("response = ",res);
    
        return NextResponse.json({res},{status:200});
        
    } catch (error) {
        console.log(error);
        
        return NextResponse.json(error,{status:200});
    }

}