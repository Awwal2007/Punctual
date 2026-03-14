import { useState, useEffect, useRef } from 'react';

export const useReveal = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once visible, we can stop observing if we only want it to animate once
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      }
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      ...options
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return [elementRef, isVisible];
};
