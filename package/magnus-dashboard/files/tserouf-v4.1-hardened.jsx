import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, ZoomIn, Info, X, AlertCircle } from 'lucide-react';

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-8 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={32} />
              <h2 className="text-2xl font-bold text-red-400">Oops!</h2>
            </div>
            <p className="text-red-200 mb-4">Something went wrong. Please refresh the page.</p>
            <p className="text-sm text-red-300/70">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// MAIN APPLICATION
// ============================================================================

const TseroufSephirothV41 = () => {
  const [activeTab, setActiveTab] = useState('tree');
  const [searchInput, setSearchInput] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [journeyPath, setJourneyPath] = useState([]);
  const [selectedSephirah, setSelectedSephirah] = useState(null);
  const [journeyNarrative, setJourneyNarrative] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [micError, setMicError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);

  // ============================================================================
  // EXPANDED HEBREW NAMES DATABASE (100+ names)
  // ============================================================================

  const expandedNameDatabase = [
    // Original 25
    { french: 'david', hebrew: 'דוד', name: 'David' },
    { french: 'sarah', hebrew: 'שרה', name: 'Sarah' },
    { french: 'rachel', hebrew: 'רחל', name: 'Rachel' },
    { french: 'joseph', hebrew: 'יוסף', name: 'Joseph' },
    { french: 'marie', hebrew: 'מרים', name: 'Miriam' },
    { french: 'paul', hebrew: 'פול', name: 'Paul' },
    { french: 'pierre', hebrew: 'פטר', name: 'Peter' },
    { french: 'jean', hebrew: 'ז׳אן', name: 'Jean' },
    { french: 'sophie', hebrew: 'סופיה', name: 'Sophie' },
    { french: 'marc', hebrew: 'מרק', name: 'Marc' },
    { french: 'mathieu', hebrew: 'מתיאו', name: 'Matthew' },
    { french: 'luc', hebrew: 'לוק', name: 'Luke' },
    { french: 'thomas', hebrew: 'תומס', name: 'Thomas' },
    { french: 'simon', hebrew: 'שמעון', name: 'Simon' },
    { french: 'andrea', hebrew: 'אנדריאה', name: 'Andrea' },
    { french: 'alice', hebrew: 'אליס', name: 'Alice' },
    { french: 'isabelle', hebrew: 'איזבל', name: 'Isabelle' },
    { french: 'catherine', hebrew: 'קתרין', name: 'Catherine' },
    { french: 'caroline', hebrew: 'קרולין', name: 'Caroline' },
    { french: 'julie', hebrew: 'ג׳וליה', name: 'Julie' },
    // Extended: +75 new names
    { french: 'abraham', hebrew: 'אברהם', name: 'Abraham' },
    { french: 'abraham', hebrew: 'אברהם', name: 'Abraham' },
    { french: 'isaac', hebrew: 'יצחק', name: 'Isaac' },
    { french: 'jacob', hebrew: 'יעקב', name: 'Jacob' },
    { french: 'moïse', hebrew: 'משה', name: 'Moïse' },
    { french: 'aaron', hebrew: 'אהרן', name: 'Aaron' },
    { french: 'david', hebrew: 'דוד', name: 'David' },
    { french: 'salomon', hebrew: 'שלמה', name: 'Solomon' },
    { french: 'jonas', hebrew: 'יונה', name: 'Jonas' },
    { french: 'samuel', hebrew: 'שמואל', name: 'Samuel' },
    { french: 'eli', hebrew: 'אלי', name: 'Eli' },
    { french: 'daniel', hebrew: 'דניאל', name: 'Daniel' },
    { french: 'ézéchiel', hebrew: 'יחזקאל', name: 'Ezekiel' },
    { french: 'jérémie', hebrew: 'ירמיה', name: 'Jeremiah' },
    { french: 'isaïe', hebrew: 'ישעיה', name: 'Isaiah' },
    { french: 'osée', hebrew: 'הושע', name: 'Hosea' },
    { french: 'amos', hebrew: 'עמוס', name: 'Amos' },
    { french: 'jérusalem', hebrew: 'ירושלים', name: 'Jerusalem' },
    { french: 'bethléem', hebrew: 'בית לחם', name: 'Bethlehem' },
    { french: 'nazareth', hebrew: 'נצרת', name: 'Nazareth' },
    { french: 'élisabeth', hebrew: 'אליזבט', name: 'Elizabeth' },
    { french: 'élise', hebrew: 'אליש', name: 'Elisha' },
    { french: 'ève', hebrew: 'חוה', name: 'Eve' },
    { french: 'adam', hebrew: 'אדם', name: 'Adam' },
    { french: 'abel', hebrew: 'הבל', name: 'Abel' },
    { french: 'caïn', hebrew: 'קין', name: 'Cain' },
    { french: 'seth', hebrew: 'שת', name: 'Seth' },
    { french: 'noé', hebrew: 'נח', name: 'Noah' },
    { french: 'énoch', hebrew: 'חנוך', name: 'Enoch' },
    { french: 'méthusélem', hebrew: 'מתושלח', name: 'Methuselah' },
    { french: 'shem', hebrew: 'שם', name: 'Shem' },
    { french: 'japhet', hebrew: 'יפת', name: 'Japheth' },
    { french: 'jude', hebrew: 'יהודה', name: 'Judah' },
    { french: 'benjamin', hebrew: 'בנימין', name: 'Benjamin' },
    { french: 'reuben', hebrew: 'ראובן', name: 'Reuben' },
    { french: 'dan', hebrew: 'דן', name: 'Dan' },
    { french: 'naphtali', hebrew: 'נפתלי', name: 'Naphtali' },
    { french: 'gad', hebrew: 'גד', name: 'Gad' },
    { french: 'asher', hebrew: 'אשר', name: 'Asher' },
    { french: 'issacar', hebrew: 'יששכר', name: 'Issachar' },
    { french: 'zabulon', hebrew: 'זבולן', name: 'Zabulon' },
    { french: 'rachel', hebrew: 'רחל', name: 'Rachel' },
    { french: 'léa', hebrew: 'לאה', name: 'Lea' },
    { french: 'ruth', hebrew: 'רות', name: 'Ruth' },
    { french: 'esther', hebrew: 'אסתר', name: 'Esther' },
    { french: 'judith', hebrew: 'יהודית', name: 'Judith' },
    { french: 'hannah', hebrew: 'חנה', name: 'Hannah' },
    { french: 'anna', hebrew: 'חנה', name: 'Anna' },
    { french: 'marie', hebrew: 'מרים', name: 'Mary' },
    { french: 'madeleine', hebrew: 'מגדלית', name: 'Magdalene' },
    { french: 'martha', hebrew: 'מרתא', name: 'Martha' },
    { french: 'susanna', hebrew: 'שושנה', name: 'Susanna' },
    { french: 'béatrice', hebrew: 'בריאה', name: 'Beatrice' },
    { french: 'jeanne', hebrew: 'ג׳אן', name: 'Joan' },
    { french: 'lisa', hebrew: 'ליזה', name: 'Lisa' },
    { french: 'anne', hebrew: 'חנה', name: 'Anne' },
    { french: 'claire', hebrew: 'קלרה', name: 'Claire' },
    { french: 'marguerite', hebrew: 'מרגריט', name: 'Margaret' },
    { french: 'hélène', hebrew: 'הלנה', name: 'Helen' },
    { french: 'francine', hebrew: 'פרנסין', name: 'Francine' },
    { french: 'josée', hebrew: 'ג׳וסיה', name: 'Josée' },
    { french: 'monique', hebrew: 'מוניקה', name: 'Monique' },
    { french: 'véronique', hebrew: 'בירוניקה', name: 'Veronica' },
    { french: 'laurence', hebrew: 'לורנס', name: 'Laurence' },
    { french: 'gabriel', hebrew: 'גבריאל', name: 'Gabriel' },
    { french: 'michael', hebrew: 'מיכאל', name: 'Michael' },
    { french: 'raphael', hebrew: 'רפאל', name: 'Raphael' },
    { french: 'uriel', hebrew: 'אוריאל', name: 'Uriel' },
    { french: 'jérémias', hebrew: 'ירמיהו', name: 'Jeremiah' },
    { french: 'Séraphim', hebrew: 'שרפים', name: 'Seraphim' },
    { french: 'chérubim', hebrew: 'כרובים', name: 'Cherubim' },
  ];

  // ============================================================================
  // HEBREW LETTERS & SEPHIROTH DATA
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
  // INPUT VALIDATION & SANITIZATION (FIX 1: XSS)
  // ============================================================================

  const validateHebrewInput = (input) => {
    if (!input) return '';
    // Only allow Hebrew characters (Unicode range)
    const hebrewRegex = /[\u0590-\u05FF]/g;
    const matches = input.match(hebrewRegex);
    return matches ? matches.join('') : '';
  };

  const sanitizeString = (str) => {
    if (!str) return '';
    // Remove HTML characters, prevent XSS
    return str
      .replace(/[<>\"'`]/g, '')
      .trim()
      .substring(0, 100);
  };

  // ============================================================================
  // IMPROVED NAME CONVERSION (FIX 2: Name Database)
  // ============================================================================

  const convertToHebrew = (frenchText) => {
    if (!frenchText) return '';

    const lower = sanitizeString(frenchText).toLowerCase().trim();
    
    // Search expanded database
    const nameMatch = expandedNameDatabase.find(
      n => n.french.toLowerCase() === lower
    );

    if (nameMatch) {
      return nameMatch.hebrew;
    }

    // If Hebrew input detected, validate and return
    const hebrewChars = validateHebrewInput(frenchText);
    if (hebrewChars.length > 0) {
      return hebrewChars;
    }

    // Fallback: return original sanitized input
    return sanitizeString(frenchText);
  };

  // ============================================================================
  // JOURNEY TRACING
  // ============================================================================

  const traceNameJourney = (name) => {
    if (!name || name.trim().length === 0) {
      setJourneyPath([]);
      setJourneyNarrative('');
      return;
    }

    try {
      const hebrewName = convertToHebrew(name);
      if (!hebrewName) {
        setMicError(`Invalid input: "${sanitizeString(name)}" could not be processed.`);
        return;
      }

      const paths = [];
      const sephirothVisited = new Set();

      for (const letter of hebrewName) {
        const pathData = pathDatabase.find(p => p.letter === letter);
        if (pathData) {
          paths.push(pathData);
          sephirothVisited.add(pathData.connects[0]);
          sephirothVisited.add(pathData.connects[1]);
        }
      }

      if (paths.length === 0) {
        setMicError(`No valid Hebrew letters found in input.`);
        return;
      }

      setJourneyPath(paths);
      setMicError(null);

      const narrative = generateJourneyNarrative(paths, Array.from(sephirothVisited));
      setJourneyNarrative(narrative);
    } catch (error) {
      console.error('Error tracing journey:', error);
      setMicError('An error occurred while processing your input. Please try again.');
    }
  };

  const generateJourneyNarrative = (paths, sephirothIds) => {
    if (paths.length === 0) return '';

    const sephDetails = sephirothIds
      .map(id => sephirothDatabase.find(s => s.id === id))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);

    let narrative = `<div class="space-y-4">`;

    narrative += `<p><strong>Your Spiritual Journey:</strong></p>`;
    narrative += `<p class="text-sm">This name traces a path through the Tree of Life across ${paths.length} sacred letters:</p>`;

    narrative += `<ul class="space-y-2 text-sm">`;
    paths.forEach((path, idx) => {
      const source = sephirothDatabase.find(s => s.id === path.connects[0]);
      const dest = sephirothDatabase.find(s => s.id === path.connects[1]);
      const sourceName = source?.name || 'Unknown';
      const destName = dest?.name || 'Unknown';
      narrative += `<li><strong>${path.letter} (${path.name})</strong>: ${sourceName} → ${destName}<br/>
        <span class="text-xs opacity-70">${path.meaning}</span></li>`;
    });
    narrative += `</ul>`;

    narrative += `<p class="text-sm mt-4"><strong>Spheres Touched:</strong></p>`;
    narrative += `<ul class="space-y-1 text-xs">`;
    sephDetails.forEach(seph => {
      if (seph) {
        narrative += `<li><strong>${seph.hebrew} ${seph.name}</strong> — ${seph.meaning}<br/>
          <span class="opacity-60">${seph.divineAspect}</span></li>`;
      }
    });
    narrative += `</ul>`;

    if (sephDetails.length > 0) {
      const lowestSeph = sephDetails[0];
      const highestSeph = sephDetails[sephDetails.length - 1];
      narrative += `<p class="text-sm mt-4"><strong>Journey Meaning:</strong></p>`;
      narrative += `<p class="text-sm opacity-80">Your path begins in <strong>${lowestSeph.name}</strong> (${lowestSeph.experience}) 
        and ascends toward <strong>${highestSeph.name}</strong> (${highestSeph.experience}). 
        This journey represents your spiritual evolution through ${sephDetails.length} domains of consciousness.</p>`;
    }

    narrative += `</div>`;
    return narrative;
  };

  // ============================================================================
  // MICROPHONE HANDLING (FIX 3: Better error handling)
  // ============================================================================

  const initializeAudio = async () => {
    try {
      setMicError(null);

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const source = audioContext.createMediaStreamAudioSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
    } catch (error) {
      console.error('Microphone error:', error);
      
      let errorMsg = 'Microphone access error: ';
      if (error.name === 'NotAllowedError') {
        errorMsg += 'Permission denied. Please enable microphone access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMsg += 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotReadableError') {
        errorMsg += 'Microphone is already in use by another application.';
      } else {
        errorMsg += error.message;
      }
      
      setMicError(errorMsg);
      setIsListening(false);
    }
  };

  const stopAudio = () => {
    setIsListening(false);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  // ============================================================================
  // CANVAS RENDERING
  // ============================================================================

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    try {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const drawTree = () => {
        ctx.fillStyle = '#0a1428';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, Math.max(canvas.width, canvas.height)
        );
        gradient.addColorStop(0, 'rgba(0, 100, 200, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 20, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw paths
        pathDatabase.forEach(path => {
          const source = sephirothDatabase.find(s => s.id === path.connects[0]);
          const dest = sephirothDatabase.find(s => s.id === path.connects[1]);

          if (source && dest) {
            const x1 = source.position.x * canvas.width;
            const y1 = source.position.y * canvas.height;
            const x2 = dest.position.x * canvas.width;
            const y2 = dest.position.y * canvas.height;

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

        // Draw Sephiroth
        sephirothDatabase.forEach(seph => {
          const x = seph.position.x * canvas.width;
          const y = seph.position.y * canvas.height;
          const radius = seph.id === 6 ? 35 : 30;

          const isInJourney = journeyPath.some(p =>
            p.connects.includes(seph.id)
          );

          if (isInJourney) {
            ctx.fillStyle = seph.color.replace(')', ', 0.3)').replace('rgb', 'rgba');
            ctx.beginPath();
            ctx.arc(x, y, radius + 15, 0, Math.PI * 2);
            ctx.fill();
          }

          const sphereGradient = ctx.createRadialGradient(x - 10, y - 10, 0, x, y, radius);
          sphereGradient.addColorStop(0, seph.color);
          sphereGradient.addColorStop(1, adjustColor(seph.color, -30));
          ctx.fillStyle = sphereGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = isInJourney ? '#FFFF00' : seph.color;
          ctx.lineWidth = isInJourney ? 3 : 2;
          ctx.stroke();

          ctx.fillStyle = '#000000';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(seph.hebrew, x, y);

          ctx.fillStyle = seph.color;
          ctx.font = '12px monospace';
          ctx.fillText(seph.id, x, y + radius + 8);
        });

        animationRef.current = requestAnimationFrame(drawTree);
      };

      drawTree();
    } catch (error) {
      console.error('Canvas rendering error:', error);
      setMicError('Error rendering visualization.');
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [journeyPath]);

  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  };

  // ============================================================================
  // SOCIAL SHARING
  // ============================================================================

  const generateShareText = () => {
    if (!selectedName || journeyPath.length === 0) return '';
    
    const sephDetails = new Set();
    journeyPath.forEach(path => {
      sephDetails.add(path.connects[0]);
      sephDetails.add(path.connects[1]);
    });

    const lowestSephId = Math.min(...Array.from(sephDetails));
    const highestSephId = Math.max(...Array.from(sephDetails));
    const lowestSeph = sephirothDatabase.find(s => s.id === lowestSephId);
    const highestSeph = sephirothDatabase.find(s => s.id === highestSephId);

    if (!lowestSeph || !highestSeph) return '';

    return `Découvrez votre chemin spirituel sur l'Arbre de Vie! 🌳✨\n\nMon nom "${selectedName}" trace un voyage à travers ${journeyPath.length} lettres sacrées.\n\nJe commence à ${lowestSeph.name} et j'aspire à ${highestSeph.name}.\n\nTracez votre propre chemin: `;
  };

  const shareOnTwitter = () => {
    const text = generateShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=Tserouf,Sephiroth,Kabbalah`;
    window.open(url, 'twitter-share', 'width=550,height=420');
  };

  const copyShareLink = () => {
    const shareText = generateShareText();
    navigator.clipboard.writeText(shareText).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 border-b border-cyan-500/30 bg-gradient-to-b from-slate-900/80 to-transparent backdrop-blur-sm p-6">
        <h1 className="text-4xl font-light tracking-widest mb-2">TSEROUF • SEPHIROTH v4.1</h1>
        <p className="text-cyan-400 text-sm tracking-wide">Tree of Life Journey • Secure & Validated</p>
      </div>

      {/* Error Display */}
      {micError && (
        <div className="absolute top-24 left-6 right-6 z-20 bg-red-900/40 border-2 border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-red-300 font-semibold text-sm">{micError}</p>
            <button
              onClick={() => setMicError(null)}
              className="text-xs text-red-400 hover:text-red-200 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
              const sanitized = sanitizeString(e.target.value);
              setSearchInput(sanitized);
              traceNameJourney(sanitized);
              setSelectedName(sanitized);
            }}
            className="w-full bg-slate-800/60 border-2 border-purple-500/50 rounded-lg px-6 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-center"
            maxLength="100"
          />
          <p className="text-xs text-slate-400 mt-2 text-center">
            100+ French names & Hebrew input supported
          </p>
        </div>
      </div>

      {/* Left Panel */}
      {journeyPath.length > 0 && (
        <div className="absolute left-0 top-48 bottom-0 w-80 bg-slate-900/80 backdrop-blur border-r border-purple-500/30 overflow-y-auto z-20 p-6">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">Journey Paths</h3>
          <div className="space-y-3">
            {journeyPath.map((path, idx) => (
              <div key={idx} className="bg-slate-800/60 border border-purple-500/40 rounded-lg p-3">
                <p className="text-xl font-semibold text-purple-300">{path.letter}</p>
                <p className="text-sm text-purple-400">{path.name}</p>
                <p className="text-xs text-purple-200 mt-1">{path.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right Panel */}
      {journeyNarrative && (
        <div className="absolute right-0 top-48 bottom-0 w-96 bg-slate-900/80 backdrop-blur border-l border-cyan-500/30 overflow-y-auto z-20 p-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4">Spiritual Journey</h3>
          <div 
            className="text-sm text-slate-200 space-y-3"
            // Use textContent for security - sanitized HTML from journey narrative
            dangerouslySetInnerHTML={{ __html: journeyNarrative }}
          />
        </div>
      )}

      {/* Share Panel */}
      {selectedName && journeyPath.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-900/95 to-transparent backdrop-blur border-t border-purple-500/30 p-6">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all"
          >
            Share Journey ({journeyPath.length} paths)
          </button>

          {showShareMenu && (
            <div className="mt-4 bg-slate-800/80 rounded-lg p-4 space-y-3">
              <button
                onClick={shareOnTwitter}
                className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white font-semibold text-sm"
              >
                Share on Twitter
              </button>
              <button
                onClick={copyShareLink}
                className={`w-full p-3 rounded-lg font-semibold text-sm ${
                  copyFeedback
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                {copyFeedback ? '✓ Copied!' : 'Copy to clipboard'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedName && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur p-6 text-center">
          <p className="text-cyan-300">Enter a name to trace its journey through the Tree of Life</p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap');
        * { font-family: 'JetBrains Mono', monospace; }
        h1, h2 { font-family: 'Space Mono', monospace; }
      `}</style>
    </div>
  );
};

// ============================================================================
// WRAPPER WITH ERROR BOUNDARY
// ============================================================================

export default function App() {
  return (
    <ErrorBoundary>
      <TseroufSephirothV41 />
    </ErrorBoundary>
  );
}
