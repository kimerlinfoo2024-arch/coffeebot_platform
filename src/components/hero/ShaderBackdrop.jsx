import { Suspense, lazy } from 'react';

/* Lazy-load the R3F shader canvas so the initial paint never waits on it.
   A CSS gradient (.hero-bg-css) always renders behind, so if the canvas
   is slow or unsupported the hero still looks intentional. */
const ShaderGradientCanvas = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradientCanvas })),
);
const ShaderGradient = lazy(() =>
  import('@shadergradient/react').then((m) => ({ default: m.ShaderGradient })),
);

export default function ShaderBackdrop() {
  // honour reduced motion — skip the animated canvas entirely
  if (typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  return (
    <Suspense fallback={null}>
      <ShaderGradientCanvas
        className="hero-bg"
        style={{ opacity: 0.55 }}
        pointerEvents="none"
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          color1="#E5E3D6"
          color2="#DCE6D3"
          color3="#F2E3C4"
          grain="on"
          cDistance={3.2}
          cPolarAngle={135}
          uSpeed={0.18}
          uStrength={1.4}
          uDensity={1.1}
          brightness={1.15}
          reflection={0.1}
          positionX={0}
          positionY={0}
          positionZ={0}
          rotationX={50}
          rotationY={0}
          rotationZ={-60}
          enableTransition={false}
        />
      </ShaderGradientCanvas>
    </Suspense>
  );
}
