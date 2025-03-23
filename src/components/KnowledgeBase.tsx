
import React, { useRef, useState, useEffect } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bookmark, MessageCircle, Send, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const KnowledgeBase: React.FC = () => {
  const { savedPoints, chatMessages, addChatMessage } = useKnowledge();
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addChatMessage(query, true);
      setQuery("");
      
      // Focus input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };
  
  if (!savedPoints.length) {
    return (
      <div className="desktop-section h-[400px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
        <div className="flex flex-col items-center space-y-2 px-4 py-8 text-center">
          <Bookmark className="h-10 w-10 text-gray-400" />
          <h3 className="text-base font-medium text-gray-700">Your Knowledge Base is Empty</h3>
          <p className="text-xs text-gray-500">
            Save knowledge points to build your personal knowledge base
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="desktop-section p-4 fade-in">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="desktop-badge bg-indigo-50 text-indigo-700">
            Knowledge Base
          </span>
          <h3 className="text-base font-medium">Chat with Your Knowledge</h3>
        </div>
        <div className="text-xs text-gray-500">
          {savedPoints.length} saved items
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-3">
          <div className="relative desktop-input-container">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input 
              placeholder="Search knowledge base..." 
              className="pl-8 text-xs h-8 border-none focus-visible:ring-0"
            />
          </div>
          
          <ScrollArea className="h-[380px] rounded-md border bg-white">
            <div className="p-2 space-y-2">
              {savedPoints.map((point) => (
                <Card key={point.id} className="cursor-pointer hover:border-blue-200 transition-colors shadow-sm">
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-xs font-medium line-clamp-1">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-1">
                    <p className="text-[11px] text-gray-500 line-clamp-2">{point.content}</p>
                  </CardContent>
                  {point.timestamp && (
                    <CardFooter className="p-3 pt-0">
                      <p className="text-[10px] text-gray-400">
                        {format(new Date(point.timestamp), 'MMM d, yyyy')}
                      </p>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="md:col-span-2">
          <Card className="shadow-sm h-[420px] flex flex-col border-gray-200">
            <CardHeader className="p-3 border-b bg-gray-50">
              <CardTitle className="text-sm flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                Knowledge Assistant
              </CardTitle>
              <CardDescription className="text-xs">
                Ask questions about your saved knowledge
              </CardDescription>
            </CardHeader>
            
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {chatMessages.length === 0 && (
                  <div className="h-60 flex items-center justify-center text-center">
                    <div className="space-y-2">
                      <MessageCircle className="h-10 w-10 text-gray-200 mx-auto" />
                      <p className="text-gray-400 text-xs">Ask a question to start chatting</p>
                    </div>
                  </div>
                )}
                
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-2.5 rounded-lg text-xs ${
                        message.isUser
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.content}</p>
                      <div className={`text-[10px] mt-1 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {format(new Date(message.timestamp), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <CardFooter className="p-3 border-t bg-gray-50">
              <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about your knowledge base..."
                  className="flex-1 h-8 text-xs"
                  ref={inputRef}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!query.trim()}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
