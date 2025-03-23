
import React from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, FileText, ArrowRight } from "lucide-react";

const TextInput: React.FC = () => {
  const { inputText, setInputText, extractKnowledgePoints, isLoading } = useKnowledge();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    extractKnowledgePoints();
  };

  return (
    <div className="w-full space-y-4 p-2 fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Step 1
          </span>
          <h3 className="text-lg font-medium">Input Text</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePaste}
          className="flex items-center gap-1 hover:bg-blue-50 transition-colors"
        >
          <ClipboardCopy className="h-4 w-4" />
          <span>Paste</span>
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="min-h-[180px] resize-none p-4 text-base border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <FileText className="absolute right-3 bottom-3 h-5 w-5 text-gray-400" />
        </div>
        
        <Button 
          type="submit" 
          className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          disabled={inputText.trim().length < 10 || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <span>Extract Knowledge Points</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default TextInput;
