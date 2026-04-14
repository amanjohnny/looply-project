import { motion } from 'framer-motion';

const ambientOrbs = [
  { id: 1, x: '-34%', y: '-20%', size: 'h-2.5 w-2.5', delay: 0.1, duration: 4.6 },
  { id: 2, x: '-18%', y: '-34%', size: 'h-1.5 w-1.5', delay: 0.9, duration: 3.9 },
  { id: 3, x: '17%', y: '-30%', size: 'h-2 w-2', delay: 0.3, duration: 4.2 },
  { id: 4, x: '35%', y: '-14%', size: 'h-1.5 w-1.5', delay: 1.1, duration: 3.5 },
  { id: 5, x: '37%', y: '18%', size: 'h-2 w-2', delay: 0.4, duration: 4.8 },
  { id: 6, x: '12%', y: '33%', size: 'h-1.5 w-1.5', delay: 1.4, duration: 4.1 },
  { id: 7, x: '-16%', y: '35%', size: 'h-2.5 w-2.5', delay: 0.6, duration: 4.7 },
  { id: 8, x: '-36%', y: '18%', size: 'h-1.5 w-1.5', delay: 1.2, duration: 3.8 },
];

function Eye({ delay = 0 }: { delay?: number }) {
  return (
    <motion.span
      className="relative inline-flex h-[2.3rem] w-[2.9rem] items-center justify-center sm:h-[2.55rem] sm:w-[3.2rem]"
      initial={{ scale: 0.8, y: 8, rotateX: -25 }}
      animate={{ scale: [0.8, 1.06, 0.98, 1], y: [8, -5, 2, 0], rotateX: [-25, 0, 0, 0] }}
      transition={{ duration: 0.72, ease: [0.24, 0.9, 0.32, 1], delay }}
    >
      <motion.span
        className="absolute inset-0 rounded-[999px] border border-gray-200/80 bg-gradient-to-b from-white via-[#fff9ff] to-[#f3ecff] shadow-[0_10px_20px_rgba(41,18,60,0.14)]"
        animate={{ scaleY: [1, 1, 0.1, 1, 1, 1, 0.14, 1] }}
        transition={{ duration: 6, times: [0, 0.16, 0.19, 0.24, 0.53, 0.72, 0.75, 0.8], repeat: Infinity, ease: 'easeInOut', delay: delay + 0.15 }}
      />

      <span className="pointer-events-none absolute inset-x-[20%] top-[18%] h-[25%] rounded-full bg-white/90" />

      <motion.span
        className="relative z-10 h-[1.12rem] w-[1.12rem] rounded-full bg-gradient-to-b from-gray-900 to-gray-800"
        animate={{ x: [0, -3.8, 3.2, 0], y: [0, -0.4, 0.4, 0] }}
        transition={{ duration: 5.2, times: [0, 0.3, 0.64, 1], repeat: Infinity, ease: 'easeInOut', delay: delay + 0.55 }}
      >
        <span className="absolute left-[22%] top-[20%] h-1.5 w-1.5 rounded-full bg-white/90" />
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
        <motion.div
          className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-100/45"
          animate={{ rotate: [0, 12, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-100/35"
          animate={{ rotate: [0, -10, 0], scale: [1, 0.98, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ y: -46, opacity: 0, scale: 0.86 }}
        animate={{ y: [0, 14, -5, 0], opacity: 1, scale: [0.86, 1.05, 0.99, 1] }}
        transition={{ duration: 1.05, ease: [0.18, 0.95, 0.25, 1], times: [0, 0.44, 0.76, 1] }}
      >
        {ambientOrbs.map((dot) => (
          <motion.span
            key={dot.id}
            className={`absolute ${dot.size} rounded-full bg-primary-300/70`}
            style={{ left: `calc(50% + ${dot.x})`, top: `calc(50% + ${dot.y})` }}
            animate={{ y: [0, -7, 0], opacity: [0.22, 0.55, 0.22], scale: [1, 1.1, 1] }}
            transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut', delay: dot.delay }}
          />
        ))}

        <motion.div
          className="relative flex items-center gap-[0.12em] text-[3rem] font-black leading-none tracking-[-0.05em] text-gray-900 sm:text-[3.7rem]"
          animate={{ y: [0, -1.8, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent [font-family:'Avenir_Next','Nunito',system-ui,sans-serif]">L</span>
          <Eye delay={0.12} />
          <Eye delay={0.2} />
          <span className="bg-gradient-to-b from-gray-900 to-gray-700 bg-clip-text text-transparent [font-family:'Avenir_Next','Nunito',system-ui,sans-serif]">ply</span>
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
