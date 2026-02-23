import { useState, useEffect } from 'react';
import { practiceAPI } from '../../services/api';
import { Layers, ChevronLeft, ChevronRight, RefreshCcw, RotateCcw, Check, X, HelpCircle } from 'lucide-react';
import './Flashcards.css';

export default function Flashcards() {
    const [stage, setStage] = useState('select'); // select, practicing, results
    const [category, setCategory] = useState('Data Structures');
    const [difficulty, setDifficulty] = useState('Medium');
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [masteredCount, setMasteredCount] = useState(0);

    const categories = ['Data Structures', 'Algorithms', 'Networking', 'Operating Systems', 'System Design', 'Frontend', 'Backend'];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const startFlashcards = async () => {
        setLoading(true);
        try {
            // Using a new endpoint for flashcards
            const response = await practiceAPI.getCodingProblems(`Flashcards: ${category}`, difficulty, 'English');
            // Mapping the generic coding problem format to flashcard format
            const formattedCards = response.data.problems.map(p => ({
                question: p.title,
                answer: p.description,
                points: p.constraints || []
            }));
            setCards(formattedCards);
            setStage('practicing');
            setCurrentIndex(0);
            setIsFlipped(false);
            setMasteredCount(0);
        } catch (error) {
            alert('Failed to load flashcards');
        } finally {
            setLoading(false);
        }
    };

    const handleNext = (mastered = false) => {
        if (mastered) setMasteredCount(prev => prev + 1);
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setStage('results');
        }
    };

    if (stage === 'select') {
        return (
            <div className="flashcards-container fade-in">
                <div className="section-header">
                    <Layers size={40} className="text-secondary" />
                    <div>
                        <h1>Quick Flashcards</h1>
                        <p>Rapidly review key concepts and terminology.</p>
                    </div>
                </div>

                <div className="practice-config card glass-card mt-4">
                    <h3>Configure Flashcard Deck</h3>
                    <div className="config-grid">
                        <div className="form-group">
                            <label>Topic</label>
                            <div className="options-grid">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        className={`opt-btn ${category === cat ? 'active' : ''}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Difficulty</label>
                            <div className="options-grid">
                                {difficulties.map(diff => (
                                    <button
                                        key={diff}
                                        className={`opt-btn ${difficulty === diff ? 'active' : ''}`}
                                        onClick={() => setDifficulty(diff)}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary w-100 mt-4"
                        onClick={startFlashcards}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner"></div> : 'Start Review'}
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'practicing') {
        const card = cards[currentIndex];
        return (
            <div className="flashcards-workspace fade-in">
                <div className="workspace-header">
                    <button className="back-btn" onClick={() => setStage('select')}>
                        <ChevronLeft /> Exit
                    </button>
                    <div className="progress-info">
                        Card {currentIndex + 1} of {cards.length}
                    </div>
                    <div className="score-info">
                        Mastered: {masteredCount}
                    </div>
                </div>

                <div className="flashcard-box" onClick={() => setIsFlipped(!isFlipped)}>
                    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                        <div className="card-face card-front card glass-card">
                            <HelpCircle size={48} className="mb-4 text-secondary opacity-50" />
                            <h3>{card.question}</h3>
                            <p className="mt-4"><small>Click to reveal answer</small></p>
                        </div>
                        <div className="card-face card-back card glass-card">
                            <h3>Answer</h3>
                            <div className="answer-content">
                                <p>{card.answer}</p>
                                {card.points.length > 0 && (
                                    <ul className="mt-2" style={{ textAlign: 'left' }}>
                                        {card.points.map((p, i) => <li key={i}>{p}</li>)}
                                    </ul>
                                )}
                            </div>
                            <p className="mt-4"><small>Click to flip back</small></p>
                        </div>
                    </div>
                </div>

                <div className="flashcard-controls">
                    {isFlipped ? (
                        <div className="button-group fade-in">
                            <button className="btn btn-error" onClick={(e) => { e.stopPropagation(); handleNext(false); }}>
                                <X size={20} /> Still Learning
                            </button>
                            <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); handleNext(true); }}>
                                <Check size={20} /> Mastered
                            </button>
                        </div>
                    ) : (
                        <p className="text-secondary">Flip the card to rate your knowledge</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="submission-results fade-in">
            <div className="result-card card glass-card">
                <RefreshCcw size={64} className="text-primary mb-4" />
                <h1>Session Complete!</h1>
                <p>You mastered <strong>{masteredCount}</strong> out of {cards.length} cards.</p>
                <div className="reward-info mt-4">
                    <span className="xp-badge">+{masteredCount * 5} XP Earned</span>
                </div>
                <div className="actions mt-4">
                    <button className="btn btn-primary" onClick={() => setStage('select')}>Try Another Deck</button>
                    <button className="btn btn-secondary" onClick={() => setStage('select')}>Finish Learning</button>
                </div>
            </div>
        </div>
    );
}
