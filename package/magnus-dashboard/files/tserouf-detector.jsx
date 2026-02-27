import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, ZoomIn } from 'lucide-react';

const TseroufDetector = () => {
  const [isListening, setIsListening] = useState(false);
  const [detectedLetters, setDetectedLetters] = useState([]);
  const [frequencies, setFrequencies] = useState(new Array(22).fill(0));
  const [permutations, setPermutations] = useState([]);
  const [detectedWords, setDetectedWords] = useState([]);
  const [dominantFreq, setDominantFreq] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // 22 Hebrew letters with frequency bands and meanings
  const hebrewLetters = [
    { name: 'Aleph', char: 'א', freq: 110, meaning: 'Unity, Source' },
    { name: 'Bet', char: 'ב', freq: 123, meaning: 'Duality, House' },
    { name: 'Gimel', char: 'ג', freq: 138, meaning: 'Motion, Camel' },
    { name: 'Dalet', char: 'ד', freq: 155, meaning: 'Door, Gateway' },
    { name: 'He', char: 'ה', freq: 165, meaning: 'Life, Breath' },
    { name: 'Vav', char: 'ו', freq: 185, meaning: 'Connection, Hook' },
    { name: 'Zayin', char: 'ז', freq: 207, meaning: 'Sword, Weapon' },
    { name: 'Het', char: 'ח', freq: 220, meaning: 'Enclosure, Life' },
    { name: 'Tet', char: 'ט', freq: 246, meaning: 'Serpent, Wheel' },
    { name: 'Yod', char: 'י', freq: 277, meaning: 'Hand, Point' },
    { name: 'Kaf', char: 'כ', freq: 311, meaning: 'Palm, Grasp' },
    { name: 'Lamed', char: 'ל', freq: 349, meaning: 'Goad, Teach' },
    { name: 'Mem', char: 'מ', freq: 392, meaning: 'Water, Mother' },
    { name: 'Nun', char: 'נ', freq: 440, meaning: 'Fish, Movement' },
    { name: 'Samekh', char: 'ס', freq: 493, meaning: 'Support, Prop' },
    { name: 'Ayin', char: 'ע', freq: 554, meaning: 'Eye, Source' },
    { name: 'Pe', char: 'פ', freq: 622, meaning: 'Mouth, Speech' },
    { name: 'Tsade', char: 'צ', freq: 698, meaning: 'Righteous, Hunt' },
    { name: 'Qoph', char: 'ק', freq: 784, meaning: 'Back of Head, Ape' },
    { name: 'Resh', char: 'ר', freq: 880, meaning: 'Head, Beginning' },
    { name: 'Shin', char: 'ש', freq: 988, meaning: 'Tooth, Fire' },
    { name: 'Tav', char: 'ת', freq: 1109, meaning: 'Cross, Mark' }
  ];

  // Cymatic visualization
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawCymatic = () => {
      // Background with subtle glow
      ctx.fillStyle = 'rgba(10, 20, 40, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Central glow effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, 'rgba(0, 200, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 50, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cymatic patterns based on frequencies
      const freqArray = new Float32Array(frequencies.length);
      frequencies.forEach((freq, i) => {
        freqArray[i] = freq / 255;
      });

      // Concentric circles with frequency modulation
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 6; i++) {
        const radius = 20 + i * 40 + Math.sin(Date.now() / 1000 + i) * 15;
        const modulation = freqArray[i % 22] * 30;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + modulation, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Interference patterns - geometric tessellation
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.3)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += 40) {
        for (let y = 0; y < canvas.height; y += 40) {
          const dist = Math.hypot(x - centerX, y - centerY);
          const freq = Math.sin(dist / 50 + Date.now() / 2000) * 20;
          const intensity = freqArray[Math.floor((x + y) / 100) % 22];
          
          ctx.globalAlpha = intensity * 0.6;
          ctx.fillStyle = intensity > 0.3 ? 'rgba(255, 200, 0, 0.5)' : 'rgba(0, 200, 255, 0.3)';
          ctx.fillRect(x - 10 + freq, y - 10 + freq, 20, 20);
          ctx.globalAlpha = 1;
        }
      }

      // Frequency bars visualization
      ctx.fillStyle = 'rgba(0, 200, 255, 0.6)';
      const barWidth = canvas.width / 22;
      frequencies.forEach((freq, i) => {
        const barHeight = (freq / 255) * (canvas.height / 2);
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      });

      animationRef.current = requestAnimationFrame(drawCymatic);
    };

    drawCymatic();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [frequencies]);

  // Initialize audio context
  const initializeAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = audioContext.createMediaStreamAudioSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyserRef.current = analyser;

      analyzeAudio();
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please allow microphone access to use Tserouf Detector');
    }
  };

  // Analyze audio frequencies
  const analyzeAudio = () => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Map frequency bins to Hebrew letters
    const newFreqs = new Array(22).fill(0);
    const newDetected = [];
    let maxFreq = 0;
    let maxIndex = 0;

    hebrewLetters.forEach((letter, idx) => {
      const binIndex = Math.floor((letter.freq / 22050) * analyserRef.current.frequencyBinCount);
      const bandwidth = Math.max(5, Math.floor(analyserRef.current.frequencyBinCount / 22));
      
      let energy = 0;
      for (let i = 0; i < bandwidth; i++) {
        energy += dataArray[binIndex + i] || 0;
      }
      
      newFreqs[idx] = Math.min(255, energy / bandwidth);
      
      if (newFreqs[idx] > maxFreq) {
        maxFreq = newFreqs[idx];
        maxIndex = idx;
      }

      if (newFreqs[idx] > 80) {
        newDetected.push({
          letter: letter.char,
          name: letter.name,
          intensity: Math.floor((newFreqs[idx] / 255) * 100),
          meaning: letter.meaning
        });
      }
    });

    setFrequencies(newFreqs);
    setDetectedLetters(newDetected);
    setDominantFreq(hebrewLetters[maxIndex].freq);

    // Calculate Tserouf permutations
    if (newDetected.length > 0) {
      const result = calculatePermutations(newDetected);
      setPermutations(result.permutations);
      setDetectedWords(result.words);
    }

    requestAnimationFrame(analyzeAudio);
  };

  // Hebrew word database with Kabbalistic meanings
  const hebrewWords = [
    { 
      word: 'אל', 
      letters: ['א', 'ל'], 
      pronunciation: 'El', 
      meaning: 'God, Power, Divine Force',
      kabbalistic: 'Supreme power and creative force; represents divine authority'
    },
    { 
      word: 'אם', 
      letters: ['א', 'מ'], 
      pronunciation: 'Em', 
      meaning: 'Mother, Source',
      kabbalistic: 'The primordial mother; source of all manifestation'
    },
    { 
      word: 'שם', 
      letters: ['ש', 'מ'], 
      pronunciation: 'Shem', 
      meaning: 'Name, Essence',
      kabbalistic: 'The sacred name; essence and identity of being'
    },
    { 
      word: 'אור', 
      letters: ['א', 'ו', 'ר'], 
      pronunciation: 'Or', 
      meaning: 'Light, Illumination',
      kabbalistic: 'Divine illumination; consciousness emerging from darkness'
    },
    { 
      word: 'חיים', 
      letters: ['ח', 'י', 'י', 'מ'], 
      pronunciation: 'Chayim', 
      meaning: 'Life, Vitality',
      kabbalistic: 'Life force (Chai); eternal vital energy flowing through existence'
    },
    { 
      word: 'דבר', 
      letters: ['ד', 'ב', 'ר'], 
      pronunciation: 'Dabar', 
      meaning: 'Word, Speech, Thing',
      kabbalistic: 'The creative word; logos that manifests reality'
    },
    { 
      word: 'נשמה', 
      letters: ['נ', 'ש', 'מ', 'ה'], 
      pronunciation: 'Neshamah', 
      meaning: 'Soul, Spirit',
      kabbalistic: 'The divine spark of consciousness within being'
    },
    { 
      word: 'סוד', 
      letters: ['ס', 'ו', 'ד'], 
      pronunciation: 'Sod', 
      meaning: 'Secret, Mystery',
      kabbalistic: 'Hidden wisdom; secrets of the universe revealed through meditation'
    },
    { 
      word: 'עץ', 
      letters: ['ע', 'ץ'], 
      pronunciation: 'Etz', 
      meaning: 'Tree, Wood',
      kabbalistic: 'The Tree of Life; cosmic structure connecting all dimensions'
    },
    { 
      word: 'קול', 
      letters: ['ק', 'ו', 'ל'], 
      pronunciation: 'Kol', 
      meaning: 'Voice, Sound',
      kabbalistic: 'Divine voice; creative vibration manifesting reality'
    },
    { 
      word: 'תורה', 
      letters: ['ת', 'ו', 'ר', 'ה'], 
      pronunciation: 'Torah', 
      meaning: 'Law, Teaching, Instruction',
      kabbalistic: 'Divine law and wisdom; blueprint of creation'
    },
    { 
      word: 'כל', 
      letters: ['כ', 'ל'], 
      pronunciation: 'Kol', 
      meaning: 'All, Wholeness',
      kabbalistic: 'Totality; unified consciousness encompassing all existence'
    },
    { 
      word: 'אמת', 
      letters: ['א', 'מ', 'ת'], 
      pronunciation: 'Emet', 
      meaning: 'Truth, Reality',
      kabbalistic: 'Absolute truth; the fundamental reality underlying all manifestation'
    },
    { 
      word: 'שלום', 
      letters: ['ש', 'ל', 'ו', 'מ'], 
      pronunciation: 'Shalom', 
      meaning: 'Peace, Wholeness, Completeness',
      kabbalistic: 'Harmony between opposites; cosmic balance and integration'
    },
    { 
      word: 'אהבה', 
      letters: ['א', 'ה', 'ב', 'ה'], 
      pronunciation: 'Ahava', 
      meaning: 'Love, Compassion',
      kabbalistic: 'Divine love; unified consciousness transcending separation'
    },
    { 
      word: 'ברכה', 
      letters: ['ב', 'ר', 'כ', 'ה'], 
      pronunciation: 'Berakhah', 
      meaning: 'Blessing, Flow',
      kabbalistic: 'Divine blessing; infinite flow of grace and abundance'
    },
    { 
      word: 'תנין', 
      letters: ['ת', 'נ', 'י', 'נ'], 
      pronunciation: 'Tanin', 
      meaning: 'Dragon, Serpent',
      kabbalistic: 'The serpent of wisdom; kundalini life force ascending spine'
    },
    { 
      word: 'הר', 
      letters: ['ה', 'ר'], 
      pronunciation: 'Har', 
      meaning: 'Mountain, Height',
      kabbalistic: 'Ascension; reaching higher consciousness and vision'
    },
    { 
      word: 'ים', 
      letters: ['י', 'מ'], 
      pronunciation: 'Yam', 
      meaning: 'Sea, Water',
      kabbalistic: 'The unconscious; primordial waters of creation'
    }
  ];

  // Tserouf permutation logic + word matching
  const calculatePermutations = (letters) => {
    if (letters.length < 2) return { permutations: [], words: [] };

    // Find matching words
    const matchedWords = hebrewWords.filter(w => {
      // Check if all letters in the word appear in detected letters
      return w.letters.every(l => letters.some(dl => dl.letter === l));
    });

    // Sort by intensity (weighted word matching)
    const weightedMatches = matchedWords.map(w => ({
      ...w,
      matchStrength: w.letters.reduce((sum, l) => {
        const detected = letters.find(dl => dl.letter === l);
        return sum + (detected ? detected.intensity : 0);
      }, 0) / w.letters.length
    })).sort((a, b) => b.matchStrength - a.matchStrength);

    // Atbash cipher permutations
    const pairs = [];
    for (let i = 0; i < Math.min(3, letters.length - 1); i++) {
      const perm = {
        sequence: `${letters[i].letter} ↔ ${letters[(i + 1) % letters.length].letter}`,
        meaning: `${letters[i].meaning} ⟷ ${letters[(i + 1) % letters.length].meaning}`,
        power: Math.floor(Math.random() * 40 + 60)
      };
      pairs.push(perm);
    }

    return { 
      permutations: pairs,
      words: weightedMatches.slice(0, 5)
    };
  };

  // Start/Stop listening
  const toggleListening = async () => {
    if (!isListening) {
      await initializeAudio();
      setIsListening(true);
    } else {
      setIsListening(false);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      setDetectedLetters([]);
      setFrequencies(new Array(22).fill(0));
      setPermutations([]);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 border-b border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm p-6">
        <h1 className="text-4xl font-light tracking-widest mb-2">TSEROUF</h1>
        <p className="text-cyan-400 text-sm tracking-wide">Hebrew Letter Detection • Cymatic Visualization</p>
      </div>

      {/* Main canvas */}
      <div className="absolute inset-0 pt-24">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-cyan-500/30 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur-md p-6">
        <div className="max-w-6xl mx-auto">
          {/* Mic Button */}
          <div className="flex items-center justify-center mb-6 gap-4">
            <button
              onClick={toggleListening}
              className={`px-8 py-3 rounded-lg font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                isListening
                  ? 'bg-red-600/20 border-2 border-red-500 text-red-400 hover:bg-red-600/30'
                  : 'bg-cyan-600/20 border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-600/30'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff size={20} /> STOP LISTENING
                </>
              ) : (
                <>
                  <Mic size={20} /> START LISTENING
                </>
              )}
            </button>
            
            {dominantFreq > 0 && (
              <div className="text-cyan-300 text-sm">
                Dominant: <span className="font-semibold">{dominantFreq} Hz</span>
              </div>
            )}
          </div>

          {/* Detected Letters */}
          {detectedLetters.length > 0 && (
            <div className="mb-6 bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-cyan-500/20">
              <p className="text-xs text-cyan-400 uppercase tracking-widest mb-3">Detected Letters</p>
              <div className="flex flex-wrap gap-3">
                {detectedLetters.map((letter, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 rounded px-4 py-2"
                  >
                    <p className="text-2xl font-light">{letter.letter}</p>
                    <p className="text-xs text-cyan-300">{letter.name}</p>
                    <p className="text-xs text-cyan-400/70">{letter.meaning}</p>
                    <p className="text-xs text-cyan-500 mt-1">{letter.intensity}% intensity</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Words & Meanings */}
          {detectedWords.length > 0 && (
            <div className="mb-6 bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-purple-500/20">
              <p className="text-xs text-purple-400 uppercase tracking-widest mb-3">Detected Words • Meanings</p>
              <div className="space-y-4">
                {detectedWords.map((wordData, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-lg p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <div>
                        <p className="text-3xl font-light text-purple-300">{wordData.word}</p>
                        <p className="text-sm text-purple-400 italic">{wordData.pronunciation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 text-xs uppercase tracking-widest">Resonance</p>
                        <p className="text-2xl font-semibold text-purple-300">{Math.round(wordData.matchStrength)}%</p>
                      </div>
                    </div>
                    
                    <div className="mb-3 pt-3 border-t border-purple-500/20">
                      <p className="text-sm font-semibold text-purple-300 mb-1">Literal Meaning:</p>
                      <p className="text-sm text-purple-200">{wordData.meaning}</p>
                    </div>

                    <div className="bg-slate-900/50 rounded p-3 border border-purple-400/20">
                      <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Kabbalistic Significance</p>
                      <p className="text-sm text-purple-100 leading-relaxed">{wordData.kabbalistic}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {wordData.letters.map((letter, lidx) => (
                        <span key={lidx} className="text-xs bg-purple-600/30 border border-purple-400/30 rounded px-2 py-1 text-purple-300">
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tserouf Permutations */}
          {permutations.length > 0 && (
            <div className="mb-6 bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 uppercase tracking-widest mb-3">Tserouf Letter Combinations</p>
              <div className="space-y-2">
                {permutations.map((perm, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-slate-700/30 p-3 rounded border border-yellow-500/30">
                    <div>
                      <p className="font-semibold text-yellow-300">{perm.sequence}</p>
                      <p className="text-yellow-400/70 text-xs">{perm.meaning}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-semibold">{perm.power}%</p>
                      <p className="text-xs text-yellow-400/50">resonance</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {!isListening && detectedLetters.length === 0 && (
            <div className="text-center text-cyan-300/60 text-sm">
              <p>Click "START LISTENING" to detect Hebrew letter vibrations in your voice</p>
              <p className="text-xs mt-2 text-cyan-400/40">Allow microphone access when prompted</p>
            </div>
          )}
        </div>
      </div>

      {/* Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');
        
        * {
          font-family: 'JetBrains Mono', monospace;
        }
        
        h1 {
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  );
};

export default TseroufDetector;
