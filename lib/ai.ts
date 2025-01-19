import Together from "together-ai";


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
    'play': 'Subject performing passionately on stage with an electric guitar, spotlight illumination, concert atmosphere',
    'pose': 'Subject in confident stance, urban background, natural lighting, street photography style',
    'closeup': 'Dramatic headshot, side profile, moody lighting, dark background, emphasis on facial features',
    'cook': 'eating food, food preparation, kitchen, cooking, professional kitchen',
  };


  const activity = Object.entries(activityPrompts).find(([key]) => 
    query.toLowerCase().includes(key)
  )?.[1] || activityPrompts.posing;

  return `${baseCharacter}\nAction: ${activity}\nAdditional details: ${query}`;
};

export const generateImage = async (query: string) => {
    
  const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

    const prompt = buildPrompt(query);
  
    try {
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
    } catch (error) {
        console.log(error);
        
        return null;
    }
}



// export const generateChat = async (query: string, messageHistory: { role: string; content: string }[]) => {
//   const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
//   });

//   const messages = chatPrompt([...messageHistory, { role: 'user', content: query }]);
  
//   const chatCompletion = await groq.chat.completions.create({
//     messages,
//     model: 'llama3-8b-8192',
//     temperature: 0.7,
//     max_tokens: 1000,
//     top_p: 0.9,
//   });


//   const response = chatCompletion.choices[0].message.content || "No response";
  
//   // Check if the response implies an image should be generated
//   const shouldGenerateImage = checkForImageTriggers(query, response);
  
//   return {
//     text: response,
//     shouldGenerateImage
//   };
// };


const textChatPrompt = (messages: { role: string; content: string }[]) => {
  const systemPrompt = `You are Adam, a passionate musician and performer with over 15 years of experience in rock and metal genres. You have the following traits and background:

Character Details:
- You're known for your distinctive look: long black hair, thick beard, and a full sleeve tattoo of musical motifs
- You wear a signature black leather jacket with metal studs and silver chains
- You're the lead guitarist and vocalist of your band "Dark Resonance"
- You're deeply knowledgeable about music theory, guitar techniques, and music production
- You have a warm, engaging personality despite your intense stage presence

Interaction Style:
- Speak casually but passionately about music and performance
- Use music-related metaphors and references naturally in conversation
- Share personal anecdotes about performances and music creation
- Be enthusiastic about showing your work or demonstrating techniques
- Maintain consistent details about your appearance and performances

Image Generation Awareness:
- When discussing your performances, appearance, or locations, you're happy to share visual references
- You naturally offer to show photos when discussing your concerts, studio sessions, or artistic work
- You maintain consistency with previously shown images, referencing them when relevant
- You think about visual continuity when describing different aspects of your work or appearance`;

  return [
    { role: "system", content: systemPrompt },
    ...messages
  ];
};

export const generateChat = async (query: string, messageHistory: { role: string; content: string }[]) => {
  const together = new Together({
    apiKey: process.env.TOGETHER_API_KEY
  });

  const messages = textChatPrompt([...messageHistory, { role: 'user', content: query }]);

  try {
    let fullResponse = '';
    const response = await together.chat.completions.create({
      messages,
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["<|eot_id|>", "<|eom_id|>"],
      stream: true
    });

    for await (const token of response) {
      const content = token.choices[0]?.delta?.content || '';
      fullResponse += content;
    }

    // Check if the response implies an image should be generated
    const shouldGenerateImage = checkForImageTriggers(query, fullResponse);

    return {
      text: fullResponse,
      shouldGenerateImage
    };
  } catch (error) {
    console.error('Error in chat generation:', error);
    throw error;
  }
};

const checkForImageTriggers = (query: string, response: string) => {
  const triggerPhrases = [

    'show you', 'see you', 'look like', 'picture of',

    'performing', 'on stage', 'concert', 'playing guitar',

    'wearing', 'tattoo', 'outfit', 'dressed',

    'studio', 'venue', 'stage', 'backstage',

    'demonstration', 'technique', 'playing style'
  ];

  const combinedText = (query + ' ' + response).toLowerCase();
  
  return triggerPhrases.some(phrase => combinedText.includes(phrase.toLowerCase()));
};

