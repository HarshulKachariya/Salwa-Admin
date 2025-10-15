import React from "react";

interface StepperLayoutProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  children: React.ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  onFinish?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
}

const StepperLayout: React.FC<StepperLayoutProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  children,
  onPrevious,
  onNext,
  onFinish,
  isFirstStep = false,
  isLastStep = false,
  isLoading = false,
}) => {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Service Category / INSURANCE SERVICES / EVALUATE INSURANCE MEDICAL
              NETWORK
            </div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                  <React.Fragment key={stepNumber}>
                    <div className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted
                            ? "bg-gray-800 text-white"
                            : isCurrent
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          stepNumber
                        )}
                      </div>
                    </div>
                    {stepNumber < totalSteps && (
                      <div
                        className={`w-12 h-0.5 ${
                          isCompleted ? "bg-gray-800" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Step Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Step {currentStep} - {stepTitles[currentStep - 1]}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between">
            <button
              onClick={onPrevious}
              disabled={isFirstStep || isLoading}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isFirstStep || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              PREVIOUS
            </button>

            <div className="flex space-x-4">
              {isLastStep ? (
                <button
                  onClick={onFinish}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
                >
                  {isLoading ? "Processing..." : "FINISH"}
                </button>
              ) : (
                <button
                  onClick={onNext}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    isLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
                >
                  {isLoading ? "Processing..." : "NEXT"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepperLayout;
