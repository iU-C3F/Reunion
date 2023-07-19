import { useState, useEffect } from 'react';

export const useIntersection = (ref: React.MutableRefObject<HTMLDivElement>) => {
  const [intersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (ref.current !== null) {
      const observer = new IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting);
      });

      observer.observe(ref.current);

      return () => {
        try {
          observer.unobserve(ref.current);
        } catch (e) {
          // console.error(e);
          false;
        }
      };
    }
  });

  return intersecting;
};