
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
  const [messageHistory, setMessageHistory] = useState<{ role: string; content: string }[]>([]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsLoading(true);
    const userMessage = { content: input, type: "user" as const };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
        const chatResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: userMessage.content,
                messageHistory 
            }),
        });

        if (!chatResponse.ok) throw new Error('Chat response failed');
        const data = await chatResponse.json();

        console.log(data);
        
        setMessages(prev => [...prev, {
            content: data.text,
            type: "assistant"
        }]);

        // If there's an image, add it as a separate message
        if (data.image) {
            setMessages(prev => [...prev, {
                content: "Here's what you requested:",
                type: "assistant",
                image: `data:image/jpeg;base64,${data.image}`
            }]);
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