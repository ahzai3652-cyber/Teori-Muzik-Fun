/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Play, 
  Award, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  Star,
  CheckCircle2,
  XCircle,
  Home,
  Volume2,
  Download,
  Coins,
  Heart,
  Zap,
  Mic,
  Circle,
  Square,
  Lock,
  Wind
} from 'lucide-react';
import { STAFF_NOTES, MUSICAL_SYMBOLS, TERMINOLOGIES, MusicalSymbol } from './types';
import { audioEngine } from './audio';

type Screen = 'splash' | 'menu' | 'module1' | 'module2' | 'module3' | 'module4' | 'module5' | 'module6' | 'module7' | 'shop' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(100);
  const [ownedInstruments, setOwnedInstruments] = useState<string[]>([]);
  const [showShopAlert, setShowShopAlert] = useState(false);
  
  // Game logic state
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const handleStart = () => {
    if (!userName.trim()) {
      alert('Sila masukkan nama anda!');
      return;
    }
    audioEngine.init();
    setScreen('menu');
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setCurrentStep(0);
    setScreen('menu');
  };

  return (
    <div className="min-h-screen bg-[#1a0b3b] text-white font-sans selection:bg-[#FFD700] selection:text-[#1a0b3b]">
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen 
            userName={userName} 
            setUserName={setUserName} 
            onStart={handleStart} 
          />
        )}
        
        {screen === 'menu' && (
          <MenuScreen 
            onSelect={(m) => {
              if (m === 'module6' && ownedInstruments.length === 0) {
                setShowShopAlert(true);
                setTimeout(() => setShowShopAlert(false), 3000);
                return;
              }
              setScreen(m);
            }} 
            ownedInstruments={ownedInstruments}
          />
        )}

        {screen === 'module1' && (
          <MisiNotasi 
            onComplete={(s, t) => {
              setScore(score + s);
              setTotalQuestions(totalQuestions + t);
              setScreen('menu');
            }} 
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module2' && (
          <CabaranIrama 
            onComplete={(s, t) => {
              setScore(score + s);
              setTotalQuestions(totalQuestions + t);
              setScreen('menu');
            }} 
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module3' && (
          <MasteriSimbol 
            onComplete={(s, t) => {
              setScore(score + s);
              setTotalQuestions(totalQuestions + t);
              setScreen('result');
            }} 
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module4' && (
          <CiptaIrama 
            onComplete={() => {
              setScreen('menu');
            }} 
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module5' && (
          <IramaKilat 
            coins={coins}
            onUpdateCoins={(c) => setCoins(prev => prev + c)}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module6' && (
          <StudioRakaman 
            ownedInstruments={ownedInstruments}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'module7' && (
          <Rekoder 
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'shop' && (
          <KedaiMuzik 
            coins={coins}
            ownedInstruments={ownedInstruments}
            onBuy={(inst, price) => {
              setCoins(prev => prev - price);
              setOwnedInstruments(prev => [...prev, inst]);
            }}
            onBack={() => setScreen('menu')}
          />
        )}

        {screen === 'result' && (
          <ResultScreen 
            name={userName}
            score={score} 
            total={totalQuestions} 
            onReset={resetGame} 
          />
        )}
      </AnimatePresence>
      
      {/* Shop Alert Notification */}
      <AnimatePresence>
        {showShopAlert && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3 border-2 border-white/20"
          >
            <XCircle className="w-6 h-6" />
            <span>Sila beli instrumen di Kedai Muzik terlebih dahulu!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coin Display */}
      {screen !== 'splash' && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Coins className="w-5 h-5 text-yellow-500 animate-pulse" />
          <span className="text-xl font-black text-yellow-500">{coins}</span>
        </div>
      )}

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#FFD700] rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#9d4edd] rounded-full blur-[100px]" />
      </div>
    </div>
  );
}

// --- SCREENS ---

function SplashScreen({ userName, setUserName, onStart }: { userName: string, setUserName: (v: string) => void, onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      <motion.div
        initial={{ y: -50, scale: 0.8 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="mb-8"
      >
        <div className="relative inline-block">
          <Music className="w-24 h-24 text-[#FFD700]" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-[#FFD700] rounded-full blur-2xl opacity-20"
          />
        </div>
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-white bg-clip-text text-transparent mb-4">
        Teori Muzik Fun Jom Takluk Dunia Muzik!
      </h1>
      <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-2xl">
        Sahut cabaran menarik dalam Kuiz Gamifikasi Interaktif Tahun 5 - Lengkapkan misi dan dapatkan sijil pencapaian anda sekarang!
      </p>

      <div className="w-full max-w-md space-y-4">
        <input 
          type="text"
          placeholder="Masukkan Nama Anda..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#FFD700] backdrop-blur-md transition-all text-center text-lg"
        />
        <button 
          onClick={onStart}
          className="w-full group relative flex items-center justify-center gap-3 px-8 py-5 bg-[#FFD700] text-[#1a0b3b] font-bold text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)]"
        >
          <span>MULA MISI</span>
          <Play className="w-6 h-6 fill-current" />
        </button>
      </div>

      <div className="mt-16 flex gap-6 grayscale opacity-60">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          <span className="text-sm">Berdasarkan DSKP</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          <span className="text-sm">Tahun 5 (Semakan 2017)</span>
        </div>
      </div>
    </motion.div>
  );
}

function MenuScreen({ onSelect, ownedInstruments }: { onSelect: (m: Screen) => void, ownedInstruments: string[] }) {
  const modules = [
    { id: 'module1' as Screen, title: 'Misi Notasi', desc: 'Kenali notasi E, F, G, A, B, C\', D\'' , icon: <Music className="w-8 h-8" /> },
    { id: 'module2' as Screen, title: 'Cabaran Notasi', desc: 'Pilih nilai yang betul berdasarkan not muzik' , icon: <Play className="w-8 h-8" /> },
    { id: 'module3' as Screen, title: 'Masteri Simbol', desc: 'Tanda rehat & terminologi muzik' , icon: <Trophy className="w-8 h-8" /> },
    { id: 'module4' as Screen, title: 'Irama Inovasi', desc: 'Cipta corak irama bermeter 4/4' , icon: <Volume2 className="w-8 h-8" /> },
    { id: 'module5' as Screen, title: 'Irama Kilat', desc: 'Uji kepantasan jari anda' , icon: <Zap className="w-8 h-8" /> },
    { id: 'module6' as Screen, title: 'Studio Rakaman', desc: 'Rakam & mainkan irama anda sendiri' , icon: <Mic className="w-8 h-8" /> },
    { id: 'module7' as Screen, title: 'Rekoder', desc: 'Belajar penjarian not E, F, G, A, B, C\', D\'' , icon: <Wind className="w-8 h-8" /> },
    { id: 'shop' as Screen, title: 'Kedai Muzik', desc: 'Beli instrumen untuk studio anda' , icon: <Coins className="w-8 h-8" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <h2 className="text-4xl font-bold text-[#FFD700] mb-12">PILIH MODUL ANDA</h2>
      
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        {modules.map((m, i) => {
          const isLocked = m.id === 'module6' && ownedInstruments.length === 0;
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(m.id)}
              className={`group relative flex flex-col items-start p-8 rounded-3xl bg-white/5 border border-white/10 ${isLocked ? 'grayscale' : 'hover:border-[#FFD700] hover:bg-white/10'} backdrop-blur-xl transition-all text-left`}
            >
              <div className={`mb-6 p-4 rounded-2xl ${isLocked ? 'bg-gray-600' : 'bg-[#FFD700]'} text-[#1a0b3b] group-hover:scale-110 transition-transform`}>
                {isLocked ? <Lock className="w-8 h-8" /> : m.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FFD700] transition-colors">{m.title}</h3>
              <p className="text-purple-200/60 leading-relaxed">{m.desc}</p>
              
              <div className="mt-8 flex items-center text-sm font-bold text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>{isLocked ? 'DIKUNCI' : 'MULA SEKARANG'}</span>
                {isLocked ? <Lock className="w-4 h-4 ml-1" /> : <ChevronRight className="w-4 h-4 ml-1" />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// --- MODULE 1: MISI NOTASI ---

function MisiNotasi({ onComplete, onBack }: { onComplete: (s: number, t: number) => void, onBack: () => void }) {
  const questions = useMemo(() => [...STAFF_NOTES].sort(() => Math.random() - 0.5), []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);

  const currentNote = questions[currentIdx];

  const options = useMemo(() => {
    return [...STAFF_NOTES].sort(() => Math.random() - 0.5);
  }, [currentIdx]);

  const handleChoice = (noteName: string) => {
    if (noteName === currentNote.name) {
      setGameScore(s => s + 1);
      audioEngine.playNote(currentNote.audioFreq || 440);
      setShowFeedback(true);
    } else {
      audioEngine.playError();
      setShowFeedback(false);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        onComplete(gameScore + (noteName === currentNote.name ? 1 : 0), questions.length);
      }
    }, 1000);
  };

  return (
    <motion.div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-12">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-full font-bold">
          Tahap: {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 mb-12 shadow-2xl relative">
        <h3 className="text-center text-[#1a0b3b] font-bold text-2xl mb-8">Apakah nama not ini?</h3>
        
        {/* SVG Staff */}
        <svg viewBox="0 0 400 150" className="w-full h-auto">
          {/* Staff Lines */}
          {[1, 2, 3, 4, 5].map(i => (
            <line key={i} x1="20" y1={30 + i * 20} x2="380" y2={30 + i * 20} stroke="#1a0b3b" strokeWidth="2" />
          ))}
          
          {/* Clef - Simplified */}
          <text x="30" y="110" fontSize="80" fill="#1a0b3b" fontFamily="serif">𝄞</text>

          {/* Ledger lines if needed */}
          {currentNote.name === 'E' && (
            <line x1="180" y1="130" x2="220" y2="130" stroke="#1a0b3b" strokeWidth="2" />
          )}

          {/* Current Note */}
          <motion.ellipse 
            key={currentNote.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            cx="200" 
            cy={130 - (currentNote.value as number) * 10} 
            rx="12" 
            ry="9" 
            fill="#1a0b3b"
            transform="rotate(-20 200 130)"
          />
        </svg>

        <AnimatePresence>
          {showFeedback !== null && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-3xl z-20 backdrop-blur-sm"
            >
              {showFeedback ? (
                <div className="text-green-500 flex flex-col items-center">
                  <CheckCircle2 className="w-24 h-24 mb-2" />
                  <span className="text-2xl font-bold">BETUL!</span>
                </div>
              ) : (
                <div className="text-red-500 flex flex-col items-center">
                  <XCircle className="w-24 h-24 mb-2" />
                  <span className="text-2xl font-bold">SALAH!</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-7 gap-4 w-full max-w-4xl">
        {options.map(note => (
          <button
            key={note.id}
            onClick={() => handleChoice(note.name)}
            disabled={showFeedback !== null}
            className="p-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-2xl font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {note.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- MODULE 2: CABARAN IRAMA ---

function CabaranIrama({ onComplete, onBack }: { onComplete: (s: number, t: number) => void, onBack: () => void }) {
  const questions = useMemo(() => {
    return [...MUSICAL_SYMBOLS]
      .filter(s => s.type === 'note')
      .sort(() => Math.random() - 0.5);
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);

  const currentQ = questions[currentIdx];
  const options = useMemo(() => [4, 2, 1, 0.5].sort(() => Math.random() - 0.5), [currentIdx]);

  const handleChoice = (val: number) => {
    if (val === currentQ.value) {
      setGameScore(s => s + 1);
      audioEngine.playSuccess();
      setShowFeedback(true);
    } else {
      audioEngine.playError();
      setShowFeedback(false);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        onComplete(gameScore + (val === currentQ.value ? 1 : 0), questions.length);
      }
    }, 1000);
  };

  return (
    <motion.div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-12">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-full font-bold">
          Soalan: {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl p-12 mb-12 shadow-2xl relative text-center">
        <h3 className="text-[#1a0b3b] font-bold text-2xl mb-8">Apakah nilai untuk not ini?</h3>
        
        <motion.div 
          key={currentQ.id}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-8xl text-[#1a0b3b] mb-4"
        >
          {currentQ.symbol}
        </motion.div>
        <p className="text-xl text-purple-600 font-medium italic">{currentQ.name}</p>

        <AnimatePresence>
          {showFeedback !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-3xl z-20"
            >
              <div className={`${showFeedback ? 'text-green-500' : 'text-red-500'} flex flex-col items-center`}>
                {showFeedback ? <CheckCircle2 className="w-24 h-24" /> : <XCircle className="w-24 h-24" />}
                <span className="text-3xl font-bold mt-4">{showFeedback ? 'Syabas!' : 'Terus Mencuba!'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
        {options.map(val => (
          <button
            key={val}
            onClick={() => handleChoice(val)}
            disabled={showFeedback !== null}
            className="group relative h-40 bg-white/10 hover:bg-[#FFD700] border-2 border-white/10 hover:border-[#FFD700] rounded-3xl flex items-center justify-center text-4xl font-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <span className="group-hover:text-[#1a0b3b]">{val === 0.5 ? '1/2' : val}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- MODULE 3: MASTERI SIMBOL ---

function MasteriSimbol({ onComplete, onBack }: { onComplete: (s: number, t: number) => void, onBack: () => void }) {
  const questions = useMemo(() => {
    return [...TERMINOLOGIES, ...MUSICAL_SYMBOLS.filter(s => s.type === 'rest')]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);

  const currentQ = questions[currentIdx];
  const allChoices = useMemo(() => {
    return questions.map(q => q.value).sort(() => Math.random() - 0.5);
  }, [questions]);
  
  // Get 4 random options including the correct one
  const options = useMemo(() => {
    const wrong = allChoices.filter(c => c !== currentQ.value).slice(0, 3);
    return [currentQ.value, ...wrong].sort(() => Math.random() - 0.5);
  }, [currentQ, allChoices]);

  const handleChoice = (val: string | number) => {
    if (val === currentQ.value) {
      setGameScore(s => s + 1);
      audioEngine.playSuccess();
      setShowFeedback(true);
    } else {
      audioEngine.playError();
      setShowFeedback(false);
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        onComplete(gameScore + (val === currentQ.value ? 1 : 0), questions.length);
      }
    }, 1000);
  };

  return (
    <motion.div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-12">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Kembali</span>
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-full font-bold">
          Soalan: {currentIdx + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-[#FFD700] rounded-3xl p-12 mb-12 shadow-2xl relative text-center">
        <h3 className="text-[#1a0b3b] font-bold text-2xl mb-8 uppercase tracking-widest">Pilihkan jawapan yang betul</h3>
        
        <motion.div 
          key={currentQ.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-8xl text-[#1a0b3b] mb-4 font-serif font-black"
        >
          {currentQ.symbol}
        </motion.div>
        <p className="text-2xl text-[#1a0b3b]/60 font-bold">{currentQ.name}</p>

        <AnimatePresence>
          {showFeedback !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[#1a0b3b]/90 rounded-3xl z-20"
            >
              <div className={`${showFeedback ? 'text-[#FFD700]' : 'text-red-400'} flex flex-col items-center`}>
                {showFeedback ? <Star className="w-24 h-24 fill-current" /> : <XCircle className="w-24 h-24" />}
                <span className="text-3xl font-bold mt-4">{showFeedback ? 'HEBAT!' : 'CUBA LAGI!'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-2 gap-4 w-full max-w-4xl">
        {options.map((val, i) => (
          <button
            key={i}
            onClick={() => handleChoice(val)}
            disabled={showFeedback !== null}
            className="p-8 rounded-2xl bg-white/5 border border-white/20 hover:bg-[#FFD700] hover:text-[#1a0b3b] text-xl font-bold transition-all text-center disabled:opacity-50"
          >
            {val === 0.5 ? '1/2' : val}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- MODULE 4: CIPTA IRAMA ---

function CiptaIrama({ onComplete, onBack }: { onComplete: () => void, onBack: () => void }) {
  const [bars, setBars] = useState<MusicalSymbol[][]>([[], [], [], []]);
  const [activeBar, setActiveBar] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const allowedNotes = useMemo(() => {
    return MUSICAL_SYMBOLS.filter(s => ['sb', 'm', 'k', 'kv'].includes(s.id));
  }, []);

  const calculateBeats = (bar: MusicalSymbol[]) => {
    return bar.reduce((sum, note) => sum + (note.value as number), 0);
  };

  const addNote = (note: MusicalSymbol) => {
    const currentBeats = calculateBeats(bars[activeBar]);
    if (currentBeats + (note.value as number) > 4) {
      audioEngine.playError();
      return;
    }
    
    const newBars = [...bars];
    newBars[activeBar] = [...newBars[activeBar], note];
    setBars(newBars);
    audioEngine.playPercussion(0.05);
  };

  const removeNote = (barIdx: number, noteIdx: number) => {
    const newBars = [...bars];
    newBars[barIdx] = newBars[barIdx].filter((_, i) => i !== noteIdx);
    setBars(newBars);
  };

  const playRhythm = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const templeValue = 600; // 600ms per beat
    
    for (let b = 0; b < 4; b++) {
      setActiveBar(b);
      const barNotes = bars[b];
      
      // We need to play the notes in sequence based on their duration
      // This is a simplified sequential player
      for (const note of barNotes) {
        audioEngine.playPercussion(0.1);
        await new Promise(resolve => setTimeout(resolve, (note.value as number) * templeValue));
      }

      // If bar is not full, wait for the remaining beats
      const remaining = 4 - calculateBeats(barNotes);
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining * templeValue));
      }
    }
    
    setIsPlaying(false);
    setActiveBar(0);
  };

  return (
    <motion.div className="relative z-10 flex flex-col items-center min-h-screen px-6 py-12">
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Menu</span>
        </button>
        <div className="bg-white/10 px-6 py-2 rounded-full font-bold">
          Modul: Ciptaan Irama (4/4)
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 overflow-x-auto">
        <div className="flex gap-4 min-w-[800px]">
          {bars.map((bar, bIdx) => (
            <div 
              key={bIdx}
              onClick={() => setActiveBar(bIdx)}
              className={`flex-1 min-h-[160px] border-2 rounded-2xl p-4 transition-all relative cursor-pointer ${
                activeBar === bIdx ? 'border-[#FFD700] bg-white/5' : 'border-white/10 bg-black/20'
              }`}
            >
              <div className="absolute top-2 left-2 text-xs font-bold opacity-40">BAR {bIdx + 1}</div>
              <div className="absolute top-2 right-2 text-xs font-bold text-[#FFD700]">
                {calculateBeats(bar)} / 4
              </div>
              
              <div className="flex items-end justify-center h-full gap-2 pt-6">
                {bar.map((note, nIdx) => (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={`${bIdx}-${nIdx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNote(bIdx, nIdx);
                    }}
                    className="text-4xl hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {note.symbol}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-3xl">
          <h4 className="text-[#FFD700] font-bold mb-4">PILIH NOT UNTUK DITAMBAH:</h4>
          <div className="grid grid-cols-4 gap-4">
            {allowedNotes.map(note => (
              <button
                key={note.id}
                onClick={() => addNote(note)}
                className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-[#FFD700] hover:text-[#1a0b3b] transition-all group"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform">{note.symbol}</span>
                <span className="text-[10px] mt-2 font-bold uppercase">{note.name}</span>
                <span className="text-[10px] opacity-60">({note.value === 0.5 ? '1/2' : note.value} bit)</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={playRhythm}
            disabled={isPlaying}
            className={`w-full py-6 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${
              isPlaying ? 'bg-white/10 text-white/40' : 'bg-[#FFD700] text-[#1a0b3b] shadow-lg shadow-[#FFD700]/20 hover:scale-[1.02]'
            }`}
          >
            <Play className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'DIMAINKAN...' : 'MAINKAN CIPTAN ANDA'}
          </button>
          
          <button
            onClick={() => setBars([[], [], [], []])}
            className="w-full py-4 rounded-2xl border border-white/10 hover:bg-red-500 transition-all font-bold"
          >
            PADAM SEMUA
          </button>

          <button
            onClick={onComplete}
            className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-bold"
          >
            TAMAT HASIL CIPTAAN
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- MODULE 5: IRAMA KILAT ---

interface Tile {
  id: number;
  lane: number;
  y: number; // 0 to 100 (percentage of screen height)
}

function IramaKilat({ coins, onUpdateCoins, onBack }: { coins: number, onUpdateCoins: (c: number) => void, onBack: () => void }) {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [instrument, setInstrument] = useState<'piano' | 'recorder' | 'drum'>('piano');
  const [speed, setSpeed] = useState(1);
  const [lastTileTime, setLastTileTime] = useState(0);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const requestRef = React.useRef<number>(null);
  const startTimeRef = React.useRef<number>(null);

  const lanes = [0, 1, 2, 3];
  const laneKeys = ['d', 'f', 'j', 'k'];
  
  // Audio frequencies for lanes
  const laneFreqs = [261.63, 293.66, 329.63, 349.23]; // C, D, E, F

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const laneIdx = laneKeys.indexOf(key);
      if (laneIdx !== -1) {
        handleTap(laneIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, tiles, instrument]); // Include dependencies needed by handleTap if it's not memoized properly, but handleTap uses state directly. Wait, handleTap is defined in the component body and uses 'tiles', 'gameState', etc. If I don't memoize handleTap, I should put dependencies here.

  const startGame = () => {
    setTiles([]);
    setSpeed(1.5);
    setGameState('playing');
    setLastTileTime(performance.now());
  };

  const spawnTile = () => {
    const lane = Math.floor(Math.random() * 4);
    const newTile: Tile = {
      id: Date.now() + Math.random(),
      lane,
      y: -20
    };
    setTiles(prev => [...prev, newTile]);
  };

  const handleTap = (laneIdx: number) => {
    if (gameState !== 'playing') return;

    // Find the lowest tile in this lane
    const targetTile = tiles
      .filter(t => t.lane === laneIdx)
      .sort((a, b) => b.y - a.y)[0];

    if (targetTile && targetTile.y > 60 && targetTile.y < 95) {
      // Perfect tap!
      onUpdateCoins(10);
      setTiles(prev => prev.filter(t => t.id !== targetTile.id));
      
      if (instrument === 'drum') {
        audioEngine.playDrum();
      } else {
        audioEngine.playNote(laneFreqs[laneIdx], 0.3, instrument);
      }
      
      // Speed up slightly
      setSpeed(prev => Math.min(prev + 0.02, 5));
    } else {
      // Missed or wrong timing - Instant Game Over
      audioEngine.playError();
      setGameState('gameover');
    }
  };

  useEffect(() => {
    const animate = (time: number) => {
      if (gameState !== 'playing') return;

      if (!startTimeRef.current) startTimeRef.current = time;
      
      // Spawn logic
      if (time - lastTileTime > (2000 / speed)) {
        spawnTile();
        setLastTileTime(time);
      }

      // Update tiles
      setTiles(prev => {
        let missedCount = 0;
        const nextTiles = prev.map(t => ({ ...t, y: t.y + speed })).filter(t => {
          if (t.y > 110) {
            missedCount++;
            return false;
          }
          return true;
        });

        if (missedCount > 0) {
          audioEngine.playError();
          setGameState('gameover');
        }
        return nextTiles;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, speed, lastTileTime]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center min-h-screen pt-20 px-4 overflow-hidden"
    >
      {/* Header Info */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Utama</span>
        </button>
      </div>

      {gameState === 'lobby' && (
        <div className="text-center max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-20">
          <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-4 tracking-tighter">IRAMA KILAT</h2>
          <p className="text-purple-200/60 mb-8 font-medium">Uji kepantasan anda! Tap tile yang jatuh tepat pada waktunya.</p>

          <button 
            onClick={startGame}
            className="w-full py-4 bg-yellow-500 text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20"
          >
            MULA PERMAINAN
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="relative w-full max-w-lg h-[600px] bg-black/10 rounded-2xl overflow-hidden shadow-2xl border-x border-white/5">
          {/* Lanes */}
          <div className="absolute inset-0 flex">
            {lanes.map(i => (
              <div 
                key={i} 
                className="flex-1 border-r border-white/5 last:border-none relative cursor-pointer active:bg-white/5 transition-colors"
                onMouseDown={() => handleTap(i)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleTap(i);
                }}
              />
            ))}
          </div>

          {/* Target Zone Line */}
          <div className="absolute bottom-20 left-0 w-full h-[60px] border-y-2 border-yellow-500/30 bg-yellow-500/5 pointer-events-none flex items-center justify-center">
            <div className="w-full h-1 bg-yellow-500/20 blur-sm" />
          </div>
          <div className="absolute bottom-20 left-0 w-full flex justify-around pointer-events-none">
             {lanes.map(i => (
               <div key={i} className="flex flex-col items-center">
                 <div className="w-12 h-12 bg-yellow-500/10 rounded-full blur-md" />
                 <span className="text-yellow-500/50 font-black text-xl mt-[-30px] uppercase">{laneKeys[i]}</span>
               </div>
             ))}
          </div>

          {/* Tiles */}
          {tiles.map(tile => (
            <motion.div
              key={tile.id}
              className="absolute w-[25%] h-24 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-white/20"
              style={{
                left: `${tile.lane * 25}%`,
                top: `${tile.y}%`
              }}
            >
               <div className="absolute inset-0 bg-white/10 animate-pulse" />
            </motion.div>
          ))}
        </div>
      )}

      {gameState === 'gameover' && (
        <div className="text-center max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mt-20">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-4xl font-black mb-2 tracking-tighter">TAMAT!</h2>
          <p className="text-purple-200/60 mb-8">Percubaan yang bagus!</p>
          
          <button 
            onClick={startGame}
            className="w-full py-4 bg-yellow-500 text-black font-black text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all mb-4"
          >
            CUBA LAGI
          </button>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-white/10 font-bold rounded-2xl hover:bg-white/20 transition-all"
          >
            BALIK KE MENU
          </button>
        </div>
      )}

      {/* Touch instruction */}
      {gameState === 'playing' && (
        <p className="mt-8 text-purple-200/40 text-sm font-bold uppercase tracking-widest animate-bounce">
          Tap Lorong Apabila Tile Masuk Ke Garisan Kuning
        </p>
      )}
    </motion.div>
  );
}

// --- MODULE 6: STUDIO RAKAMAN ---

interface RecordedNote {
  freq: number;
  type: 'piano' | 'recorder' | 'drum';
  time: number;
}

function StudioRakaman({ ownedInstruments, onBack }: { ownedInstruments: string[], onBack: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recording, setRecording] = useState<RecordedNote[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState(0);

  const categories = [
    { label: 'Gendang', color: 'bg-green-500', type: 'drum' as const, notes: [100, 150, 200, 250] },
    { label: 'Piano', color: 'bg-yellow-500', type: 'piano' as const, notes: [261.63, 293.66, 329.63, 349.23, 392.00] },
    { label: 'Rekoder', color: 'bg-blue-500', type: 'recorder' as const, notes: [440.00, 493.88, 523.25, 587.33] },
  ].filter(c => ownedInstruments.includes(c.type));

  const playSound = (freq: number, type: 'piano' | 'recorder' | 'drum') => {
    if (type === 'drum') {
      audioEngine.playDrum();
    } else {
      audioEngine.playNote(freq, 0.3, type);
    }

    if (isRecording) {
      const now = performance.now();
      setRecording(prev => [...prev, { freq, type, time: now - recordingStartTime }]);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setRecording([]);
      setRecordingStartTime(performance.now());
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  const playBack = async () => {
    if (recording.length === 0 || isPlaying) return;
    setIsPlaying(true);

    const start = performance.now();
    
    for (const note of recording) {
      const timeToWait = note.time - (performance.now() - start);
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
      
      if (note.type === 'drum') {
        audioEngine.playDrum();
      } else {
        audioEngine.playNote(note.freq, 0.3, note.type);
      }
    }

    setIsPlaying(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center min-h-screen pt-20 px-4"
    >
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Utama</span>
        </button>
        <h2 className="text-2xl font-black tracking-tighter text-purple-200">STUDIO RAKAMAN</h2>
      </div>

      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{cat.label}</span>
              <div className={`w-full p-6 rounded-3xl ${cat.color}/10 border border-white/10 flex flex-wrap justify-center gap-3`}>
                {cat.notes.map((note, nIdx) => (
                  <button
                    key={nIdx}
                    onMouseDown={() => playSound(note, cat.type)}
                    className={`w-14 h-14 rounded-full ${cat.color} shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-b-4 border-black/20`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white/30" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 border-t border-white/5">
          <div className="flex gap-4">
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg transition-all ${
                isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
              {isRecording ? 'STOP' : 'RECORD'}
            </button>

            <button 
              onClick={playBack}
              disabled={recording.length === 0 || isPlaying}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg transition-all ${
                isPlaying
                ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                : 'bg-yellow-500 text-black hover:scale-105 disabled:opacity-30 disabled:hover:scale-100'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              PLAY
            </button>
          </div>

          <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Status Rakaman</span>
             <div className="flex gap-1">
                {recording.length > 0 ? (
                  <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500" 
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                ) : (
                  <span className="text-white/20 text-xs italic">Tiada data rakaman</span>
                )}
             </div>
          </div>
        </div>

        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />
      </div>
      
      <p className="mt-8 text-white/20 text-xs font-bold uppercase tracking-[0.3em]">Cipta karya anda di Studio Rakaman</p>
    </motion.div>
  );
}

// --- KEDAI MUZIK ---

function KedaiMuzik({ coins, ownedInstruments, onBuy, onBack }: { 
  coins: number, 
  ownedInstruments: string[], 
  onBuy: (id: string, price: number) => void,
  onBack: () => void 
}) {
  const shopItems = [
    { id: 'drum', label: 'GENDANG', price: 500, icon: <Music className="w-12 h-12" />, color: 'bg-green-500' },
    { id: 'piano', label: 'PIANO', price: 800, icon: <Play className="w-12 h-12" />, color: 'bg-yellow-500' },
    { id: 'recorder', label: 'REKODER', price: 1000, icon: <Volume2 className="w-12 h-12" />, color: 'bg-blue-500' },
  ];

  const handlePurchase = (item: typeof shopItems[0]) => {
    if (coins >= item.price && !ownedInstruments.includes(item.id)) {
      onBuy(item.id, item.price);
      audioEngine.playNote(440, 0.5);
    } else if (coins < item.price) {
      audioEngine.playError();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center min-h-screen pt-24 px-6"
    >
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Utama</span>
        </button>
        <h2 className="text-3xl font-black italic tracking-tighter text-yellow-500">KEDAI MUZIK</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">
        {shopItems.map((item) => {
          const isOwned = ownedInstruments.includes(item.id);
          const canAfford = coins >= item.price;
          
          return (
            <motion.div
              key={item.id}
              whileHover={isOwned ? {} : { y: -10 }}
              className={`relative flex flex-col rounded-[32px] p-8 border-2 transition-all ${
                isOwned 
                ? 'bg-white/5 border-white/5 opacity-60' 
                : 'bg-white/10 border-white/10 hover:border-yellow-500/50'
              }`}
            >
              <div className={`mb-8 w-24 h-24 rounded-3xl ${item.color} flex items-center justify-center text-white shadow-2xl`}>
                {item.icon}
              </div>
              
              <h3 className="text-2xl font-black mb-1">{item.label}</h3>
              <div className="flex items-center gap-1 mb-8">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-xl font-bold text-yellow-500">{item.price}</span>
              </div>

              <button
                disabled={isOwned || !canAfford}
                onClick={() => handlePurchase(item)}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                  isOwned 
                  ? 'bg-white/10 text-white/40' 
                  : canAfford 
                    ? 'bg-yellow-500 text-black hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20' 
                    : 'bg-red-500/20 text-red-400 cursor-not-allowed'
                }`}
              >
                {isOwned ? 'DIPILIK' : canAfford ? 'BELI SEKARANG' : 'WANG TIDAK CUKUP'}
              </button>

              {!isOwned && !canAfford && (
                <p className="mt-4 text-center text-red-500/60 text-xs font-bold uppercase tracking-widest">
                  Perlu {item.price - coins} syiling lagi
                </p>
              )}

              {isOwned && (
                <div className="absolute top-6 right-6">
                  <Award className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center max-w-lg">
        <p className="text-purple-200 text-sm italic">
          "Dapatkan mata wang dengan bermain **Irama Kilat** atau menjawab kuiz dengan cemerlang!"
        </p>
      </div>
    </motion.div>
  );
}

// --- MODULE 7: PERANTIS REKODER ---

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

function ParticleCanvas({ trigger }: { trigger: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const particles = React.useRef<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    
    // Launch particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const colors = ['#FFD700', '#9d4edd', '#4cc9f0', '#f72585'];
    
    for (let i = 0; i < 30; i++) {
      particles.current.push({
        id: Math.random(),
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }
  }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.alpha > 0.01);
      
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.96;
        
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

function RecorderDiagram({ holes }: { holes: number[] }) {
  // holes: [Thumb, 1, 2, 3, 4, 5, 6, 7]
  return (
    <div className="relative w-24 h-80 bg-gray-200/20 backdrop-blur-md rounded-full border border-white/20 p-4 flex flex-col items-center gap-3">
      {/* Thumb (Rear) - Smaller and slightly offset */}
      <div className="absolute -left-8 top-8 flex flex-col items-center">
        <span className="text-[10px] opacity-40 font-bold mb-1">IBU JARI</span>
        <div className={`w-6 h-6 rounded-full border-2 border-white/40 shadow-inner ${holes[0] ? 'bg-[#FFD700] border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'bg-transparent'}`} />
      </div>

      {/* Front Holes */}
      {holes.slice(1).map((isClosed, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full border-2 border-white/40 shadow-inner transition-all duration-300 ${isClosed ? 'bg-[#FFD700] border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.6)]' : 'bg-transparent'}`}>
             <div className={`w-full h-full rounded-full ${isClosed ? 'bg-gradient-to-tr from-black/20 to-transparent' : ''}`} />
          </div>
          {i === 2 && <div className="w-12 h-0.5 bg-white/10 my-1" />} {/* Divider Left/Right Hand */}
        </div>
      ))}
      
      {/* Decorative mouthpiece */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-12 bg-gray-200/20 rounded-t-xl border border-white/20" />
    </div>
  );
}

const FINGERINGS_DATA: Record<string, number[]> = {
  'E': [1, 1, 1, 1, 1, 1, 0, 0], 
  'F': [1, 1, 1, 1, 1, 0, 0, 0], 
  'G': [1, 1, 1, 1, 0, 0, 0, 0], 
  'A': [1, 1, 1, 0, 0, 0, 0, 0], 
  'B': [1, 1, 0, 0, 0, 0, 0, 0], 
  'C\'': [1, 0, 1, 0, 0, 0, 0, 0], 
  'D\'': [0, 0, 1, 0, 0, 0, 0, 0], 
};

function Rekoder({ onBack }: { onBack: () => void }) {
  const [activeNote, setActiveNote] = useState<MusicalSymbol>(STAFF_NOTES[0]);
  const [particleTrigger, setParticleTrigger] = useState(0);

  const handlePlayNote = (note: MusicalSymbol) => {
    setActiveNote(note);
    audioEngine.playNote(note.audioFreq || 440, "2n", 'recorder');
    setParticleTrigger(prev => prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center min-h-screen pt-20 px-4"
    >
      <ParticleCanvas trigger={particleTrigger} />

      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors">
          <Home className="w-5 h-5" />
          <span>Utama</span>
        </button>
        <div className="bg-[#FFD700] text-[#1a0b3b] px-6 py-2 rounded-full font-black text-sm tracking-widest">
          UNIT REKODER TAHUN 5
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Section 1: Staff Visual */}
        <div className="space-y-8">
           <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-500/20">
             <h3 className="text-[#1a0b3b] font-black text-center mb-6 uppercase tracking-tighter text-xl">Notasi Pada Baluk</h3>
             <svg viewBox="0 0 400 150" className="w-full h-auto">
               {[1, 2, 3, 4, 5].map(i => (
                 <line key={i} x1="20" y1={30 + i * 20} x2="380" y2={30 + i * 20} stroke="#1a0b3b" strokeWidth="2" />
               ))}
               <text x="30" y="110" fontSize="80" fill="#1a0b3b" fontFamily="serif">𝄞</text>
               {activeNote.name === 'E' && (
                 <line x1="180" y1="130" x2="220" y2="130" stroke="#1a0b3b" strokeWidth="2" />
               )}
               <motion.ellipse 
                 key={activeNote.id}
                 initial={{ scale: 0, x: -50 }}
                 animate={{ scale: 1, x: 0 }}
                 cx="200" 
                 cy={130 - (activeNote.value as number) * 10} 
                 rx="12" ry="9" 
                 fill="#1a0b3b"
                 transform="rotate(-20 200 130)"
               />
               <text x="230" y={135 - (activeNote.value as number) * 10} className="text-4xl font-black fill-purple-600 italic">
                 {activeNote.name}
               </text>
             </svg>
           </div>
           
           <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] text-center">
             <h4 className="text-purple-300 font-bold mb-4 uppercase text-xs tracking-[0.3em]">Tip Pembelajaran</h4>
             <p className="text-sm leading-relaxed text-purple-100/70">
               Pastikan jari anda menutup lubang rekoder dengan rapat untuk menghasilkan bunyi yang terang dan tepat.
             </p>
           </div>
        </div>

        {/* Section 2: Fingering Diagram */}
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-black mb-12 bg-gradient-to-b from-[#FFD700] to-yellow-600 bg-clip-text text-transparent text-center">
            PENJARIAN REKODER JENIS GERMAN
          </h3>
          <RecorderDiagram holes={FINGERINGS_DATA[activeNote.name] || [0,0,0,0,0,0,0,0]} />
        </div>

        {/* Section 3: Note Selection */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-purple-300 mb-8 uppercase tracking-widest text-center lg:text-left">Pilih Not Muzik</h3>
          <div className="grid grid-cols-2 gap-4">
            {STAFF_NOTES.map(note => (
              <button
                key={note.id}
                onMouseDown={() => handlePlayNote(note)}
                className={`group relative flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all duration-300 active:scale-95 ${
                  activeNote.id === note.id 
                  ? 'bg-[#FFD700] border-[#FFD700] text-[#1a0b3b] shadow-[0_0_30px_rgba(255,215,0,0.3)]' 
                  : 'bg-white/5 border-white/10 text-white hover:border-[#FFD700]/50'
                }`}
              >
                <span className="text-4xl font-black mb-2 italic tracking-tighter">{note.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${activeNote.id === note.id ? 'opacity-60' : 'opacity-20'}`}>
                   Tekan & Main
                </span>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-[#FFD700] rounded-[32px] opacity-0 group-hover:opacity-10 blur-xl transition-opacity pointer-events-none" />
              </button>
            ))}
          </div>
          
          <div className="mt-12 p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center gap-6">
             <div className="w-16 h-16 rounded-2xl bg-[#FFD700] flex items-center justify-center text-[#1a0b3b] shrink-0 shadow-lg">
                <Volume2 className="w-8 h-8" />
             </div>
             <div>
                <p className="font-bold text-white mb-1">Bunyi Realistik</p>
                <p className="text-xs text-purple-200/60 leading-tight">Dikuasakan oleh Tone.js untuk pengalaman pendengaran berkualiti tinggi.</p>
             </div>
          </div>
        </div>
      </div>
      
      <p className="mt-16 text-white/10 text-[10px] font-bold uppercase tracking-[0.5em]">Teori Muzik Fun - Modul Rekoder</p>
    </motion.div>
  );
}

// --- RESULT & CERTIFICATE ---

function ResultScreen({ name, score, total, onReset }: { name: string, score: number, total: number, onReset: () => void }) {
  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D';

  const handleDownload = () => {
    const element = document.getElementById('sijil-container');
    if (!element) return;
    
    // Use window.html2canvas because it's loaded via CDN
    // @ts-ignore
    window.html2canvas(element, { 
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true
    }).then((canvas: any) => {
      const link = document.createElement('a');
      const fileName = `Sijil_Muzik_Tahun5_${name.replace(/\s+/g, '_')}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="inline-block p-6 rounded-full bg-[#FFD700] text-[#1a0b3b] mb-8"
        >
          <Trophy className="w-20 h-20" />
        </motion.div>

        <h2 className="text-5xl font-bold text-[#FFD700] mb-4 uppercase">TAHNIAH, {name.split(' ')[0]}!</h2>
        <p className="text-2xl text-purple-200 mb-12">Anda telah menamatkan cabaran Teori Muzik Fun</p>

        {/* Certificate Component */}
        <div id="sijil-container" className="bg-white p-2 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.3)] mb-12 overflow-hidden">
          <div className="border-8 border-[#2D1B69] p-8 md:p-12 relative flex flex-col items-center bg-white text-[#1a0b3b]">
             {/* Decorative Corner */}
             <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-[#FFD700]" />
             <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-[#FFD700]" />
             <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-[#FFD700]" />
             <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-[#FFD700]" />

             <h3 className="text-4xl font-serif font-black mb-2">SIJIL PENCAPAIAN DIGITAL</h3>
             <p className="text-[#1a0b3b]/60 font-bold tracking-widest mb-12 uppercase">KUIZ PENDIDIKAN MUZIK TAHUN 5</p>
             
             <p className="text-xl mb-6">Dianugerahkan kepada:</p>
             <h4 className="text-5xl text-[#2D1B69] font-bold border-b-4 border-[#FFD700] pb-2 mb-8 uppercase tracking-wide">
               {name}
             </h4>
             
             <p className="text-lg max-w-lg mb-12">
               Kerana telah menunjukkan kecemerlangan dalam menguasai Teori Muzik berasaskan DSKP Pendidikan Muzik Tahun 5.
             </p>

             <div className="grid grid-cols-3 gap-12 w-full">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-[#2D1B69]">{percentage}%</span>
                  <p className="text-sm font-bold opacity-60">SKOR KESELURUHAN</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-[#2D1B69]">{grade}</span>
                  <p className="text-sm font-bold opacity-60">GRED</p>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black text-[#2D1B69]">{score}/{total}</span>
                  <p className="text-sm font-bold opacity-60">KEPUTUSAN</p>
                </div>
             </div>

             <div className="mt-12 flex items-center justify-center gap-2">
                <Music className="w-6 h-6 text-[#FFD700]" />
                <span className="font-bold opacity-30 italic whitespace-nowrap">Dijana Secara Automatik Oleh Irama Inovasi</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Simpan Sijil</span>
          </button>
          
          <button 
            onClick={onReset}
            className="flex items-center gap-3 px-8 py-4 bg-[#FFD700] text-[#1a0b3b] hover:scale-105 rounded-2xl font-bold transition-all shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Semula</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
