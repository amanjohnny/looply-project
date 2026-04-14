import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, GraduationCap, Sparkles } from 'lucide-react';

type PositoryOption = {
  id: string;
  name: string;
  description: string;
  note?: string;
  kind: 'school' | 'company' | 'community';
};

const options: PositoryOption[] = [
  { id: 'akbnispository', name: 'AKBNISPOSITORY', description: 'Official student challenge spaces and class boards.', note: 'School sign only works', kind: 'school' },
  { id: 'pvlnis', name: 'PVLNIS', description: 'Campus creator leagues and reward missions.', note: 'School access', kind: 'school' },
  { id: 'tumar-build', name: 'Tumar Build', description: 'Project squads for builders and product teams.', kind: 'company' },
  { id: 'orbit-social-lab', name: 'Orbit Social Lab', description: 'Community growth experiments and collab challenges.', kind: 'community' },
  { id: 'northbridge-collective', name: 'Northbridge Collective', description: 'Team quests and social leaderboard rooms.', kind: 'company' },
];

const iconByKind = {
  school: GraduationCap,
  company: Building2,
  community: Sparkles,
} as const;

export default function PositorySelectionScreen({ onContinue }: { onContinue: (positoryId: string) => void }) {
  const [selected, setSelected] = useState<string>(options[0].id);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfbff] px-4 py-10 sm:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary-100/70 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary-100/35 via-orange-100/30 to-transparent blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">Welcome to Looply</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-[2.2rem]">Choose your Pository</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">Select the community space you&apos;re joining first. You can explore more spaces later.</p>
        </div>

        <div className="mt-8 space-y-3">
          {options.map((option, idx) => {
            const Icon = iconByKind[option.kind];
            const active = selected === option.id;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setSelected(option.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * idx, duration: 0.35 }}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${active ? 'border-primary-300 bg-white shadow-[0_14px_35px_rgba(98,44,129,0.14)]' : 'border-white/70 bg-white/80 hover:border-primary-200 hover:bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold tracking-[0.03em] text-gray-900">{option.name}</p>
                      {option.note && (
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary-600">{option.note}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          type="button"
          onClick={() => onContinue(selected)}
          whileTap={{ scale: 0.985 }}
          whileHover={{ y: -1 }}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-500 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(236,72,153,0.34)]"
        >
          Continue to sign in
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
