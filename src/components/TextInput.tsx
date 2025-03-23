
import React, { useEffect } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClipboardCopy, FileText, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TextInput: React.FC = () => {
  const { inputText, setInputText, extractKnowledgePoints, isLoading, saveKnowledgeBase, knowledgePoints } = useKnowledge();
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({
        title: "Text Pasted",
        description: "Content pasted from clipboard",
      });
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      toast({
        title: "Paste Failed",
        description: "Could not access clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim().length > 1) {
      extractKnowledgePoints();
    } else {
      toast({
        title: "Text Too Short",
        description: "Please enter at least 2 characters",
        variant: "destructive",
      });
    }
  };

  const handleSaveKnowledgeBase = () => {
    if (knowledgePoints.length === 0) {
      toast({
        title: "Nothing to Save",
        description: "Extract knowledge points first",
        variant: "destructive",
      });
      return;
    }

    saveKnowledgeBase();

    toast({
      title: "Saved to Knowledge Base",
      description: "Your knowledge points have been saved",
    });
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
          className="desktop-button group"
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

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 desktop-primary-button"
            disabled={!inputText.trim() || inputText.trim().length < 2 || isLoading}
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

          {knowledgePoints.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveKnowledgeBase}
              className="desktop-button"
            >
              <Save className="h-4 w-4" />
              <span>Save to KB</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TextInput;
