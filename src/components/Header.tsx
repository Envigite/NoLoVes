"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselItem {
  title: string;
  description: string;
  imageUrl: string;
}

const carouselItems: CarouselItem[] = [
  {
    title: "Aire Invisible Premium",
    description:
      "El aire más puro y exclusivo, embotellado en las alturas de los Andes",
    imageUrl: "./images/aire.jpg",
  },
  {
    title: "Pensamientos Invisibles",
    description:
      "Colección única de ideas y pensamientos nunca antes pensados.",
    imageUrl: "./images/pensamiento.jpg",
  },
  {
    title: "Amor Invisible",
    description:
      "El regalo perfecto para esa persona especial que lo tiene todo.",
    imageUrl: "./images/amor.jpg",
  },
  {
    title: "Silencio Premium",
    description: "Momentos de paz absoluta, embotellados con cuidado.",
    imageUrl: "./images/silencio.jpg",
  },
];

const HeaderCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    // Limpiar el temporizador anterior si existe
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Crear un nuevo temporizador
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1,
      );
    }, 5000);
  };

  useEffect(() => {
    // Iniciar el temporizador cuando el componente se monta
    startTimer();

    // Limpiar el temporizador cuando el componente se desmonta
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startTimer(); // Reiniciar el temporizador cuando se hace clic en un punto
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1,
    );
    startTimer(); // Reiniciar el temporizador cuando se navega a la imagen anterior
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1,
    );
    startTimer(); // Reiniciar el temporizador cuando se navega a la siguiente imagen
  };

  return (
    <header className="relative w-full h-[200px] md:h-[500px] overflow-hidden bg-gray-900 group">
      <div
        className="absolute w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselItems.map((item, index) => (
          <div
            key={`item-${index}con`}
            className="absolute top-0 left-0 w-full h-full"
            style={{ left: `${index * 100}%` }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent">
              <div className="absolute bottom-16 left-8 text-white">
                <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                <p className="text-sm max-w-xl text-gray-200">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handlePrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        aria-label="Anterior imagen"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-8 h-8" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
};

export default HeaderCarousel;
