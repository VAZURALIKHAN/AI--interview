import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceAPI } from '../../services/api';
import { GraduationCap, ChevronLeft, BookOpen, Lightbulb, Zap, CheckCircle } from 'lucide-react';
import './AptitudeTutorial.css';

export default function AptitudeTutorial() {
    const navigate = useNavigate();
    const [stage, setStage] = useState('select'); // select, tutorial
    const [category, setCategory] = useState('');
    const [topic, setTopic] = useState('');
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(false);

    const categories = {
        'Logical': ['Number Series', 'Blood Relations', 'Syllogism', 'Seating Arrangement', 'Coding-Decoding'],
        'Quantitative': ['Percentages', 'Time & Work', 'Profit & Loss', 'Speed & Distance', 'Algebra'],
        'Verbal': ['Synonyms & Antonyms', 'Reading Comprehension', 'Sentence Correction', 'Idioms & Phrases']
    };

    const startTutorial = async (selectedTopic, selectedCat) => {
        setLoading(true);
        setTopic(selectedTopic);
        setCategory(selectedCat);
        try {
            const response = await practiceAPI.getAptitudeTutorial(selectedCat, selectedTopic);
            setTutorial(response.data.tutorial);
            setStage('tutorial');
            window.scrollTo(0, 0);
        } catch (error) {
            alert('Failed to load tutorial');
        } finally {
            setLoading(false);
        }
    };

    if (stage === 'select') {
        return (
            <div className="aptitude-learn fade-in">
                <div className="section-header">
                    <GraduationCap size={40} className="text-warning" />
                    <div>
                        <h1>Aptitude Masterclass</h1>
                        <p>Learn concepts, formulas, and shortcuts for all aptitude categories.</p>
                    </div>
                </div>

                <div className="category-explorer mt-4">
                    {Object.entries(categories).map(([cat, topics], idx) => (
                        <div key={cat} className={`category-section fade-in stagger-${idx + 1}`}>
                            <h2 className="cat-title">{cat}</h2>
                            <div className="topic-grid">
                                {topics.map(t => (
                                    <button
                                        key={t}
                                        className="topic-card card hover-lift"
                                        onClick={() => startTutorial(t, cat)}
                                        disabled={loading}
                                    >
                                        <div className="topic-icon">
                                            {cat === 'Logical' ? '🧩' : cat === 'Quantitative' ? '🔢' : '📝'}
                                        </div>
                                        <span>{t}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {loading && <div className="loading-overlay"><div className="spinner"></div></div>}
            </div>
        );
    }

    return (
        <div className="tutorial-view fade-in">
            <div className="tutorial-sidebar glass-card">
                <button className="back-btn" onClick={() => setStage('select')}>
                    <ChevronLeft size={20} /> Back to Library
                </button>
                <div className="tutorial-meta">
                    <span className="badge badge-warning">{category}</span>
                    <h2>{tutorial.title}</h2>
                </div>
                <nav className="tutorial-nav">
                    <a href="#overview">Overview</a>
                    <a href="#concepts">Key Concepts</a>
                    <a href="#formulas">Formulas</a>
                    <a href="#examples">Solved Examples</a>
                    <a href="#tips">Tips & Tricks</a>
                </nav>
            </div>

            <div className="tutorial-content">
                <section id="overview" className="content-section card">
                    <h3><BookOpen size={24} className="text-primary" /> Overview</h3>
                    <p>{tutorial.overview}</p>
                </section>

                <section id="concepts" className="content-section card">
                    <h3><Lightbulb size={24} className="text-warning" /> Key Concepts</h3>
                    <div className="concepts-list">
                        {tutorial.key_concepts.map((concept, i) => (
                            <div key={i} className="concept-item">
                                <strong>{concept.name || concept.title}:</strong> {concept.description || concept.definition}
                            </div>
                        ))}
                    </div>
                </section>

                {tutorial.formulas && tutorial.formulas.length > 0 && (
                    <section id="formulas" className="content-section card">
                        <h3><Zap size={24} className="text-success" /> Essential Formulas</h3>
                        <div className="formulas-grid">
                            {tutorial.formulas.map((f, i) => (
                                <div key={i} className="formula-box">
                                    <code>{f}</code>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section id="examples" className="content-section card">
                    <h3><CheckCircle size={24} className="text-info" /> Solved Examples</h3>
                    <div className="examples-list">
                        {tutorial.examples.map((ex, i) => (
                            <div key={i} className="tutorial-example">
                                <p className="ex-question"><strong>Example {i + 1}:</strong> {ex.question}</p>
                                <div className="ex-solution">
                                    <p><strong>Solution:</strong></p>
                                    {ex.explanation.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                                    <p className="final-ans">Correct Answer: {ex.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="tips" className="content-section card">
                    <h3>🚀 Tips & Shortcuts</h3>
                    <ul className="tips-list">
                        {tutorial.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </section>

                <div className="tutorial-footer card glass-card">
                    <p>Ready to test your knowledge?</p>
                    <button className="btn btn-primary" onClick={() => navigate('/aptitude')}>
                        Go to Practice Test
                    </button>
                </div>
            </div>
        </div>
    );
}
