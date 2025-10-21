import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ProcessingState } from '../types/types';

interface ProcessingStepsProps {
  currentState: ProcessingState;
  steps: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ currentState, steps }) => {
  const getStepStatus = (stepId: string, currentStep: number) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  const getCurrentStepIndex = () => {
    switch (currentState.status) {
      case 'idle': return 0;
      case 'uploading': return 1;
      case 'processing': return 2;
      case 'completed': return 3;
      case 'error': return 2;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id, currentStepIndex);
        
        return (
          <div key={step.id} className="flex items-start space-x-4">
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              status === 'completed' 
                ? 'bg-green-500' 
                : status === 'current' 
                ? 'bg-blue-500 animate-pulse' 
                : 'bg-gray-300'
            }`}>
              {status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-white" />
              ) : status === 'current' ? (
                <Clock className="h-5 w-5 text-white" />
              ) : (
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className={`font-medium ${
                status === 'completed' 
                  ? 'text-green-700' 
                  : status === 'current' 
                  ? 'text-blue-700' 
                  : 'text-gray-500'
              }`}>
                {step.name}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {step.description}
              </div>
              
              {/* Progress Bar for Current Step */}
              {status === 'current' && currentState.status === 'processing' && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentState.progress}%` }}
                  />
                </div>
              )}
              
              {/* Status Message */}
              {status === 'current' && currentState.message && (
                <div className="text-sm text-blue-600 mt-2">
                  {currentState.message}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Error State */}
      {currentState.status === 'error' && (
        <div className="flex items-center space-x-2 mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div className="text-red-700">
            <strong>Error:</strong> {currentState.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingSteps;
