import { ParticlesGravityBackground } from "./backgrounds/ParticlesGravityBackground";

export function AnimatedBackground() {
  return (
    // <div className="fixed inset-0 bg-linear-to-br from-blue-500 via-purple-500 to-purple-700 animate-pulse-bg -z-10" />
    <div className="fixed inset-0 bg-black -z-10">
      <ParticlesGravityBackground />
    </div>
  )
}
