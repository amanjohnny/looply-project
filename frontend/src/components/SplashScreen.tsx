import { motion } from 'framer-motion';

type AmbientDot = {
  id: number;
  x: string;
  y: string;
  size: string;
  delay: number;
  duration: number;
  opacity: number;
};

const ambientDots: AmbientDot[] = [
  { id: 1, x: '-38%', y: '-30%', size: 'h-2.5 w-2.5', delay: 0.1, duration: 4.8, opacity: 0.45 },
  { id: 2, x: '-20%', y: '-36%', size: 'h-1.5 w-1.5', delay: 0.9, duration: 4.1, opacity: 0.32 },
  { id: 3, x: '16%', y: '-34%', size: 'h-2 w-2', delay: 0.4, duration: 4.4, opacity: 0.4 },
  { id: 4, x: '36%', y: '-18%', size: 'h-1.5 w-1.5', delay: 1.1, duration: 3.9, opacity: 0.3 },
  { id: 5, x: '40%', y: '20%', size: 'h-2 w-2', delay: 0.3, duration: 4.9, opacity: 0.38 },
  { id: 6, x: '18%', y: '34%', size: 'h-1.5 w-1.5', delay: 1.4, duration: 4.2, opacity: 0.28 },
  { id: 7, x: '-18%', y: '35%', size: 'h-2.5 w-2.5', delay: 0.5, duration: 4.6, opacity: 0.42 },
  { id: 8, x: '-39%', y: '16%', size: 'h-1.5 w-1.5', delay: 1.2, duration: 3.7, opacity: 0.3 },
];

function Eye({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="relative inline-flex h-[2.4rem] w-[2.95rem] items-center justify-center"
      initial={{ scale: 0.82, rotateX: -20, y: 3 }}
      animate={{ scale: 1, rotateX: 0, y: 0 }}
      transition={{ delay, duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        className="absolute inset-0 rounded-[999px] border border-gray-200/85 bg-gradient-to-b from-white via-[#fff8fe] to-[#f6efff] shadow-[0_9px_18px_rgba(35,15,58,0.15)]"
        animate={{ scaleY: [1, 1, 0.08, 1, 1, 1, 0.12, 1] }}
        transition={{
          duration: 6,
          times: [0, 0.17, 0.2, 0.24, 0.58, 0.73, 0.76, 0.81],
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
      />

      <span className="pointer-events-none absolute inset-x-[20%] top-[18%] h-[26%] rounded-full bg-white/85" />

      <motion.span
        className="relative z-10 h-[1.15rem] w-[1.15rem] rounded-full bg-gradient-to-b from-gray-900 to-gray-800"
        animate={{ x: [0, -3.8, 3.2, 0], y: [0, -0.5, 0.4, 0] }}
        transition={{
          duration: 5.3,
          times: [0, 0.27, 0.62, 1],
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay + 0.55,
        }}
      >
        <span className="absolute left-[22%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/90" />
      </motion.span>

      <span className="pointer-events-none absolute inset-0 rounded-[999px] shadow-[inset_0_-7px_10px_rgba(189,154,212,0.18)]" />
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
      transition={{ duration: 0.32, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/80 via-pink-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-[-15%] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/45 via-orange-100/30 to-transparent blur-3xl" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[23rem] w-[23rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-100/40"
          animate={{ rotate: [0, 10, 0], scale: [1, 1.02, 1] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: -34, opacity: 0, scale: 0.9 }}
        animate={{ y: [0, 10, -4, 0], opacity: 1, scale: [0.9, 1.02, 0.995, 1] }}
        transition={{
          duration: 0.95,
          ease: [0.2, 0.9, 0.22, 1],
          times: [0, 0.45, 0.75, 1],
        }}
      >
        <div className="relative rounded-[2rem] border border-white/75 bg-white/72 px-7 py-6 shadow-[0_24px_70px_rgba(73,38,96,0.16)] backdrop-blur-xl sm:px-9">
          {ambientDots.map((dot) => (
            <motion.span
              key={dot.id}
              className={`absolute ${dot.size} rounded-full bg-primary-300/80`}
              style={{ left: `calc(50% + ${dot.x})`, top: `calc(50% + ${dot.y})` }}
              animate={{ y: [0, -6, 0], opacity: [dot.opacity * 0.6, dot.opacity, dot.opacity * 0.6], scale: [1, 1.08, 1] }}
              transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
            />
          ))}

          <motion.span
            className="absolute -left-5 bottom-2 h-8 w-3 rounded-full bg-primary-200/70"
            animate={{ y: [0, -5, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.span
            className="absolute -right-6 bottom-4 h-9 w-3 rounded-full bg-pink-200/70"
            animate={{ y: [0, -6, 0], rotate: [0, 7, 0] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
          />

          <div className="relative flex items-center gap-[0.14em] text-[2.85rem] font-black tracking-[-0.045em] text-gray-900 sm:text-[3.3rem]">
            <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">L</span>
            <Eye delay={0.2} />
            <Eye delay={0.27} />
            <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent">ply</span>
          </div>

          <motion.span
            className="absolute inset-x-10 -bottom-2 h-6 rounded-full bg-primary-100/40 blur-xl"
            animate={{ opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className="mt-6 flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-4 py-2 text-[0.78rem] font-semibold tracking-[0.07em] text-gray-600 shadow-[0_8px_22px_rgba(80,46,104,0.1)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
        >
          <span>Loading your community</span>
          <motion.span
            className="inline-flex"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            ...
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
