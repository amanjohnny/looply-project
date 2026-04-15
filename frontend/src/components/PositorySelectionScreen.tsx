import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, GraduationCap, Sparkles } from 'lucide-react';
import { bounceSpring, subtleShake, tabBounce } from '../lib/motion';

type PositoryOption = {
  id: string;
  name: string;
  description: string;
  note?: string;
  kind: 'school' | 'company' | 'community';
  enabled: boolean;
};

const options: PositoryOption[] = [
  { id: 'akbnispository', name: 'AKBNISPOSITORY', description: 'Official NIS AKB space for classes, groups, and challenge rooms.', note: 'Live now', kind: 'school', enabled: true },
  { id: 'pvlnis', name: 'PVLNIS', description: 'Campus creator leagues and reward missions.', note: 'Coming later', kind: 'school', enabled: false },
  { id: 'tumar-build', name: 'Tumar Build', description: 'Project squads for builders and product teams.', note: 'Coming later', kind: 'company', enabled: false },
  { id: 'orbit-social-lab', name: 'Orbit Social Lab', description: 'Community growth experiments and collab challenges.', note: 'Coming later', kind: 'community', enabled: false },
  { id: 'northbridge-collective', name: 'Northbridge Collective', description: 'Team quests and social leaderboard rooms.', note: 'Coming later', kind: 'company', enabled: false },
];

const iconByKind = {
  school: GraduationCap,
  company: Building2,
  community: Sparkles,
} as const;

export default function PositorySelectionScreen({ onContinueAkbnis }: { onContinueAkbnis: () => void }) {
  const [shakeId, setShakeId] = useState<string | null>(null);

  const handleOptionClick = (option: PositoryOption) => {
    if (option.enabled) {
      onContinueAkbnis();
      return;
    }

    setShakeId(option.id);
    window.setTimeout(() => setShakeId((prev) => (prev === option.id ? null : prev)), 320);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfbff] px-4 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/75 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/35 via-orange-100/30 to-transparent blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Welcome to Looply</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-[2.2rem]">Choose your Pository</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">Only AKBNISPOSITORY is available right now. Other communities are visible previews.</p>
        </div>

        <div className="mt-8 space-y-3">
          {options.map((option) => {
            const Icon = iconByKind[option.kind];
            const shaking = shakeId === option.id;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option)}
                variants={subtleShake}
                initial="idle"
                animate={shaking ? 'shake' : 'idle'}
                whileTap={option.enabled ? tabBounce.whileTap : undefined}
                whileHover={option.enabled ? { y: -3, scale: 1.01 } : undefined}
                transition={bounceSpring}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${option.enabled ? 'border-primary-300 bg-white shadow-[0_14px_35px_rgba(98,44,129,0.14)]' : 'border-white/70 bg-white/75 opacity-75'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${option.enabled ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold tracking-[0.03em] text-gray-900">{option.name}</p>
                      {option.note && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${option.enabled ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>{option.note}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                  </div>
                  {option.enabled && <ArrowRight size={16} className="text-primary-500" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
