import React, { useState } from 'react';
import step1Img from '../assets/pwa-guide/step-1.jpeg';
import step2Img from '../assets/pwa-guide/step-2.jpeg';
import step3Img from '../assets/pwa-guide/step-3.jpeg';
import step4Img from '../assets/pwa-guide/step-4.jpeg';
import step5Img from '../assets/pwa-guide/step-5.jpeg';

interface PWAGuideProps {
  onClose: () => void;
}

const STEPS = [
  {
    title: "Step 1: Open Share Menu",
    desc: "Tap the share button in your mobile browser's navigation bar (usually at the bottom or top right).",
    img: step1Img
  },
  {
    title: "Step 2: Add to Home Screen",
    desc: "Scroll down the share sheet options and select 'Add to Home Screen'.",
    img: step2Img
  },
  {
    title: "Step 3: Check Preferences",
    desc: "Verify that the name is correct and the web app configuration looks good.",
    img: step3Img
  },
  {
    title: "Step 4: Save & Locate",
    desc: "Tap 'Add' in the top right. Kickserve will install and appear on your phone's home screen.",
    img: step4Img
  },
  {
    title: "Step 5: Launch & Enjoy",
    desc: "Open Kickserve from your home screen. Enjoy the app in full-screen standalone mode!",
    img: step5Img
  }
];

export const PWAGuide: React.FC<PWAGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="flex flex-col justify-between">
      {/* Step Content */}
      <div className="py-3 flex flex-col items-center justify-center min-h-0">
        <div className="w-full aspect-[9/16] max-h-[38vh] rounded-2xl overflow-hidden border border-[#ded7c4] bg-chalk-100 flex items-center justify-center mb-3.5 shadow-2xs">
          <img src={step.img} alt={step.title} className="w-full h-full object-contain" />
        </div>
        <h3 className="text-sm font-black text-slate-900 text-center tracking-tight">{step.title}</h3>
        <p className="text-xs text-slate-500 text-center mt-1 px-3 leading-relaxed h-12 overflow-y-auto font-medium">
          {step.desc}
        </p>
      </div>

      {/* Navigation Actions */}
      <div className="pt-3 border-t border-chalk-200 space-y-3">
        {/* Dot Indicators */}
        <div className="flex justify-center gap-1.5">
          {STEPS.map((_, idx) => (
            <span 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-5 bg-court-700' : 'w-1.5 bg-chalk-300'}`} 
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex-1 rounded-2xl bg-chalk-100 py-3 text-xs font-bold text-slate-700 hover:bg-chalk-200 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer border border-[#ded7c4]"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 rounded-2xl bg-court-850 hover:bg-court-900 py-3 text-xs font-black text-volt-300 shadow-md transition cursor-pointer border border-court-700/40"
          >
            {currentStep === STEPS.length - 1 ? 'Done' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAGuide;
