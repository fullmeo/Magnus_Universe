import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, ZoomIn, Info, X } from 'lucide-react';

const TseroufSephirothV4 = () => {
  const [activeTab, setActiveTab] = useState('tree');
  const [searchInput, setSearchInput] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [journeyPath, setJourneyPath] = useState([]);
  const [selectedSephirah, setSelectedSephirah] = useState(null);
  const [journeyNarrative, setJourneyNarrative] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // ============================================================================
  // SEPHIROTH DATABASE
  // ============================================================================

  const sephirothDatabase = [
    {
      id: 1,
      name: 'Keter',
      hebrew: 'כתר',
      meaning: 'Crown',
      position: { x: 0.5, y: 0.05 },
      color: '#FFFFFF',
      planetary: 'The Absolute',
      archangel: 'Metatron',
      description: 'The infinite source, beyond comprehension. The unity from which all emerges. Pure potential.',
      divineAspect: 'The Supreme Being',
      experience: 'Transcendence, cosmic consciousness',
      sphere: 'The boundless light'
    },
    {
      id: 2,
      name: 'Chokmah',
      hebrew: 'חכמה',
      meaning: 'Wisdom',
      position: { x: 0.25, y: 0.2 },
      color: '#0099FF',
      planetary: 'Uranus',
      archangel: 'Ratziel',
      description: 'The first emanation. Pure will, masculine creative force. The flash of insight.',
      divineAspect: 'The Supernal Father',
      experience: 'Creative will, primordial force',
      sphere: 'The first light'
    },
    {
      id: 3,
      name: 'Binah',
      hebrew: 'בינה',
      meaning: 'Understanding',
      position: { x: 0.75, y: 0.2 },
      color: '#FF00FF',
      planetary: 'Saturn',
      archangel: 'Tzaphkiel',
      description: 'Reception of Chokmah\'s force. Feminine creative power. The great mother.',
      divineAspect: 'The Supernal Mother',
      experience: 'Form-giving, manifestation',
      sphere: 'The primordial sea'
    },
    {
      id: 4,
      name: 'Chesed',
      hebrew: 'חסד',
      meaning: 'Mercy',
      position: { x: 0.25, y: 0.4 },
      color: '#0000FF',
      planetary: 'Jupiter',
      archangel: 'Tzadkiel',
      description: 'Expansion, mercy, and benevolence. Structural principle. Kingship and authority.',
      divineAspect: 'The King',
      experience: 'Grace, expansion, joy',
      sphere: 'The giver'
    },
    {
      id: 5,
      name: 'Gevurah',
      hebrew: 'גבורה',
      meaning: 'Severity',
      position: { x: 0.75, y: 0.4 },
      color: '#FF0000',
      planetary: 'Mars',
      archangel: 'Khamael',
      description: 'Contraction, discipline, strength. Warrior consciousness. Destruction and renewal.',
      divineAspect: 'The Mighty God',
      experience: 'Strength, courage, conflict',
      sphere: 'The restricter'
    },
    {
      id: 6,
      name: 'Tiphereth',
      hebrew: 'תפארת',
      meaning: 'Beauty',
      position: { x: 0.5, y: 0.55 },
      color: '#FFFF00',
      planetary: 'The Sun',
      archangel: 'Michael',
      description: 'The center, the heart, the self. Harmonious integration of all forces. Enlightenment.',
      divineAspect: 'The Child',
      experience: 'Self-realization, wholeness',
      sphere: 'The mediator'
    },
    {
      id: 7,
      name: 'Yesod',
      hebrew: 'יסוד',
      meaning: 'Foundation',
      position: { x: 0.5, y: 0.75 },
      color: '#9900FF',
      planetary: 'The Moon',
      archangel: 'Gabriel',
      description: 'Subconscious, imagination, dreams. The gateway to manifestation. Reflection.',
      divineAspect: 'The Dreamer',
      experience: 'Intuition, dreamwork, mystery',
      sphere: 'The mirror'
    },
    {
      id: 8,
      name: 'Hod',
      hebrew: 'הוד',
      meaning: 'Splendor',
      position: { x: 0.25, y: 0.85 },
      color: '#FF8800',
      planetary: 'Mercury',
      archangel: 'Raphael',
      description: 'Intellect, reason, communication. Logic and dexterity. Language and writing.',
      divineAspect: 'The Divine Child',
      experience: 'Intelligence, wit, analysis',
      sphere: 'The speaker'
    },
    {
      id: 9,
      name: 'Netzach',
      hebrew: 'נצח',
      meaning: 'Eternity',
      position: { x: 0.75, y: 0.85 },
      color: '#00CC00',
      planetary: 'Venus',
      archangel: 'Haniel',
      description: 'Emotion, art, beauty, passion. Drive and desire. Creative expression.',
      divineAspect: 'The Goddess',
      experience: 'Emotion, sensuality, beauty',
      sphere: 'The artist'
    },
    {
      id: 10,
      name: 'Malkuth',
      hebrew: 'מלכות',
      meaning: 'Kingdom',
      position: { x: 0.5, y: 0.95 },
      color: '#00FF00',
      planetary: 'Earth',
      archangel: 'Sandalphon',
      description: 'The material world, manifestation, physicality. Where all divine forces crystallize.',
      divineAspect: 'The Kingdom',
      experience: 'Grounding, manifestation, presence',
      sphere: 'The manifest world'
    }
  ];

  // ============================================================================
  // PATH DATABASE (22 Hebrew Letters = 22 Paths)
  // ============================================================================

  const pathDatabase = [
    { letter: 'א', name: 'Aleph', path: 11, connects: [1, 2], meaning: 'The Magician', element: 'Air', tarot: 0 },
    { letter: 'ב', name: 'Bet', path: 12, connects: [2, 3], meaning: 'The Priestess', element: 'Water', tarot: 1 },
    { letter: 'ג', name: 'Gimel', path: 13, connects: [2, 6], meaning: 'The Empress', element: 'Water', tarot: 2 },
    { letter: 'ד', name: 'Dalet', path: 14, connects: [3, 6], meaning: 'The Emperor', element: 'Fire', tarot: 3 },
    { letter: 'ה', name: 'He', path: 15, connects: [3, 5], meaning: 'The Hierophant', element: 'Earth', tarot: 4 },
    { letter: 'ו', name: 'Vav', path: 16, connects: [4, 5], meaning: 'The Lovers', element: 'Air', tarot: 5 },
    { letter: 'ז', name: 'Zayin', path: 17, connects: [4, 6], meaning: 'The Chariot', element: 'Water', tarot: 6 },
    { letter: 'ח', name: 'Het', path: 18, connects: [5, 6], meaning: 'Strength', element: 'Fire', tarot: 7 },
    { letter: 'ט', name: 'Tet', path: 19, connects: [6, 7], meaning: 'The Hermit', element: 'Earth', tarot: 8 },
    { letter: 'י', name: 'Yod', path: 20, connects: [4, 7], meaning: 'Wheel of Fortune', element: 'Fire', tarot: 9 },
    { letter: 'כ', name: 'Kaf', path: 21, connects: [5, 7], meaning: 'Justice', element: 'Air', tarot: 10 },
    { letter: 'ל', name: 'Lamed', path: 22, connects: [6, 7], meaning: 'The Hanged Man', element: 'Water', tarot: 11 },
    { letter: 'מ', name: 'Mem', path: 23, connects: [7, 8], meaning: 'Death', element: 'Water', tarot: 12 },
    { letter: 'נ', name: 'Nun', path: 24, connects: [7, 9], meaning: 'Temperance', element: 'Fire', tarot: 13 },
    { letter: 'ס', name: 'Samekh', path: 25, connects: [8, 9], meaning: 'The Devil', element: 'Earth', tarot: 14 },
    { letter: 'ע', name: 'Ayin', path: 26, connects: [6, 8], meaning: 'The Tower', element: 'Fire', tarot: 15 },
    { letter: 'פ', name: 'Pe', path: 27, connects: [8, 10], meaning: 'The Star', element: 'Fire', tarot: 16 },
    { letter: 'צ', name: 'Tsade', path: 28, connects: [9, 10], meaning: 'The Moon', element: 'Water', tarot: 17 },
    { letter: 'ק', name: 'Qoph', path: 29, connects: [5, 8], meaning: 'The Sun', element: 'Fire', tarot: 18 },
    { letter: 'ר', name: 'Resh', path: 30, connects: [9, 10], meaning: 'Judgement', element: 'Fire', tarot: 19 },
    { letter: 'ש', name: 'Shin', path: 31, connects: [7, 10], meaning: 'The World', element: 'Fire', tarot: 20 },
    { letter: 'ת', name: 'Tav', path: 32, connects: [6, 10], meaning: 'Void', element: 'Earth', tarot: 21 }
  ];

  // ============================================================================
  // JOURNEY ALGORITHM
  // ============================================================================

  const traceNameJourney = (name) => {
    if (!name.trim()) {
      setJourneyPath([]);
      setJourneyNarrative('');
      return;
    }

    const hebrewName = convertToHebrew(name);
    const paths = [];
    const sephirothVisited = new Set();

    // Trace through each letter
    for (const letter of hebrewName) {
      const pathData = pathDatabase.find(p => p.letter === letter);
      if (pathData) {
        paths.push(pathData);
        sephirothVisited.add(pathData.connects[0]);
        sephirothVisited.add(pathData.connects[1]);
      }
    }

    setJourneyPath(paths);

    // Generate narrative
    const narrative = generateJourneyNarrative(paths, Array.from(sephirothVisited));
    setJourneyNarrative(narrative);
  };

  const convertToHebrew = (frenchText) => {
    // Simple mapping for common French names to Hebrew
    const nameMapping = {
      'david': 'דוד',
      'sarah': 'שרה',
      'rachel': 'רחל',
      'joseph': 'יוסף',
      'marie': 'מרים',
      'paul': 'פול',
      'pierre': 'פטר',
      'jean': 'ז׳אן',
      'sophie': 'סופיה',
      'jean-luc': 'ז׳אן-לוק',
    };

    const lower = frenchText.toLowerCase().trim();
    if (nameMapping[lower]) {
      return nameMapping[lower];
    }

    // If Hebrew input detected, return as-is
    if (/[\u0590-\u05FF]/.test(frenchText)) {
      return frenchText;
    }

    // Transliterate - simple approach
    return frenchText;
  };

  const generateJourneyNarrative = (paths, sephirothIds) => {
    if (paths.length === 0) return '';

    const sephDetails = sephirothIds
      .map(id => sephirothDatabase.find(s => s.id === id))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);

    let narrative = `<div class="space-y-4">`;

    // Journey start
    narrative += `<p><strong>Your Spiritual Journey:</strong></p>`;
    narrative += `<p class="text-sm">This name traces a path through the Tree of Life across ${paths.length} sacred letters:</p>`;

    // Path description
    narrative += `<ul class="space-y-2 text-sm">`;
    paths.forEach((path, idx) => {
      const source = sephirothDatabase.find(s => s.id === path.connects[0]);
      const dest = sephirothDatabase.find(s => s.id === path.connects[1]);
      narrative += `<li><strong>${path.letter} (${path.name})</strong>: ${source.name} → ${dest.name}<br/>
        <span class="text-xs opacity-70">${path.meaning}: ${path.tarot}</span></li>`;
    });
    narrative += `</ul>`;

    // Sephiroth visited
    narrative += `<p class="text-sm mt-4"><strong>Spheres Touched:</strong></p>`;
    narrative += `<ul class="space-y-1 text-xs">`;
    sephDetails.forEach(seph => {
      narrative += `<li><strong>${seph.hebrew} ${seph.name}</strong> — ${seph.meaning}<br/>
        <span class="opacity-60">${seph.divineAspect}</span></li>`;
    });
    narrative += `</ul>`;

    // Spiritual interpretation
    const lowestSeph = sephDetails[0];
    const highestSeph = sephDetails[sephDetails.length - 1];
    narrative += `<p class="text-sm mt-4"><strong>Journey Meaning:</strong></p>`;
    narrative += `<p class="text-sm opacity-80">Your path begins in <strong>${lowestSeph.name}</strong> (${lowestSeph.experience}) 
      and ascends toward <strong>${highestSeph.name}</strong> (${highestSeph.experience}). 
      This journey represents your spiritual evolution through ${sephDetails.length} domains of consciousness.</p>`;

    narrative += `</div>`;
    return narrative;
  };

  // ============================================================================
  // SOCIAL SHARING FUNCTIONS
  // ============================================================================

  const generateShareText = () => {
    if (!selectedName || journeyPath.length === 0) return '';
    
    const sephDetails = new Set();
    journeyPath.forEach(path => {
      sephDetails.add(path.connects[0]);
      sephDetails.add(path.connects[1]);
    });

    const lowestSeph = sephirothDatabase.find(s => s.id === Math.min(...Array.from(sephDetails)));
    const highestSeph = sephirothDatabase.find(s => s.id === Math.max(...Array.from(sephDetails)));

    return `Découvrez votre chemin spirituel sur l'Arbre de Vie! 🌳✨

Mon nom "${selectedName}" trace un voyage à travers ${journeyPath.length} lettres sacrées.

Je commence à ${lowestSeph.name} et j'aspire à ${highestSeph.name}.

Tracez votre propre chemin: `;
  };

  const encodeJourneyUrl = () => {
    if (!selectedName) return '';
    const encoded = btoa(JSON.stringify({
      name: selectedName,
      paths: journeyPath.map(p => p.letter).join(''),
      timestamp: Date.now()
    }));
    return `${window.location.href}?journey=${encoded}`;
  };

  const shareOnTwitter = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=Tserouf,Sephiroth,Kabbalah,TreeOfLife`;
    window.open(url, 'twitter-share', 'width=550,height=420');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, 'facebook-share', 'width=550,height=420');
  };

  const shareOnLinkedIn = () => {
    const text = generateShareText();
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, 'linkedin-share', 'width=550,height=420');
  };

  const shareOnWhatsApp = () => {
    const text = generateShareText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, 'whatsapp-share');
  };

  const copyShareLink = () => {
    const shareText = generateShareText() + '\n\n' + encodeJourneyUrl();
    navigator.clipboard.writeText(shareText).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  const downloadAsImage = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `tserouf-journey-${selectedName || 'tree'}.png`;
    link.click();
  };

  // ============================================================================
  // CANVAS RENDERING - TREE OF LIFE
  // ============================================================================

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawTree = () => {
      // Background
      ctx.fillStyle = '#0a1428';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, 'rgba(0, 100, 200, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 20, 60, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw paths first (so they appear behind spheres)
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 2;

      pathDatabase.forEach(path => {
        const source = sephirothDatabase.find(s => s.id === path.connects[0]);
        const dest = sephirothDatabase.find(s => s.id === path.connects[1]);

        if (source && dest) {
          const x1 = source.position.x * canvas.width;
          const y1 = source.position.y * canvas.height;
          const x2 = dest.position.x * canvas.width;
          const y2 = dest.position.y * canvas.height;

          // Highlight journey paths
          const isInJourney = journeyPath.find(p => p.letter === path.letter);
          if (isInJourney) {
            ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
            ctx.lineWidth = 4;
          } else {
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
            ctx.lineWidth = 2;
          }

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Letter label on path
          if (isInJourney) {
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            ctx.fillStyle = 'rgba(255, 200, 0, 0.9)';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(path.letter, midX, midY);
          }
        }
      });

      // Draw Sephiroth (spheres)
      sephirothDatabase.forEach(seph => {
        const x = seph.position.x * canvas.width;
        const y = seph.position.y * canvas.height;
        const radius = seph.id === 6 ? 35 : 30; // Tiphereth is larger

        // Glow effect for journey sephiroth
        const isInJourney = journeyPath.some(p =>
          p.connects.includes(seph.id)
        );

        if (isInJourney) {
          ctx.fillStyle = seph.color.replace(')', ', 0.3)').replace('rgb', 'rgba');
          ctx.beginPath();
          ctx.arc(x, y, radius + 15, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sphere
        const sphereGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
        sphereGradient.addColorStop(0, seph.color);
        sphereGradient.addColorStop(1, adjustColor(seph.color, -30));
        ctx.fillStyle = sphereGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border
        ctx.strokeStyle = isInJourney ? '#FFFF00' : seph.color;
        ctx.lineWidth = isInJourney ? 3 : 2;
        ctx.stroke();

        // Hebrew letter
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(seph.hebrew, x, y);

        // Number
        ctx.fillStyle = seph.color;
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(seph.id, x, y + radius + 8);
      });

      animationRef.current = requestAnimationFrame(drawTree);
    };

    drawTree();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [journeyPath]);

  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 border-b border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm p-6">
        <h1 className="text-4xl font-light tracking-widest mb-2">TSEROUF • SEPHIROTH</h1>
        <p className="text-cyan-400 text-sm tracking-wide">Tree of Life Journey • Name Path Analysis</p>
      </div>

      {/* Canvas */}
      <div className="absolute inset-0 pt-24">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Search Panel */}
      <div className="absolute top-28 left-0 right-0 z-20 flex justify-center px-6">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Enter name (French or Hebrew)..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              traceNameJourney(e.target.value);
              setSelectedName(e.target.value);
            }}
            className="w-full bg-slate-800/60 border-2 border-purple-500/50 rounded-lg px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-center"
          />
        </div>
      </div>

      {/* Left Panel - Path Details */}
      {journeyPath.length > 0 && (
        <div className="absolute left-0 top-48 bottom-0 w-80 bg-slate-900/80 backdrop-blur border-r border-purple-500/30 overflow-y-auto z-20 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Journey Paths</h3>
          <div className="space-y-3">
            {journeyPath.map((path, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-purple-500/40 rounded-lg p-3">
                <p className="text-xl font-semibold text-purple-300">{path.letter}</p>
                <p className="text-sm text-purple-400">{path.name}</p>
                <p className="text-xs text-purple-200 mt-1">{path.meaning}</p>
                <p className="text-xs text-purple-300/60 mt-2">
                  Path {path.path}: {sephirothDatabase.find(s => s.id === path.connects[0])?.name} 
                  → {sephirothDatabase.find(s => s.id === path.connects[1])?.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Panel - Journey Narrative */}
      {journeyNarrative && (
        <div className="absolute right-0 top-48 bottom-0 w-96 bg-slate-900/80 backdrop-blur border-l border-cyan-500/30 overflow-y-auto z-20 p-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">Spiritual Journey</h3>
          <div 
            className="text-sm text-slate-200 space-y-3"
            dangerouslySetInnerHTML={{ __html: journeyNarrative }}
          />
        </div>
      )}

      {/* Sephiroth Detail Modal */}
      {selectedSephirah && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-lg max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-4xl font-light text-cyan-300">{selectedSephirah.hebrew}</p>
                <h2 className="text-3xl font-semibold text-cyan-400 mt-2">{selectedSephirah.name}</h2>
                <p className="text-purple-300 mt-1">{selectedSephirah.meaning}</p>
              </div>
              <button
                onClick={() => setSelectedSephirah(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mt-6 border-t border-cyan-500/30 pt-4">
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Divine Aspect</p>
                <p className="text-sm text-cyan-200 mt-1">{selectedSephirah.divineAspect}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Archangel</p>
                <p className="text-sm text-cyan-200 mt-1">{selectedSephirah.archangel}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Planetary Correspondence</p>
                <p className="text-sm text-cyan-200 mt-1">{selectedSephirah.planetary}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Experience</p>
                <p className="text-sm text-cyan-200 mt-1">{selectedSephirah.experience}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Description</p>
                <p className="text-sm text-cyan-200 mt-1">{selectedSephirah.description}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 uppercase tracking-widest">Spiritual Sphere</p>
                <p className="text-sm text-cyan-200 italic mt-1">{selectedSephirah.sphere}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedName && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur p-6 text-center">
          <p className="text-cyan-300">Enter a name above to trace its journey through the Tree of Life</p>
          <p className="text-slate-400 text-sm mt-1">Click any sphere to learn more</p>
        </div>
      )}

      {/* Share Panel */}
      {selectedName && journeyPath.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-900/95 via-slate-900/90 to-transparent backdrop-blur border-t border-purple-500/30 p-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold tracking-wide transition-all flex items-center gap-2 mb-4"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM3 14s1 1 6 1 6-1 6-1V9a1 1 0 00-1-1H4a1 1 0 00-1 1v5zM17.6 7.2a.75.75 0 00-1.318.375l-1.378 6.066a.75.75 0 001.414.408l1.378-6.066a.75.75 0 00-.096-.783z" />
              </svg>
              Share Your Journey ({journeyPath.length} paths)
            </button>

            {showShareMenu && (
              <div className="bg-slate-800/80 backdrop-blur rounded-lg p-6 border border-purple-500/30 space-y-4">
                {/* Share Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <button
                    onClick={shareOnTwitter}
                    className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    title="Share on Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>

                  <button
                    onClick={shareOnFacebook}
                    className="bg-blue-700 hover:bg-blue-600 p-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    title="Share on Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={shareOnLinkedIn}
                    className="bg-blue-800 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                    </svg>
                    LinkedIn
                  </button>

                  <button
                    onClick={shareOnWhatsApp}
                    className="bg-green-600 hover:bg-green-500 p-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.116-4.917 5.505-4.917 8.987 0 1.52.287 2.986.842 4.385L1.6 23.4l4.867-1.282c1.312.736 2.786 1.128 4.26 1.129h4.262c4.699 0 8.5-3.801 8.5-8.5 0-2.262-.862-4.391-2.427-6-1.567-1.61-3.662-2.495-5.911-2.495" />
                    </svg>
                    WhatsApp
                  </button>

                  <button
                    onClick={downloadAsImage}
                    className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    title="Download as image"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Image
                  </button>
                </div>

                {/* Copy Link */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <button
                    onClick={copyShareLink}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                      copyFeedback
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {copyFeedback ? '✓ Copied to clipboard!' : 'Copy link & text'}
                  </button>
                </div>

                {/* Share Preview */}
                <div className="mt-4 pt-4 border-t border-slate-700 bg-slate-900/60 rounded p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Preview</p>
                  <p className="text-sm text-slate-200 line-clamp-3">{generateShareText()}</p>
                </div>
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
        
        h1, h2 {
          font-family: 'Space Mono', monospace;
        }
      `}</style>
    </div>
  );
};

export default TseroufSephirothV4;
