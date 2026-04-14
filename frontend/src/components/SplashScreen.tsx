import { motion } from 'framer-motion';

const screenParticles = Array.from({ length: 22 }).map((_, idx) => {
  const x = (idx * 37) % 100;
  const y = (idx * 19) % 100;
  const size = 5 + ((idx * 11) % 12);
  const driftX = -14 + ((idx * 7) % 29);
  const driftY = -22 + ((idx * 9) % 44);
  const duration = 7 + ((idx * 5) % 8);
  const delay = (idx * 0.33) % 2.8;
  const opacity = 0.08 + ((idx * 3) % 10) / 100;

  return { id: idx + 1, x, y, size, driftX, driftY, duration, delay, opacity };
});

function SplashEye({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="relative inline-flex h-[2.7rem] w-[2rem] items-center justify-center sm:h-[3rem] sm:w-[2.2rem]"
      initial={{ scale: 0.8, y: 9, rotate: delay ? 4 : -4 }}
      animate={{ scale: [0.8, 1.04, 0.98, 1], y: [8, -3, 1, 0], rotate: [delay ? 4 : -4, 0, 0, 0] }}
      transition={{ duration: 0.66, ease: [0.24, 0.9, 0.32, 1], delay }}
    >
      <motion.span
        className="absolute inset-0 rounded-[999px] border border-gray-200/80 bg-gradient-to-b from-white via-[#fff9ff] to-[#f2ecff] shadow-[0_10px_20px_rgba(41,18,60,0.14)]"
        animate={{ scaleY: [1, 1, 0.12, 1, 1, 0.16, 1] }}
        transition={{ duration: 4.9, times: [0, 0.25, 0.28, 0.34, 0.7, 0.74, 0.79], repeat: Infinity, ease: 'easeInOut', delay: delay + 0.22 }}
      />

      <span className="pointer-events-none absolute left-[26%] top-[15%] h-[20%] w-[48%] rounded-full bg-white/90" />

      <motion.span
        className="relative z-10 h-[0.85rem] w-[0.85rem] rounded-full bg-gradient-to-b from-gray-900 to-gray-800 sm:h-[0.95rem] sm:w-[0.95rem]"
        animate={{
          x: [0, -5.8, 5.2, -4.2, 4.8, 0, -2.6, 2.4, 0],
          y: [0, -5.2, 3.9, 2.8, -4.8, 0, -1.8, 1.4, 0],
          scale: [1, 1.07, 0.95, 1.06, 0.98, 1, 1.02, 0.98, 1],
        }}
        transition={{ duration: 3.8, times: [0, 0.08, 0.16, 0.23, 0.31, 0.44, 0.63, 0.82, 1], repeat: Infinity, ease: 'easeInOut', delay: delay + 0.14 }}
      >
        <span className="absolute left-[22%] top-[19%] h-1.5 w-1.5 rounded-full bg-white/90" />
      </motion.span>

      <span className="pointer-events-none absolute inset-0 rounded-[999px] shadow-[inset_0_-8px_12px_rgba(197,158,221,0.2)]" />
    </motion.span>
  );
}

export default function SplashScreen() {
  return (
    <motion.div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fdfbff] px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[27rem] w-[27rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/80 via-pink-100/30 to-transparent blur-3xl" />
        <div className="absolute bottom-[-12%] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/40 via-orange-100/30 to-transparent blur-3xl" />

        {screenParticles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-pink-300/60"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: 'blur(0.3px)',
            }}
            animate={{
              x: [0, particle.driftX, 0],
              y: [0, particle.driftY, 0],
              opacity: [particle.opacity, particle.opacity + 0.12, particle.opacity],
              scale: [1, 1.18, 1],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        <motion.div
          className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-100/40"
          animate={{ rotate: [0, 12, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: -46, opacity: 0, scale: 0.86 }}
        animate={{ y: [0, 14, -5, 0], opacity: 1, scale: [0.86, 1.05, 0.99, 1] }}
        transition={{ duration: 1.05, ease: [0.18, 0.95, 0.25, 1], times: [0, 0.44, 0.76, 1] }}
      >
        <motion.div
          className="relative flex items-center gap-[0.17em] text-[3rem] font-black leading-none tracking-[-0.01em] text-gray-900 sm:text-[3.7rem]"
          animate={{ y: [0, -1.8, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="mr-[0.01em] bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent [font-family:'Avenir_Next','Nunito',system-ui,sans-serif]">L</span>
          <span className="inline-flex items-center gap-[0.22em]">
            <SplashEye delay={0.1} />
            <SplashEye delay={0.18} />
          </span>
          <span className="ml-[0.01em] bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent [font-family:'Avenir_Next','Nunito',system-ui,sans-serif]">ply</span>
        </motion.div>

        <motion.p
          className="mt-5 text-sm font-semibold tracking-[0.055em] text-gray-600"
          animate={{ y: [0, -1.5, 0], opacity: [0.72, 1, 0.72] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        >
          Preparing your Pository
          <motion.span
            className="inline-flex"
            animate={{ opacity: [0.24, 1, 0.24] }}
            transition={{ duration: 1.65, repeat: Infinity, ease: 'easeInOut' }}
          >
            ...
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
