// "use client";

// import { useEffect, useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Send } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Card } from "@/components/ui/card";
// import Image from "next/image";

// type Message = {
//   content: string;
//   type: "user" | "assistant";
//   image?: string;
// };

// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChat = async () => {
//     if (!input.trim()) return;
//     setIsLoading(true);
//     const userMessage = { content: input, type: "user" as const };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput(""); // Clear input immediately after sending

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: userMessage.content,
//         }),
//       });

//       console.log(res);

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         {
//           content: data.res,
//           type: "assistant",
//         },
//       ]);
//     } catch (error) {
//       console.error("Error in chat:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   const handleImage = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;
    
//     setIsLoading(true);
    
//     // Add user message
//     const userMessage = { content: input, type: "user" as const };
//     setMessages(prev => [...prev, userMessage]);
//     setInput("");

//     try {
//       const response = await fetch('/api/image', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: userMessage.content }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to generate image');
//       }

//       const data = await response.json();
      
//       // Add assistant message with image
//       setMessages(prev => [...prev, {
//         content: "Here's your generated image:",
//         type: "assistant",
//         image: `data:image/jpeg;base64,${data.image}`
//       }]);
//     } catch (error) {
//       setMessages(prev => [...prev, {
//         content: "Sorry, I couldn't generate the image. Please try again.",
//         type: "assistant"
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [])
//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleImage(e);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center bg-background">
//       <header>
//         <div className="container flex h-14 items-center">
//           <div className="flex items-center space-x-2">
//             <h1 className="font-semibold">Chat with Adam</h1>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 overflow-hidden container">
//         <div className="grid h-full">
//           <Card className="flex flex-col h-[calc(100vh-8rem)]">
//             <ScrollArea className="flex-1 p-4">
//               <div className="space-y-4 mb-4">
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={cn(
//                       "flex w-full",
//                       message.type === "user" ? "justify-end" : "justify-start"
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "rounded-lg px-4 py-2 max-w-[80%]",
//                         message.type === "user"
//                           ? "bg-primary text-primary-foreground"
//                           : "bg-muted"
//                       )}
//                     >
//                       <p className="whitespace-pre-wrap">{message.content}</p>
//                       {message.image && (
//                         <div className="relative mt-2 aspect-[4/3] w-full">
//                           <Image
//                             src={message.image}
//                             alt="Generated image"
//                             fill
//                             className="object-contain rounded-lg"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <div className="flex justify-start">
//                     <div className="bg-muted rounded-lg px-4 py-2">
//                       <div className="flex space-x-2">
//                         <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
//                         <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
//                         <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </ScrollArea>

//             <div className="p-4 border-t">
//               <div className="flex space-x-2">
//                 <Input
//                   placeholder="Type a message..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   onKeyDown={handleKeyPress}
//                   disabled={isLoading}
//                   className="flex-1"
//                 />
//                 <Button
//                   onClick={handleImage}
//                   disabled={isLoading || !input.trim()}
//                   size="icon"
//                 >
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import Image from "next/image";

type Message = {
  content: string;
  type: "user" | "assistant";
  image?: string;
};

type ImageContext = {
  subject: string;
  description: string;
  timestamp: number;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const imageContextHistory = useRef<ImageContext[]>([]);

  // Keywords that trigger image generation
  const imageGenerationTriggers = {
    show: ["show", "display", "see", "look", "picture", "image", "photo"],
    appearance: ["look like", "appear", "appearance", "wearing", "dressed"],
    location: ["where", "place", "location", "background", "scene", "standing"],
    action: ["doing", "playing", "performing", "acting", "dancing", "singing"],
  };

  const shouldGenerateImage = (text: string): boolean => {
    const lowercaseText = text.toLowerCase();
    return Object.values(imageGenerationTriggers).some(triggerGroup =>
      triggerGroup.some(trigger => lowercaseText.includes(trigger))
    );
  };

  const getRelevantImageContext = (prompt: string): ImageContext | null => {
    if (imageContextHistory.current.length === 0) return null;

    // Look for references to previous images in the prompt
    const relevantContexts = imageContextHistory.current
      .filter(context => {
        const subjectWords = context.subject.toLowerCase().split(' ');
        const promptWords = prompt.toLowerCase().split(' ');
        return subjectWords.some(word => promptWords.includes(word));
      })
      .sort((a, b) => b.timestamp - a.timestamp);

    return relevantContexts[0] || null;
  };

  const updateImageContext = (subject: string, description: string) => {
    imageContextHistory.current.push({
      subject,
      description,
      timestamp: Date.now(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = { content: input, type: "user" as const };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      // First, get the chat response
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!chatResponse.ok) throw new Error('Chat response failed');
      const chatData = await chatResponse.json();

      // Add the chat response
      setMessages(prev => [...prev, {
        content: chatData.res,
        type: "assistant",
      }]);

      // Check if we should generate an image
      if (shouldGenerateImage(userMessage.content)) {
        // Get relevant context if it exists
        const context = getRelevantImageContext(userMessage.content);
        
        // Modify the prompt based on context if it exists
        let imagePrompt = userMessage.content;
        if (context) {
          imagePrompt = `${imagePrompt} (Maintain consistency with previous image: ${context.description})`;
        }

        const imageResponse = await fetch('/api/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          
          // Update image context history
          updateImageContext(
            userMessage.content,
            context ? `${context.description}, ${userMessage.content}` : userMessage.content
          );

          // Add the image response
          setMessages(prev => [...prev, {
            content: "Here's what you requested:",
            type: "assistant",
            image: `data:image/jpeg;base64,${imageData.image}`
          }]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        content: "Sorry, I encountered an error. Please try again.",
        type: "assistant"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Rest of your component remains the same...
  
    return (
        <div className="flex flex-col items-center bg-background">
          <header>
            <div className="container flex h-14 items-center">
              <div className="flex items-center space-x-2">
                <h1 className="font-semibold">Chat with Adam</h1>
              </div>
            </div>
          </header>
    
          <main className="flex-1 overflow-hidden container">
            <div className="grid h-full">
              <Card className="flex flex-col h-[calc(100vh-8rem)]">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 mb-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex w-full",
                          message.type === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 max-w-[80%]",
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.image && (
                            <div className="relative mt-2 aspect-[4/3] w-full">
                              <Image
                                src={message.image}
                                alt="Generated image"
                                fill
                                className="object-contain rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
    
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      );
}