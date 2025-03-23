
import React from "react";
import { useKnowledge } from "@/context/KnowledgeContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { List, Check, Circle, Bookmark } from "lucide-react";
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
      <div className="desktop-section h-60 flex items-center justify-center slide-up">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Extracting knowledge points...</p>
        </div>
      </div>
    );
  }

  if (knowledgePoints.length === 0) {
    return (
      <div className="desktop-section h-60 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300 slide-up">
        <div className="flex flex-col items-center space-y-2 px-4 py-8 text-center">
          <List className="h-10 w-10 text-gray-400" />
          <h3 className="text-base font-medium text-gray-700">No Knowledge Points Yet</h3>
          <p className="text-xs text-gray-500">
            Enter text and click "Extract Knowledge Points" to analyze your content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="desktop-section p-4 slide-up">
      <div className="flex items-center space-x-2 mb-3">
        <span className="desktop-badge bg-green-50 text-green-700">
          Step 2
        </span>
        <h3 className="text-base font-medium">Knowledge Points</h3>
      </div>
      
      <div className="desktop-point-list max-h-[400px] overflow-y-auto pr-1">
        {knowledgePoints.map((point) => (
          <div 
            key={point.id}
            className={`desktop-point-item ${point.selected ? 'selected' : ''}`}
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
                  className="block text-sm font-medium cursor-pointer"
                >
                  {point.title}
                </label>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{point.content}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(point)}
                className="h-7 w-7 text-blue-600 hover:bg-blue-50 transition-colors"
                title="Save to knowledge base"
              >
                <Bookmark className="h-3.5 w-3.5" />
              </Button>
            </div>
            
            {point.selected && (
              <div className="absolute -right-1 -top-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                  <Check className="h-2.5 w-2.5" />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgePointList;
