import { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, UserIcon } from 'lucide-react';
import user1 from '../assets/images/user1.jpg';
import user2 from '../assets/images/user2.jpg';
import user3 from '../assets/images/user3.jpg';
const testimonials = [{
  id: 1,
  name: 'Laurent Mbarga',
  role: 'Propriétaire',
  rating: 5,
  src: user1,
  text: 'FidArtisan est un endroit que je recommande aux personnes expérimentées. Si vous avez besoin de faire remplacer votre évier, allez chez FidArtisan.'
}, {
  id: 2,
  name: 'Marie Tchuente',
  role: 'Architecte',
  rating: 4,
  src:user2,
  text: "J'ai trouvé des artisans de qualité pour plusieurs de mes projets. Le processus est simple et les résultats sont toujours au rendez-vous."
}, {
  id: 3,
  name: 'Jeanne Vetou',
  role: 'Entrepreneur',
  rating: 5,
  src:user3,
  text: "En tant qu'entrepreneur dans la construction, FidArtisan m'a permis de trouver rapidement des artisans qualifiés pour mes chantiers."
}];
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     handleNext();
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, );
  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
    setTimeout(() => setIsAnimating(false), 500);
  };
  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };
  return <section className="w-full bg-white py-12 md:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 uppercase">
          Témoignages
        </h2>
        <div className="relative">
          <div className="max-w-3xl mx-auto">
            <div className="relative h-[400px]">
              {testimonials.map((testimonial, index) => <div key={testimonial.id} className={`absolute top-0 left-0 w-full transition-all duration-500 ${index === currentIndex ? 'opacity-100 translate-x-0' : index < currentIndex ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'}`}>
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-blue-500">
                        {testimonial.src ? <img src={testimonial.src} alt={testimonial.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-blue-500" />
                          </div>}
                      </div>
                      <div className="text-xl font-bold mb-1">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500 mb-4">
                        {testimonial.role}
                      </div>
                      <div className="flex space-x-1 mb-6">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                      </div>
                      <p className="text-gray-600 text-center italic text-lg leading-relaxed">
                        « {testimonial.text} »
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          <button onClick={handlePrevious} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none">
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none">
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'}`} />)}
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;