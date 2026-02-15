"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Zap, Briefcase, MessageSquare, Lock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Only",
    description: "Every employer goes through a strict ID verification process to ensure zero fraud.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Zap,
    title: "Fast Tracking",
    description: "Know exactly where you stand with real-time application tracking and instant updates.",
    color: "bg-orange-500/10 text-orange-600",
  },
  {
    icon: Briefcase,
    title: "Tailored Matches",
    description: "Our smart filters help you find the roles that perfectly align with your skills.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: MessageSquare,
    title: "Direct Chat",
    description: "Communicate directly with verified recruiters and hiring managers in real-time.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Gated payment processing ensures your financial data is always protected.",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Star,
    title: "AI Insights",
    description: "Get personalized career growth tips and job recommendations powered by AI.",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export function WhySlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % FEATURES.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + FEATURES.length) % FEATURES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="relative w-full overflow-hidden py-10 min-h-[500px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-center">
          
          {/* Navigation Controls */}
          <div className="absolute left-0 lg:left-8 z-20 flex flex-col gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-slate-200 bg-white/50 backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-90"
              onClick={prev}
            >
              <ChevronLeft className="h-6 w-6 text-slate-900" />
            </Button>
          </div>
          
          <div className="absolute right-0 lg:right-8 z-20 flex flex-col gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-slate-200 bg-white/50 backdrop-blur-md shadow-lg transition-transform hover:scale-110 active:scale-90"
              onClick={next}
            >
              <ChevronRight className="h-6 w-6 text-slate-900" />
            </Button>
          </div>

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
              className="w-full max-w-3xl"
            >
              <Card className="ios-card bg-white border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] overfow-hidden">
                <CardContent className="flex flex-col items-center text-center p-8 lg:p-16">
                  <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-2xl ${FEATURES[index].color} shadow-sm ring-1 ring-black/5`}>
                    {(() => {
                      const Icon = FEATURES[index].icon;
                      return <Icon className="h-10 w-10" />;
                    })()}
                  </div>
                  <h3 className="mb-4 text-3xl lg:text-5xl font-extrabold tracking-tighter text-slate-900">
                    {FEATURES[index].title}
                  </h3>
                  <p className="text-lg lg:text-2xl leading-relaxed text-slate-600 max-w-xl">
                    {FEATURES[index].description}
                  </p>
                  
                  {/* Indicators inside card */}
                  <div className="mt-10 lg:mt-16 flex gap-3">
                    {FEATURES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > index ? 1 : -1);
                          setIndex(i);
                        }}
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          i === index ? "w-12 bg-primary" : "w-2.5 bg-slate-200 hover:bg-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Dynamic Background Glow */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
             <motion.div 
               key={`glow-${index}`}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.5, scale: 1 }}
               transition={{ duration: 1 }}
               className={`h-[400px] w-[400px] lg:h-[600px] lg:w-[600px] rounded-full blur-[100px] ${FEATURES[index].color.split(' ')[0]}`}
             />
          </div>
        </div>
      </div>
    </div>
  );
}
