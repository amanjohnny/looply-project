import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { Rarity } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, RefreshCw, Sparkles } from 'lucide-react';

interface CasesProps {
  onShowReward: () => void;
}

const caseTypes = [
  { id: 'basic', name: 'Basic Case', price: 100, color: 'from-gray-400 to-gray-500', icon: '📦' },
  { id: 'premium', name: 'Premium Case', price: 250, color: 'from-primary-400 to-pink-500', icon: '✨' },
  { id: 'deluxe', name: 'Deluxe Case', price: 500, color: 'from-yellow-400 to-orange-500', icon: '👑' },
];

const rarityConfig: Record<Rarity, { color: string; bg: string; icon: string; chance: string; glow: string }> = {
  common: { color: 'text-gray-600', bg: 'bg-gray-100 border-gray-200', icon: '⭐', chance: '50%', glow: 'shadow-gray-400/30' },
  rare: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: '💎', chance: '25%', glow: 'shadow-blue-400/30' },
  epic: { color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', icon: '🌟', chance: '15%', glow: 'shadow-purple-400/40' },
  legendary: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300', icon: '👑', chance: '10%', glow: 'shadow-yellow-400/50 animate-pulse' },
};

export default function Cases({ onShowReward }: CasesProps) {
  const { user, collectibles, openCase, addCollectible, setCaseOpening, setLastOpenResult, lastOpenResult } = useAppStore();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [openCount, setOpenCount] = useState(0);

  const handleOpenCase = (caseId: string) => {
    const caseType = caseTypes.find(c => c.id === caseId);
    if (!caseType || user.coins < caseType.price) return;

    setSelectedCase(caseId);
    setIsOpening(true);
    setCaseOpening(true);

    // Simulate case opening animation
    setTimeout(() => {
      const result = openCase(caseType.price);
      if (!result) {
        setIsOpening(false);
        setCaseOpening(false);
        return;
      }
      addCollectible(result);
      setLastOpenResult(result);
      setIsOpening(false);
      setCaseOpening(false);
      setShowResult(true);
      setOpenCount(prev => prev + 1);
      onShowReward();
    }, 2000);
  };

  const closeResult = () => {
    setShowResult(false);
    setSelectedCase(null);
  };

  return (
    <div className="max-w-md mx-auto pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Box className="text-primary-500" />
            Cases
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-yellowLight rounded-full">
            <span className="text-lg">🪙</span>
            <span className="font-semibold text-yellow-700">{user.coins}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold gradient-text">{openCount}</div>
            <div className="text-xs text-gray-500">Opened</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-blue-600">{collectibles.length}</div>
            <div className="text-xs text-gray-500">Collected</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-card text-center">
            <div className="text-2xl font-bold text-purple-600">{collectibles.filter((item) => item.rarity === 'legendary').length}</div>
            <div className="text-xs text-gray-500">Legendary</div>
          </div>
        </div>

        {/* Cases */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Cases</h2>
          
          {caseTypes.map((caseType) => {
            const canAfford = user.coins >= caseType.price;
            
            return (
              <motion.div
                key={caseType.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !isOpening && handleOpenCase(caseType.id)}
                className={`bg-white rounded-2xl p-5 shadow-card cursor-pointer transition-all ${
                  !canAfford ? 'opacity-60' : ''
                } ${selectedCase === caseType.id && isOpening ? 'ring-2 ring-primary-400' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Case icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${caseType.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {caseType.icon}
                  </div>
                  
                  {/* Case info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{caseType.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500">🪙</span>
                      <span className="font-medium text-gray-700">{caseType.price}</span>
                    </div>
                  </div>
                  
                  {/* Open button */}
                  <button 
                    disabled={!canAfford || isOpening}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                      canAfford && !isOpening
                        ? 'bg-gradient-to-r from-primary-500 to-pink-500 text-white shadow-glow-pink'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isOpening && selectedCase === caseType.id ? (
                      <RefreshCw className="animate-spin" size={20} />
                    ) : (
                      'Open'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rarity Guide */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="text-primary-500" size={18} />
            Rarity Guide
          </h3>
          
          <div className="space-y-3">
            {Object.entries(rarityConfig).map(([rarity, config]) => (
              <div 
                key={rarity}
                className={`p-3 rounded-xl ${config.bg} flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <span className={`font-medium capitalize ${config.color}`}>{rarity}</span>
                </div>
                <span className={`text-xs font-medium ${config.color}`}>{config.chance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Collection */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Collection</h3>

          {collectibles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-4 text-center">
              <p className="text-sm text-gray-500">No collectibles yet — open a case to start your collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {[...collectibles].slice(-8).reverse().map((item) => (
                <div
                  key={item.id}
                  className={`aspect-square rounded-xl flex items-center justify-center text-3xl ${
                    item.rarity === 'legendary' ? 'rarity-legendary' : item.rarity === 'epic' ? 'rarity-epic' : item.rarity === 'rare' ? 'rarity-rare' : 'bg-gray-100'
                  }`}
                >
                  {item.image}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Opening Animation Overlay */}
      <AnimatePresence>
        {isOpening && selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="bg-white rounded-3xl p-8 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="text-8xl mb-4"
              >
                📦
              </motion.div>
              <p className="text-lg font-semibold text-gray-900">Opening Case...</p>
              <p className="text-gray-500 text-sm mt-1">Preparing your reward</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Result Modal */}
      <AnimatePresence>
        {showResult && lastOpenResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeResult} />
            
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`relative z-10 bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-large ${rarityConfig[lastOpenResult.rarity].glow}`}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-3xl opacity-30 bg-gradient-to-br ${
                lastOpenResult.rarity === 'legendary' ? 'from-yellow-300 to-orange-400' :
                lastOpenResult.rarity === 'epic' ? 'from-purple-300 to-pink-400' :
                lastOpenResult.rarity === 'rare' ? 'from-blue-300 to-cyan-400' :
                'from-gray-300 to-gray-400'
              } blur-xl`} />
              
              <div className="relative z-10">
                {/* Rarity badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${rarityConfig[lastOpenResult.rarity].bg}`}>
                  <span>{rarityConfig[lastOpenResult.rarity].icon}</span>
                  <span className={rarityConfig[lastOpenResult.rarity].color}>{lastOpenResult.rarity.toUpperCase()}</span>
                </div>
                
                {/* Item */}
                <motion.div
                  initial={{ scale: 0, rotate: -360 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-8xl mb-4"
                >
                  {lastOpenResult.image}
                </motion.div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{lastOpenResult.name}</h2>
                <p className="text-gray-500 mb-6">{lastOpenResult.description}</p>
                
                <button
                  onClick={closeResult}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-pink-500 text-white rounded-xl font-semibold shadow-glow-pink hover:shadow-lg transition-all"
                >
                  Awesome! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
