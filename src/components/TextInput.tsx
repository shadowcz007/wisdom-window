
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
    <div className="w-full space-y-4 p-4 desktop-section">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="desktop-badge step-badge">
            Step 1
          </span>
          <h3 className="text-base font-medium">Input Text</h3>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={handlePaste}
          className="desktop-button"
        >
          <ClipboardCopy className="h-3.5 w-3.5" />
          <span>Paste</span>
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative desktop-input-container">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter or paste your text here..."
            className="desktop-textarea"
          />
          <FileText className="absolute right-3 bottom-3 h-4 w-4 text-gray-400" />
        </div>
        
        <Button 
          type="submit" 
          className="w-full desktop-primary-button"
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
