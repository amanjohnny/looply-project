import { motion } from 'framer-motion';

const ambientDots = [
  { id: 1, size: 'h-2 w-2', x: '-32%', y: '-26%', delay: 0.1, duration: 3.2 },
  { id: 2, size: 'h-1.5 w-1.5', x: '34%', y: '-30%', delay: 0.6, duration: 3.8 },
  { id: 3, size: 'h-2.5 w-2.5', x: '40%', y: '24%', delay: 0.2, duration: 4.2 },
  { id: 4, size: 'h-1.5 w-1.5', x: '-40%', y: '28%', delay: 0.8, duration: 3.5 },
  { id: 5, size: 'h-2 w-2', x: '0%', y: '-38%', delay: 0.4, duration: 3.7 },
];

function Eye({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-gray-200/80 bg-white shadow-[0_6px_16px_rgba(37,22,53,0.12)] sm:h-12 sm:w-12"
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      <motion.span
        className="absolute inset-0 origin-center rounded-full bg-white"
        animate={{
          scaleY: [1, 1, 0.07, 1, 1, 1, 1, 0.1, 1],
        }}
        transition={{
          duration: 5.8,
          times: [0, 0.17, 0.19, 0.23, 0.55, 0.62, 0.78, 0.8, 0.84],
          repeat: Infinity,
          repeatDelay: 0.2,
          delay,
          ease: 'easeInOut',
        }}
      />

      <motion.span
        className="relative z-10 h-5 w-5 rounded-full bg-gray-900"
        animate={{
          x: [0, -3.4, 3.2, 0],
          y: [0, -0.4, 0.6, 0],
        }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          repeatType: 'loop',
          times: [0, 0.28, 0.62, 1],
          ease: 'easeInOut',
          delay: delay + 0.25,
        }}
      >
        <span className="absolute left-[20%] top-[18%] h-1.5 w-1.5 rounded-full bg-white/85" />
      </motion.span>

      <span className="pointer-events-none absolute inset-x-2 top-1 h-3 rounded-full bg-gradient-to-b from-white/80 to-transparent" />
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
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary-100/70 to-pink-100/30 blur-3xl" />
        <div className="absolute bottom-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/40 to-orange-100/40 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          type: 'spring',
          stiffness: 180,
          damping: 18,
        }}
      >
        <div className="relative rounded-3xl border border-white/70 bg-white/60 px-5 py-4 shadow-[0_20px_55px_rgba(81,47,105,0.12)] backdrop-blur-md sm:px-7">
          {ambientDots.map((dot) => (
            <motion.span
              key={dot.id}
              className={`absolute ${dot.size} rounded-full bg-primary-200/80`}
              style={{ left: `calc(50% + ${dot.x})`, top: `calc(50% + ${dot.y})` }}
              animate={{ y: [0, -4, 0], opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
            />
          ))}

          <div className="relative flex items-center gap-1 text-[2.4rem] font-bold tracking-tight text-gray-900 sm:text-[2.8rem]">
            <span>L</span>
            <Eye />
            <Eye delay={0.1} />
            <span>ply</span>
          </div>
        </div>

        <motion.p
          className="mt-5 text-sm font-medium tracking-[0.02em] text-gray-500"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }}
        >
          Preparing your space
          <motion.span
            className="inline-block"
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ...
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
