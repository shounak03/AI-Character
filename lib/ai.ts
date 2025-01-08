import Together from "together-ai";
import Groq from 'groq-sdk';

const buildPrompt = (query: string) => {
  const baseCharacter = `
    Subject: A male musician/performer
    Physical appearance:
    - Long, flowing black hair
    - Fair complexion
    - Thick black beard, well-groomed
    - Athletic build
    
    Attire:
    - Black leather jacket with metal studs
    - Loose-fitting dark baggy pants
    - Multiple silver chains around neck
    - Visible detailed tattoo sleeve on right arm featuring rock music motifs
    
    Setting: Professional photography, dramatic lighting, 4K ultra-detailed, photorealistic
    Style: Cinematic, high contrast, sharp focus
    Camera: High-end DSLR, shallow depth of field
  `.trim();

  const activityPrompts: Record<string, string> = {
    'playing': 'Subject performing passionately on stage with an electric guitar, spotlight illumination, concert atmosphere',
    'posing': 'Subject in confident stance, urban background, natural lighting, street photography style',
    'closeup': 'Dramatic headshot, side profile, moody lighting, dark background, emphasis on facial features',
    'full': 'Full body shot, industrial backdrop, golden hour lighting, emphasizing complete outfit and stance'
  };


  const activity = Object.entries(activityPrompts).find(([key]) => 
    query.toLowerCase().includes(key)
  )?.[1] || activityPrompts.posing;

  return `${baseCharacter}\nAction: ${activity}\nAdditional details: ${query}`;
};

export const generateImage = async (query: string) => {
    const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

    const prompt = buildPrompt(query);
  
    const response = await together.images.create({
        model: "black-forest-labs/FLUX.1-dev",
        prompt: prompt,
        width: 1024,
        height: 768,
        steps: 17,
        n: 1,
        seed:42,
        response_format: "b64_json"
  
      })
    return response.data[0].b64_json
}


export const generateChat = async(query:string) =>{
        const prompt = buildPrompt(query)
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
        });
      
       return chatCompletion.choices[0].message.content || "No response"
      
}
