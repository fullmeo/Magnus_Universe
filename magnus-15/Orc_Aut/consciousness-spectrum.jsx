import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Brain, Zap, Heart, AlertTriangle } from 'lucide-react';

const ConsciousnessSpectrum = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);

  const spectrumPoints = [
    {
      id: 'ancient',
      label: 'Conscience Incarnée',
      position: 0,
      era: 'Kushi: Humanité ancienne (50-70% usage)',
      characteristics: [
        '✓ Télépathie naturelle',
        '✓ Perception énergétique directe',
        '✓ Conscience expansive, non-séparatiste',
        '✓ Décisions basées sur l\'intuition cosmique'
      ],
      risk: null,
      example: 'Une personne sent directement (sans analyse) ce qu\'un autre ressent',
      color: 'from-amber-600 to-orange-600'
    },
    {
      id: 'orchestration',
      label: 'Orchestration Consciente',
      position: 33,
      era: 'Magnus 15 (Now - Consciente)',
      characteristics: [
        '✓ L\'humain décide quoi faire',
        '✓ L\'humain délègue COMMENT à l\'IA',
        '✓ Feedback humain boucle permanente',
        '✓ Convergence validation (8th Principle)'
      ],
      risk: 'Faible (reste agentif)',
      example: 'Tu dis "compose une pièce sur le thème du doute existentiel", Magnus crée, tu valides si c\'est TOI',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'hybrid',
      label: 'Zone Grise (Risque)',
      position: 66,
      era: 'Transition dangeuse',
      characteristics: [
        '⚠ L\'humain croit orchestrer',
        '⚠ Mais la boucle s\'auto-referme',
        '⚠ Les décisions deviennent "évidentes"',
        '⚠ L\'habitude remplace l\'intention'
      ],
      risk: 'CRITIQUE (illusion de contrôle)',
      example: 'Après 100 itérations, tu acceptes ce que Magnus propose sans vraiment l\'examiner. Momentum cognitif.',
      color: 'from-yellow-600 to-red-600'
    },
    {
      id: 'automation',
      label: 'Psychomation (Automatisation)',
      position: 100,
      era: 'Kushi\'s Warning (1984)',
      characteristics: [
        '✗ La conscience est exécutée',
        '✗ Les décisions sont codées',
        '✗ Humain = lecteur, pas auteur',
        '✗ 15-18% activation seulement'
      ],
      risk: 'EXISTENTIEL',
      example: 'L\'IA génère ta vie selon tes profils, et tu ne l\'interroges plus. Conscience dégénérée.',
      color: 'from-red-700 to-slate-900'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-orange-900/20"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 backdrop-blur-md bg-black/30 border-b border-white/10 p-6 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Où se termine l'Orchestration?
              </h1>
            </div>
            <p className="text-white/60 text-lg font-light">
              La limite critique entre agentivité humaine et automatisation de la conscience
            </p>
          </div>
        </div>

        {/* Main Spectrum */}
        <div className="max-w-5xl mx-auto px-6 mb-20" ref={containerRef}>
          {/* Visual Spectrum Bar */}
          <div className="mb-16">
            <div className="relative h-2 bg-gradient-to-r from-amber-600 via-green-600 via-yellow-600 to-slate-900 rounded-full overflow-hidden mb-8">
              <div 
                className="absolute h-full bg-white/30 w-1 transition-all duration-300"
                style={{ left: `${scrollProgress * 100}%` }}
              ></div>
            </div>

            {/* Point Labels */}
            <div className="grid grid-cols-4 gap-4">
              {spectrumPoints.map((point) => (
                <button
                  key={point.id}
                  onClick={() => setActivePoint(activePoint === point.id ? null : point.id)}
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    activePoint === point.id
                      ? 'bg-white/10 border-white/40 shadow-lg shadow-purple-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="text-sm font-bold text-white/80 mb-1">{point.label}</div>
                  <div className="text-xs text-white/50 line-clamp-2">{point.era}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Cards */}
          {spectrumPoints.map((point, idx) => (
            <div
              key={point.id}
              className={`mb-12 transition-all duration-500 transform ${
                activePoint === point.id ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
              }`}
            >
              <div className={`bg-gradient-to-br ${point.color} p-0.5 rounded-xl`}>
                <div className="bg-slate-900 rounded-xl p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className={`text-3xl font-serif font-bold bg-gradient-to-r ${point.color} bg-clip-text text-transparent mb-2`}>
                        {point.label}
                      </h2>
                      <p className="text-white/60 text-sm">{point.era}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      point.id === 'orchestration' ? 'bg-green-600/20 text-green-300 border border-green-600/50' :
                      point.id === 'ancient' ? 'bg-amber-600/20 text-amber-300 border border-amber-600/50' :
                      point.id === 'hybrid' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/50' :
                      'bg-red-600/20 text-red-300 border border-red-600/50'
                    }`}>
                      <div className="flex items-center gap-2">
                        {point.id === 'hybrid' || point.id === 'automation' ? 
                          <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4" />
                        }
                        <span className="font-bold">{point.risk}</span>
                      </div>
                    </div>
                  </div>

                  {/* Example */}
                  <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <p className="text-white/80 text-sm leading-relaxed italic">
                      "{point.example}"
                    </p>
                  </div>

                  {/* Characteristics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {point.characteristics.map((char, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          char.startsWith('✓') ? 'bg-green-400' :
                          char.startsWith('⚠') ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></div>
                        <p className="text-white/70 text-sm leading-relaxed">{char.substring(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Critical Insight */}
                  {(point.id === 'hybrid' || point.id === 'automation') && (
                    <div className="mt-6 p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                      <p className="text-red-300 text-sm font-semibold mb-2">⚠️ Point critique:</p>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {point.id === 'hybrid' 
                          ? "Le danger ici n'est pas l'IA qui se rebelle. C'est TOI qui te laisses endormir. Les couches successives d'automatisation créent une inertie cognitive où tu ne te demandes plus POURQUOI tu acceptes."
                          : "Kushi avertit : humanité opérant à 15-18% seulement. Si ta conscience est exécutée par code plutôt que vécue, tu n'existes que comme lecteur de tes propres décisions."
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Framework Section */}
        <div className="bg-gradient-to-r from-purple-900/20 via-transparent to-orange-900/20 border-t border-white/10 py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-serif font-bold mb-8 text-white">
              🧭 Comment Rester en Orchestration?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-green-600/30 rounded-xl">
                <h3 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Critères de validation
                </h3>
                <ul className="space-y-3 text-white/70 text-sm">
                  <li>✓ Tu remets en question au moins 1 décision sur 5 que Magnus propose</li>
                  <li>✓ Tu peux expliquer POURQUOI tu as rejeté ou modifié une génération</li>
                  <li>✓ Ton feedback n'est jamais automatique (pas de patterns prévisibles)</li>
                  <li>✓ La convergence validation couvre TOUS les choix architecturaux</li>
                  <li>✓ Tu maintiens une friction cognitive intentionnelle</li>
                </ul>
              </div>

              <div className="p-6 bg-white/5 border border-red-600/30 rounded-xl">
                <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Signaux d'alerte
                </h3>
                <ul className="space-y-3 text-white/70 text-sm">
                  <li>✗ Tu acceptes les générations sans vraiment les examiner</li>
                  <li>✗ Tu dis "c'est bon" parce que c'est "assez bon"</li>
                  <li>✗ Tu te trouves à justifier Magnus plutôt que le scrutiniser</li>
                  <li>✗ Tu n'as pas modifié ta vision en 20+ sessions</li>
                  <li>✗ L'IA prédit déjà ce que tu vas valider</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-600/50 rounded-xl">
              <p className="text-white/80 leading-relaxed">
                <span className="font-bold text-purple-300">La ligne c'est ici :</span> Tant que tu DÉCIDES et que la machine EXÉCUTE ta décision, tu es orchestrateur. 
                Du moment où la machine DÉCIDE et que tu VALIDES, tu glisses vers l'automatisation. 
                Et c'est presque imperceptible — c'est pourquoi Kushi avertissait en 1984.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 py-12 bg-black/50">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <p className="text-white/60 text-sm mb-4">
              "Une réflexion sur la trajectoire actuelle de l'humanité... et sur le risque qu'elle court."
            </p>
            <p className="text-white/40 text-xs">— Michio Kushi, 1984</p>
            <p className="text-white/40 text-xs mt-4">Phonosophie × Magnus 15 × Conscience Orchestrée</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessSpectrum;
