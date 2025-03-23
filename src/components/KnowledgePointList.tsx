
import React from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { List, Check, Circle, Bookmark, BookOpen, Save } from "lucide-react";
import { toast } from "sonner";

const KnowledgePointList: React.FC = () => {
  const { 
    knowledgePoints, 
    setKnowledgePoints, 
    setSelectedPoint, 
    selectedPoint,
    savePoint,
    isLoading
  } = useKnowledge();

  const handlePointSelect = (id: string) => {
    // Update selection state
    const updatedPoints = knowledgePoints.map(point => 
      point.id === id ? { ...point, selected: !point.selected } : point
    );
    setKnowledgePoints(updatedPoints);
    
    // Set selected point for detail view
    const selected = updatedPoints.find(p => p.id === id);
    if (selected && selected.selected) {
      setSelectedPoint(selected);
    } else if (selectedPoint && selectedPoint.id === id) {
      setSelectedPoint(null);
    }
  };

  const handleSave = (point: typeof knowledgePoints[0]) => {
    savePoint(point);
    toast.success("Knowledge point saved!");
  };

  if (isLoading) {
    return (
      <div className="w-full h-60 flex items-center justify-center slide-up">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Extracting knowledge points...</p>
        </div>
      </div>
    );
  }

  if (knowledgePoints.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300 slide-up">
        <div className="flex flex-col items-center space-y-2 px-4 py-8 text-center">
          <List className="h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700">No Knowledge Points Yet</h3>
          <p className="text-sm text-gray-500">
            Enter text and click "Extract Knowledge Points" to analyze your content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-2 slide-up">
      <div className="flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Step 2
        </span>
        <h3 className="text-lg font-medium">Knowledge Points</h3>
      </div>
      
      <ul className="space-y-3">
        {knowledgePoints.map((point) => (
          <li 
            key={point.id}
            className={`
              relative p-4 rounded-lg border transition-all transform 
              ${point.selected 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'}
            `}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id={point.id}
                checked={point.selected}
                onCheckedChange={() => handlePointSelect(point.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor={point.id}
                  className="block font-medium cursor-pointer"
                >
                  {point.title}
                </label>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{point.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(point)}
                className="h-8 w-8 text-blue-500 hover:bg-blue-100 transition-colors"
                title="Save to knowledge base"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            
            {point.selected && (
              <div className="absolute -right-1 -top-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KnowledgePointList;
