'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Magnet = ({
  children,
  padding = 5,
  disabled = false,
  magnetStrength = 20,
  textStrength = 10,
  wrapperClassName = '',
  innerClassName = '',
  ...props
}) => {
  const magnetRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (disabled || typeof window === 'undefined' || window.innerWidth <= 540) {
      return;
    }

    const magnetButton = magnetRef.current;
    if (!magnetButton) return;

    let isHovering = false;

    const handleMouseMove = (event) => {
      const bounding = magnetButton.getBoundingClientRect();
      const centerX = bounding.left + bounding.width / 2;
      const centerY = bounding.top + bounding.height / 2;

      const distX = Math.abs(centerX - event.clientX);
      const distY = Math.abs(centerY - event.clientY);

      // Check if mouse is within the padded area
      if (distX < bounding.width / 2 + padding && distY < bounding.height / 2 + padding) {
        isHovering = true;
        
        gsap.to(magnetButton, {
          duration: 1.5,
          x: (((event.clientX - bounding.left) / bounding.width) - 0.5) * magnetStrength,
          y: (((event.clientY - bounding.top) / bounding.height) - 0.5) * magnetStrength,
          rotate: "0.001deg",
          ease: "power4.out"
        });

        if (textRef.current) {
          gsap.to(textRef.current, {
            duration: 1.5,
            x: (((event.clientX - bounding.left) / bounding.width) - 0.5) * textStrength,
            y: (((event.clientY - bounding.top) / bounding.height) - 0.5) * textStrength,
            rotate: "0.001deg",
            ease: "power4.out"
          });
        }
      } else {
        if (isHovering) {
          isHovering = false;
          // Trigger leave animation
          gsap.to(magnetButton, {
            duration: 1.5,
            x: 0,
            y: 0,
            ease: "elastic.out(1, 0.3)"
          });
          
          if (textRef.current) {
            gsap.to(textRef.current, {
              duration: 1.5,
              x: 0,
              y: 0,
              ease: "elastic.out(1, 0.3)"
            });
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [disabled, padding, magnetStrength, textStrength]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ display: 'inline-block' }}
      {...props}
    >
      <div
        ref={textRef}
        className={innerClassName}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
