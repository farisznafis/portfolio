"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type RevealStyle = React.CSSProperties & {
  "--reveal-x": string;
  "--reveal-y": string;
  "--reveal-size": string;
  "--tilt-x": string;
  "--tilt-y": string;
};

export function HelmetRevealHero() {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    gsap.set(frame, {
      "--reveal-x": "50%",
      "--reveal-y": "56%",
      "--reveal-size": "140px",
      "--tilt-x": "0deg",
      "--tilt-y": "0deg",
    });
  }, []);

  const moveReveal = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const tiltY = (x - 50) * 0.08;
    const tiltX = (50 - y) * 0.06;

    gsap.to(frame, {
      "--reveal-x": `${x}%`,
      "--reveal-y": `${y}%`,
      "--reveal-size": "230px",
      "--tilt-x": `${tiltX}deg`,
      "--tilt-y": `${tiltY}deg`,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const softenReveal = () => {
    const frame = frameRef.current;
    if (!frame) return;

    gsap.to(frame, {
      "--reveal-x": "50%",
      "--reveal-y": "56%",
      "--reveal-size": "140px",
      "--tilt-x": "0deg",
      "--tilt-y": "0deg",
      duration: 0.55,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={frameRef}
      className="helmet-frame group"
      onPointerEnter={moveReveal}
      onPointerLeave={softenReveal}
      onPointerMove={moveReveal}
      style={
        {
          "--reveal-x": "50%",
          "--reveal-y": "56%",
          "--reveal-size": "140px",
          "--tilt-x": "0deg",
          "--tilt-y": "0deg",
        } as RevealStyle
      }
    >
      <Image
        alt="Portrait placeholder for the interactive portfolio hero"
        className="helmet-portrait"
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 100vw"
        src="/images/hero-portrait.png"
      />
      <div className="helmet-vignette" />
      <div className="helmet-reveal-layer" aria-hidden="true">
        <div className="helmet-shell">
          <div className="helmet-crown" />
          <div className="helmet-visor helmet-visor-top" />
          <div className="helmet-visor helmet-visor-main" />
          <div className="helmet-mouth">
            <span />
            <span />
          </div>
          <div className="helmet-decal helmet-decal-left">NEXT</div>
          <div className="helmet-decal helmet-decal-right">UI</div>
        </div>
      </div>
      <div className="helmet-cursor-ring" aria-hidden="true" />
    </div>
  );
}
