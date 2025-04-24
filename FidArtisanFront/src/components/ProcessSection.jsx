import React, { useEffect, useState } from 'react';
import { ClipboardListIcon, UserCheckIcon, MessageCircleIcon } from 'lucide-react';
const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(current => (current + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const steps = [{
    icon: <ClipboardListIcon className="h-10 w-10 text-blue-500" />,
    title: 'Étape 1',
    description: 'Effectuez une recherche en rapport avec votre projet'
  }, {
    icon: <UserCheckIcon className="h-10 w-10 text-blue-500" />,
    title: 'Étape 2',
    description: 'Consultez leurs profils et faites votre choix'
  }, {
    icon: <MessageCircleIcon className="h-10 w-10 text-blue-500" />,
    title: 'Étape 3',
    description: 'Les artisans vous répondent'
  }];
  return <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 text-blue-500">
          Comment engager le bon artisan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => <div key={index} className={`text-center transition-all duration-500 transform ${activeStep === index ? 'scale-110 opacity-100' : 'scale-90 opacity-50'}`}>
              <div className="relative">
                <div className={`bg-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${activeStep === index ? 'animate-bounce' : ''}`}>
                  {step.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default ProcessSection;