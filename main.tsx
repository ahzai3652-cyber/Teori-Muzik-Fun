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
  Download
} from 'lucide-react';
import { STAFF_NOTES, MUSICAL_SYMBOLS, TERMINOLOGIES, MusicalSymbol } from './types';
import { audioEngine } from './audio';

type Screen = 'splash' | 'menu' | 'module1' | 'module2' | 'module3' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userName, setUserName] = useState('');
  
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
          <MenuScreen onSelect={(m) => setScreen(m)} />
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

        {screen === 'result' && (
          <ResultScreen 
            name={userName}
            score={score} 
            total={totalQuestions} 
            onReset={resetGame} 
          />
        )}
      </AnimatePresence>
      
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

function MenuScreen({ onSelect }: { onSelect: (m: Screen) => void }) {
  const modules = [
    { id: 'module1' as Screen, title: 'Misi Notasi', desc: 'Kenali notasi E, F, G, A, B, C\', D\'' , icon: <Music className="w-8 h-8" /> },
    { id: 'module2' as Screen, title: 'Cabaran Irama', desc: 'Padankan simbol not dengan nilai' , icon: <Play className="w-8 h-8" /> },
    { id: 'module3' as Screen, title: 'Masteri Simbol', desc: 'Tanda rehat & terminologi muzik' , icon: <Trophy className="w-8 h-8" /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12"
    >
      <h2 className="text-4xl font-bold text-[#FFD700] mb-12">PILIH MODUL ANDA</h2>
      
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl">
        {modules.map((m, i) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onSelect(m.id)}
            className="group relative flex flex-col items-start p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#FFD700] hover:bg-white/10 backdrop-blur-xl transition-all text-left"
          >
            <div className="mb-6 p-4 rounded-2xl bg-[#FFD700] text-[#1a0b3b] group-hover:scale-110 transition-transform">
              {m.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-[#FFD700] transition-colors">{m.title}</h3>
            <p className="text-purple-200/60 leading-relaxed">{m.desc}</p>
            <div className="mt-8 flex items-center text-sm font-bold text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
              <span>MULA SEKARANG</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// --- MODULE 1: MISI NOTASI ---

function MisiNotasi({ onComplete, onBack }: { onComplete: (s: number, t: number) => void, onBack: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<boolean | null>(null);

  const currentNote = STAFF_NOTES[currentIdx];

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
      if (currentIdx < STAFF_NOTES.length - 1) {
        setCurrentIdx(i => i + 1);
      } else {
        onComplete(gameScore + (noteName === currentNote.name ? 1 : 0), STAFF_NOTES.length);
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
          Tahap: {currentIdx + 1} / {STAFF_NOTES.length}
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
        {STAFF_NOTES.map(note => (
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
  const options = [4, 2, 1, 0.5].sort(() => Math.random() - 0.5);

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
        <h3 className="text-[#1a0b3b] font-bold text-2xl mb-8 uppercase tracking-widest">Pilihkan jawapan yg betul</h3>
        
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
            {val}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// --- RESULT & CERTIFICATE ---

function ResultScreen({ name, score, total, onReset }: { name: string, score: number, total: number, onReset: () => void }) {
  const percentage = Math.round((score / total) * 100);
  const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D';

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
        <p className="text-2xl text-purple-200 mb-12">Anda telah menamatkan Cabaran Irama Inovasi</p>

        {/* Certificate Component */}
        <div className="bg-white p-2 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.3)] mb-12 overflow-hidden">
          <div className="border-8 border-[#2D1B69] p-8 md:p-12 relative flex flex-col items-center">
             {/* Decorative Corner */}
             <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-[#FFD700]" />
             <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-[#FFD700]" />
             <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-[#FFD700]" />
             <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-[#FFD700]" />

             <h3 className="text-4xl text-[#1a0b3b] font-serif font-black mb-2">SIJIL PENCAPAIAN DIGITAL</h3>
             <p className="text-[#1a0b3b]/60 font-bold tracking-widest mb-12">PERTANDINGAN INOVASI PENDIDIKAN MUZIK TAHUN 5</p>
             
             <p className="text-[#1a0b3b] text-xl mb-6">Dianugerahkan kepada:</p>
             <h4 className="text-5xl text-[#2D1B69] font-bold border-b-4 border-[#FFD700] pb-2 mb-8 uppercase tracking-wide">
               {name}
             </h4>
             
             <p className="text-[#1a0b3b] text-lg max-w-lg mb-12">
               Kerana telah menunjukkan kecemerlangan dalam menguasai Teori Muzik berasaskan DSKP Pendidikan Muzik Tahun 5.
             </p>

             <div className="grid grid-cols-3 gap-12 w-full text-[#1a0b3b]">
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
                <span className="text-[#1a0b3b] font-bold opacity-30 italic">Dijana Secara Automatik Oleh Irama Inovasi</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <button 
            onClick={() => window.print()}
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
