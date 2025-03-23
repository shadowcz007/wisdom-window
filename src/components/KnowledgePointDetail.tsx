
import React, { useState, useEffect } from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, BookOpen, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const KnowledgePointDetail: React.FC = () => {
  const { selectedPoint, savePoint } = useKnowledge();
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reset saved state when a new point is selected
    setIsSaved(false);
    
    // Add animation when changing selected point
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [selectedPoint]);

  if (!selectedPoint) {
    return (
      <div className="w-full h-60 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 slide-in-right">
        <div className="flex flex-col items-center space-y-2 px-4 py-8 text-center">
          <Info className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">No Knowledge Point Selected</h3>
          <p className="text-sm text-gray-500">
            Select a knowledge point from the list to view details
          </p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    savePoint(selectedPoint);
    setIsSaved(true);
    toast.success("Knowledge point saved to your collection!");
  };

  // Generate analogies and insights
  const generateAnalogy = (content: string) => {
    const concepts = [
      "This is like building a mental bridge between concepts.",
      "Imagine this as planting seeds of knowledge that will grow into a forest of understanding.",
      "Think of this as collecting puzzle pieces that form a complete picture.",
      "This concept works like a compass that guides your thinking.",
      "It's similar to creating a map for navigating complex ideas."
    ];
    
    // Deterministically choose based on content length
    const index = content.length % concepts.length;
    return concepts[index];
  };

  const generateInsight = (content: string) => {
    const insights = [
      "Consider how this knowledge connects to your existing understanding.",
      "Reflect on how this idea might challenge or confirm your assumptions.",
      "Think about applying this concept in different contexts.",
      "Explore how this knowledge might evolve or change over time.",
      "Question the boundaries and limitations of this concept."
    ];
    
    // Deterministically choose based on content length
    const index = (content.length * 2) % insights.length;
    return insights[index];
  };

  return (
    <div className="w-full space-y-4 p-2">
      <div className="flex items-center space-x-2">
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Step 3
        </span>
        <h3 className="text-lg font-medium">Knowledge Point Details</h3>
      </div>
      
      <Card className={`overflow-hidden transition-all duration-300 shadow-sm ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl">{selectedPoint.title}</CardTitle>
          <CardDescription>
            Explore this knowledge point in depth
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
              Content
            </h4>
            <p className="text-gray-800">{selectedPoint.content}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Analogy</h4>
            <p className="text-gray-800 bg-blue-50 p-3 rounded-md">
              {generateAnalogy(selectedPoint.content)}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Critical Thinking</h4>
            <p className="text-gray-800 bg-purple-50 p-3 rounded-md">
              {generateInsight(selectedPoint.content)}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 pb-4">
          {isSaved ? (
            <Button variant="outline" className="w-full" disabled>
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Saved to Knowledge Base
            </Button>
          ) : (
            <Button 
              onClick={handleSave} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save to Knowledge Base
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default KnowledgePointDetail;
