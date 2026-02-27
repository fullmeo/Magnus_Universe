import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, BookOpen } from 'lucide-react';

const TseroufDetectorV3 = () => {
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' or 'search'
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // Voice detection state
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

  // ============================================================================
  // HEBREW LETTERS DATABASE
  // ============================================================================
  
  const hebrewLetters = [
    { name: 'Aleph', char: 'א', freq: 110, meaning: 'Unity, Source', value: 1 },
    { name: 'Bet', char: 'ב', freq: 123, meaning: 'Duality, House', value: 2 },
    { name: 'Gimel', char: 'ג', freq: 138, meaning: 'Motion, Camel', value: 3 },
    { name: 'Dalet', char: 'ד', freq: 155, meaning: 'Door, Gateway', value: 4 },
    { name: 'He', char: 'ה', freq: 165, meaning: 'Life, Breath', value: 5 },
    { name: 'Vav', char: 'ו', freq: 185, meaning: 'Connection, Hook', value: 6 },
    { name: 'Zayin', char: 'ז', freq: 207, meaning: 'Sword, Weapon', value: 7 },
    { name: 'Het', char: 'ח', freq: 220, meaning: 'Enclosure, Life', value: 8 },
    { name: 'Tet', char: 'ט', freq: 246, meaning: 'Serpent, Wheel', value: 9 },
    { name: 'Yod', char: 'י', freq: 277, meaning: 'Hand, Point', value: 10 },
    { name: 'Kaf', char: 'כ', freq: 311, meaning: 'Palm, Grasp', value: 20 },
    { name: 'Lamed', char: 'ל', freq: 349, meaning: 'Goad, Teach', value: 30 },
    { name: 'Mem', char: 'מ', freq: 392, meaning: 'Water, Mother', value: 40 },
    { name: 'Nun', char: 'נ', freq: 440, meaning: 'Fish, Movement', value: 50 },
    { name: 'Samekh', char: 'ס', freq: 493, meaning: 'Support, Prop', value: 60 },
    { name: 'Ayin', char: 'ע', freq: 554, meaning: 'Eye, Source', value: 70 },
    { name: 'Pe', char: 'פ', freq: 622, meaning: 'Mouth, Speech', value: 80 },
    { name: 'Tsade', char: 'צ', freq: 698, meaning: 'Righteous, Hunt', value: 90 },
    { name: 'Qoph', char: 'ק', freq: 784, meaning: 'Back of Head, Ape', value: 100 },
    { name: 'Resh', char: 'ר', freq: 880, meaning: 'Head, Beginning', value: 200 },
    { name: 'Shin', char: 'ש', freq: 988, meaning: 'Tooth, Fire', value: 300 },
    { name: 'Tav', char: 'ת', freq: 1109, meaning: 'Cross, Mark', value: 400 }
  ];

  // ============================================================================
  // HEBREW WORDS DATABASE (Extended with names and French translations)
  // ============================================================================

  const hebrewWords = [
    // Names (First & Last)
    { 
      word: 'דוד', 
      letters: ['ד', 'ו', 'ד'],
      pronunciation: 'David', 
      french: 'David',
      meaning: 'Beloved, Friend',
      kabbalistic: 'Beloved of God; the perfect balance between strength and compassion',
      category: 'name'
    },
    { 
      word: 'שלומי', 
      letters: ['ש', 'ל', 'ו', 'מ', 'י'],
      pronunciation: 'Shlomi', 
      french: 'Shlomi',
      meaning: 'My Peace',
      kabbalistic: 'The personal manifestation of divine peace and wholeness',
      category: 'name'
    },
    { 
      word: 'מרים', 
      letters: ['מ', 'ר', 'י', 'מ'],
      pronunciation: 'Miriam', 
      french: 'Miriam',
      meaning: 'Star of the Sea, Beloved',
      kabbalistic: 'The eternal feminine; guide of souls through spiritual waters',
      category: 'name'
    },
    { 
      word: 'רחל', 
      letters: ['ר', 'ח', 'ל'],
      pronunciation: 'Rachel', 
      french: 'Rachel',
      meaning: 'Lamb, Innocent One',
      kabbalistic: 'Pure innocence; the lamb-like quality of trust in divine providence',
      category: 'name'
    },
    { 
      word: 'יוסף', 
      letters: ['י', 'ו', 'ס', 'ף'],
      pronunciation: 'Yosef', 
      french: 'Joseph',
      meaning: 'God Adds, Increases',
      kabbalistic: 'Divine multiplication; increase of spiritual potential and abundance',
      category: 'name'
    },
    { 
      word: 'שרה', 
      letters: ['ש', 'ר', 'ה'],
      pronunciation: 'Sarah', 
      french: 'Sarah',
      meaning: 'Princess, Noble Woman',
      kabbalistic: 'Divine queenship; the sovereign consciousness ruling the kingdom of self',
      category: 'name'
    },
    { 
      word: 'אברהם', 
      letters: ['א', 'ב', 'ר', 'ה', 'מ'],
      pronunciation: 'Abraham', 
      french: 'Abraham',
      meaning: 'Father of Multitudes',
      kabbalistic: 'The patriarch consciousness; unity encompassing infinite diversity',
      category: 'name'
    },
    { 
      word: 'לא', 
      letters: ['ל', 'א'],
      pronunciation: 'Lo', 
      french: 'Non, Ne pas',
      meaning: 'No, Not',
      kabbalistic: 'Negation as power; the refusal that liberates',
      category: 'word'
    },
    { 
      word: 'כן', 
      letters: ['כ', 'נ'],
      pronunciation: 'Ken', 
      french: 'Oui, Ainsi',
      meaning: 'Yes, Thus, So',
      kabbalistic: 'Affirmation; the creative power of assent',
      category: 'word'
    },
    { 
      word: 'אהבה', 
      letters: ['א', 'ה', 'ב', 'ה'], 
      pronunciation: 'Ahava', 
      french: 'Amour',
      meaning: 'Love, Compassion',
      kabbalistic: 'Divine love; unified consciousness transcending separation',
      category: 'word'
    },
    { 
      word: 'שלום', 
      letters: ['ש', 'ל', 'ו', 'מ'], 
      pronunciation: 'Shalom', 
      french: 'Paix',
      meaning: 'Peace, Wholeness, Completeness',
      kabbalistic: 'Harmony between opposites; cosmic balance and integration',
      category: 'word'
    },
    { 
      word: 'אור', 
      letters: ['א', 'ו', 'ר'], 
      pronunciation: 'Or', 
      french: 'Lumière',
      meaning: 'Light, Illumination',
      kabbalistic: 'Divine illumination; consciousness emerging from darkness',
      category: 'word'
    },
    { 
      word: 'חיים', 
      letters: ['ח', 'י', 'י', 'מ'], 
      pronunciation: 'Chayim', 
      french: 'Vie',
      meaning: 'Life, Vitality',
      kabbalistic: 'Life force (Chai); eternal vital energy flowing through existence',
      category: 'word'
    },
    { 
      word: 'מים', 
      letters: ['מ', 'י', 'מ'], 
      pronunciation: 'Mayim', 
      french: 'Eau',
      meaning: 'Water',
      kabbalistic: 'The primordial ocean; consciousness in fluid form',
      category: 'word'
    },
    { 
      word: 'אש', 
      letters: ['א', 'ש'], 
      pronunciation: 'Esh', 
      french: 'Feu',
      meaning: 'Fire',
      kabbalistic: 'Divine passion; transformation through sacred flame',
      category: 'word'
    },
    { 
      word: 'עץ', 
      letters: ['ע', 'ץ'], 
      pronunciation: 'Etz', 
      french: 'Arbre',
      meaning: 'Tree, Wood',
      kabbalistic: 'The Tree of Life; cosmic structure connecting all dimensions',
      category: 'word'
    },
    { 
      word: 'ספר', 
      letters: ['ס', 'פ', 'ר'], 
      pronunciation: 'Sefer', 
      french: 'Livre',
      meaning: 'Book, Writing',
      kabbalistic: 'Sacred text; the divine word made manifest in physical form',
      category: 'word'
    },
    { 
      word: 'דברים', 
      letters: ['ד', 'ב', 'ר', 'י', 'מ'], 
      pronunciation: 'Devarim', 
      french: 'Paroles, Choses',
      meaning: 'Words, Things, Speech',
      kabbalistic: 'Reality shaped by speech; the power of the spoken word',
      category: 'word'
    },
    { 
      word: 'קול', 
      letters: ['ק', 'ו', 'ל'], 
      pronunciation: 'Kol', 
      french: 'Voix, Son',
      meaning: 'Voice, Sound',
      kabbalistic: 'Divine voice; creative vibration manifesting reality',
      category: 'word'
    },
    { 
      word: 'עיניים', 
      letters: ['ע', 'י', 'נ', 'י', 'י', 'מ'], 
      pronunciation: 'Einayim', 
      french: 'Yeux',
      meaning: 'Eyes, Vision',
      kabbalistic: 'Divine perception; the eye of God seeing all truth',
      category: 'word'
    },
    { 
      word: 'לב', 
      letters: ['ל', 'ב'], 
      pronunciation: 'Lev', 
      french: 'Cœur',
      meaning: 'Heart',
      kabbalistic: 'Seat of wisdom and consciousness; the center of being',
      category: 'word'
    },
    { 
      word: 'נשמה', 
      letters: ['נ', 'ש', 'מ', 'ה'], 
      pronunciation: 'Neshamah', 
      french: 'Âme',
      meaning: 'Soul, Spirit',
      kabbalistic: 'The divine spark of consciousness within being',
      category: 'word'
    },
    { 
      word: 'אמת', 
      letters: ['א', 'מ', 'ת'], 
      pronunciation: 'Emet', 
      french: 'Vérité',
      meaning: 'Truth, Reality',
      kabbalistic: 'Absolute truth; the fundamental reality underlying all manifestation',
      category: 'word'
    },
    { 
      word: 'תורה', 
      letters: ['ת', 'ו', 'ר', 'ה'], 
      pronunciation: 'Torah', 
      french: 'Torah, Enseignement',
      meaning: 'Law, Teaching, Instruction',
      kabbalistic: 'Divine law and wisdom; blueprint of creation',
      category: 'word'
    },
    { 
      word: 'סוד', 
      letters: ['ס', 'ו', 'ד'], 
      pronunciation: 'Sod', 
      french: 'Secret, Mystère',
      meaning: 'Secret, Mystery',
      kabbalistic: 'Hidden wisdom; secrets of the universe revealed through meditation',
      category: 'word'
    }
  ];

  // ============================================================================
  // GEMATRIA CALCULATOR
  // ============================================================================

  const calculateGematria = (hebrewWord) => {
    let total = 0;
    const breakdown = [];

    for (const char of hebrewWord) {
      const letterData = hebrewLetters.find(l => l.char === char);
      if (letterData) {
        total += letterData.value;
        breakdown.push({
          char,
          name: letterData.name,
          value: letterData.value
        });
      }
    }

    // Interpretations based on total
    const interpretations = {
      1: 'Unity, Beginning',
      10: 'Completion, Perfection',
      11: 'Duality in Unity',
      26: 'YHVH - Divine Name',
      32: 'The Paths of Wisdom',
      50: 'Jubilee, Liberation',
      72: 'The Divine Name (Shem HaMeforash)',
      100: 'Eternal Consciousness',
      123: 'Balance and Order',
      200: 'Redemption',
      300: 'Divine Fire',
      400: 'Completion and Sealing'
    };

    const interpretation = interpretations[total] || `Unique frequency: ${total}`;

    return {
      total,
      breakdown,
      interpretation
    };
  };

  // ============================================================================
  // SEARCH & TRANSLATION
  // ============================================================================

  const handleSearch = (input) => {
    setSearchInput(input);

    if (!input.trim()) {
      setSearchResults([]);
      return;
    }

    // Search in both French and Hebrew
    const results = hebrewWords.filter(w => {
      const matchesFrench = w.french.toLowerCase().includes(input.toLowerCase());
      const matchesHebrew = w.word.includes(input);
      const matchesMeaning = w.meaning.toLowerCase().includes(input.toLowerCase());
      return matchesFrench || matchesHebrew || matchesMeaning;
    });

    // Calculate gematria for each result
    const enrichedResults = results.map(word => ({
      ...word,
      gematria: calculateGematria(word.word)
    }));

    setSearchResults(enrichedResults);
  };

  // ============================================================================
  // VOICE DETECTION (Same as v2)
  // ============================================================================

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawCymatic = () => {
      ctx.fillStyle = 'rgba(10, 20, 40, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, 'rgba(0, 200, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 50, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const freqArray = new Float32Array(frequencies.length);
      frequencies.forEach((freq, i) => {
        freqArray[i] = freq / 255;
      });

      ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)';
      ctx.lineWidth = 1;

      for (let i = 0; i < 6; i++) {
        const radius = 20 + i * 40 + Math.sin(Date.now() / 1000 + i) * 15;
        const modulation = freqArray[i % 22] * 30;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + modulation, 0, Math.PI * 2);
        ctx.stroke();
      }

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
      alert('Please allow microphone access');
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !isListening) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

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

    if (newDetected.length > 0) {
      const result = calculatePermutations(newDetected);
      setPermutations(result.permutations);
      setDetectedWords(result.words);
    }

    requestAnimationFrame(analyzeAudio);
  };

  const calculatePermutations = (letters) => {
    if (letters.length < 2) return { permutations: [], words: [] };

    const matchedWords = hebrewWords.filter(w => {
      return w.letters.every(l => letters.some(dl => dl.letter === l));
    });

    const weightedMatches = matchedWords.map(w => ({
      ...w,
      gematria: calculateGematria(w.word),
      matchStrength: w.letters.reduce((sum, l) => {
        const detected = letters.find(dl => dl.letter === l);
        return sum + (detected ? detected.intensity : 0);
      }, 0) / w.letters.length
    })).sort((a, b) => b.matchStrength - a.matchStrength);

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
      setDetectedWords([]);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 border-b border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm p-6">
        <h1 className="text-4xl font-light tracking-widest mb-2">TSEROUF</h1>
        <p className="text-cyan-400 text-sm tracking-wide">Hebrew • Gematria • Personal Meaning</p>
      </div>

      {/* Canvas (Voice tab only) */}
      {activeTab === 'voice' && (
        <div className="absolute inset-0 pt-24">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      )}

      {/* Tab buttons */}
      <div className="absolute top-24 left-0 right-0 z-20 flex gap-4 px-6">
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-6 py-2 rounded-lg font-semibold tracking-wide transition-all ${
            activeTab === 'voice'
              ? 'bg-cyan-600/40 border-2 border-cyan-500 text-cyan-300'
              : 'bg-slate-700/20 border-2 border-slate-600 text-slate-400 hover:border-cyan-500/50'
          }`}
        >
          <Mic size={16} className="inline mr-2" /> Voice Detection
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-2 rounded-lg font-semibold tracking-wide transition-all ${
            activeTab === 'search'
              ? 'bg-purple-600/40 border-2 border-purple-500 text-purple-300'
              : 'bg-slate-700/20 border-2 border-slate-600 text-slate-400 hover:border-purple-500/50'
          }`}
        >
          <Search size={16} className="inline mr-2" /> Search Words & Names
        </button>
      </div>

      {/* VOICE TAB */}
      {activeTab === 'voice' && (
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-cyan-500/30 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur-md p-6 max-h-[60%] overflow-y-auto">
          <div className="max-w-6xl mx-auto">
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

            {detectedLetters.length > 0 && (
              <div className="mb-6 bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-cyan-500/20">
                <p className="text-xs text-cyan-400 uppercase tracking-widest mb-3">Detected Letters</p>
                <div className="flex flex-wrap gap-3">
                  {detectedLetters.map((letter, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 rounded px-4 py-2">
                      <p className="text-2xl font-light">{letter.letter}</p>
                      <p className="text-xs text-cyan-300">{letter.name}</p>
                      <p className="text-xs text-cyan-500 mt-1">{letter.intensity}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detectedWords.length > 0 && (
              <div className="mb-6 bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-purple-500/20">
                <p className="text-xs text-purple-400 uppercase tracking-widest mb-3">Detected Words</p>
                <div className="space-y-4">
                  {detectedWords.map((wordData, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-lg p-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <p className="text-3xl font-light text-purple-300">{wordData.word}</p>
                          <p className="text-sm text-purple-400 italic">{wordData.pronunciation}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-purple-400 text-xs uppercase">Resonance</p>
                          <p className="text-2xl font-semibold text-purple-300">{Math.round(wordData.matchStrength)}%</p>
                        </div>
                      </div>
                      
                      <div className="mb-3 pt-3 border-t border-purple-500/20">
                        <p className="text-sm font-semibold text-purple-300 mb-1">Meaning:</p>
                        <p className="text-sm text-purple-200">{wordData.meaning}</p>
                      </div>

                      <div className="bg-slate-900/50 rounded p-3 border border-purple-400/20 mb-3">
                        <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Kabbalistic</p>
                        <p className="text-sm text-purple-100 leading-relaxed">{wordData.kabbalistic}</p>
                      </div>

                      {wordData.gematria && (
                        <div className="bg-slate-900/50 rounded p-3 border border-yellow-400/20">
                          <p className="text-xs text-yellow-400 uppercase tracking-widest mb-2">Gematria (Numerical Value)</p>
                          <p className="text-lg font-semibold text-yellow-300 mb-2">{wordData.gematria.total}</p>
                          <p className="text-xs text-yellow-200">{wordData.gematria.interpretation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH TAB */}
      {activeTab === 'search' && (
        <div className="absolute inset-0 pt-32 overflow-y-auto bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/40">
          <div className="max-w-4xl mx-auto px-6 pb-10">
            {/* Search Input */}
            <div className="mb-8 sticky top-32 z-10">
              <input
                type="text"
                placeholder="Search: prenom, nom, word (French or Hebrew)..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-slate-800/60 border-2 border-purple-500/50 rounded-lg px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((word, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/50 rounded-lg p-6 backdrop-blur">
                    {/* Header */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <p className="text-4xl font-light text-purple-300 mb-1">{word.word}</p>
                        <p className="text-lg text-purple-400">{word.pronunciation}</p>
                        {word.french && <p className="text-sm text-purple-300 mt-1">French: <span className="font-semibold">{word.french}</span></p>}
                      </div>
                      <div className="text-right bg-purple-600/30 px-4 py-2 rounded">
                        <p className="text-xs text-purple-300 uppercase">Category</p>
                        <p className="text-sm font-semibold text-purple-200 capitalize">{word.category}</p>
                      </div>
                    </div>

                    {/* Meanings */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-800/40 rounded p-4 border border-purple-400/30">
                        <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Literal Meaning</p>
                        <p className="text-sm text-purple-100">{word.meaning}</p>
                      </div>
                      <div className="bg-slate-800/40 rounded p-4 border border-purple-400/30">
                        <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Letters</p>
                        <div className="flex flex-wrap gap-2">
                          {word.letters.map((letter, lidx) => (
                            <span key={lidx} className="text-sm bg-purple-600/30 border border-purple-400/30 rounded px-2 py-1 text-purple-300">
                              {letter}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Kabbalistic */}
                    <div className="bg-slate-900/60 rounded p-4 border border-purple-400/20 mb-4">
                      <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">Kabbalistic Significance</p>
                      <p className="text-sm text-purple-100 leading-relaxed">{word.kabbalistic}</p>
                    </div>

                    {/* Gematria */}
                    {word.gematria && (
                      <div className="bg-slate-900/60 rounded p-4 border border-yellow-500/30">
                        <p className="text-xs text-yellow-400 uppercase tracking-widest mb-3">Gematria • Numerical Analysis</p>
                        
                        <div className="mb-4">
                          <p className="text-3xl font-semibold text-yellow-300 mb-1">{word.gematria.total}</p>
                          <p className="text-sm text-yellow-200 italic">{word.gematria.interpretation}</p>
                        </div>

                        <div className="bg-slate-800/40 rounded p-3">
                          <p className="text-xs text-yellow-400 mb-2 uppercase">Letter Breakdown</p>
                          <div className="space-y-1">
                            {word.gematria.breakdown.map((item, bidx) => (
                              <div key={bidx} className="flex justify-between text-xs text-yellow-200">
                                <span>{item.char} ({item.name})</span>
                                <span className="font-semibold">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : searchInput ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No results found for "{searchInput}"</p>
                <p className="text-slate-500 text-sm mt-2">Try searching for common names or Hebrew words</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-purple-400/30 mb-4" />
                <p className="text-slate-400">Search for your name, a word, or enter Hebrew text</p>
                <p className="text-slate-500 text-sm mt-2">Discover literal, mystical, and numerical meanings</p>
              </div>
            )}
          </div>
        </div>
      )}

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

export default TseroufDetectorV3;
