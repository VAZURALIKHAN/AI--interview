import { useState } from 'react';
import { aptitudeAPI } from '../../services/api';
import { Brain, Clock, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react';
import './Aptitude.css';

export default function Aptitude() {
    const [stage, setStage] = useState('select'); // select, test, results
    const [category, setCategory] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timer, setTimer] = useState(0);
    const [questionCount, setQuestionCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [certLoading, setCertLoading] = useState(false);

    const categories = [
        { id: 'Logical', name: 'Logical Reasoning', icon: '🧩' },
        { id: 'Quantitative', name: 'Quantitative Aptitude', icon: '🔢' },
        { id: 'Verbal', name: 'Verbal Ability', icon: '📝' }
    ];

    const difficulties = ['Easy', 'Medium', 'Hard'];
    const counts = [5, 10, 15, 20];

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    };

    const startTest = async () => {
        if (!category || !difficulty) {
            alert('Please select both category and difficulty');
            return;
        }

        setLoading(true);
        try {
            const response = await aptitudeAPI.getQuestions(category, difficulty, questionCount);
            setQuestions(response.data.questions);
            setStage('test');
            setTimer(Date.now());
        } catch (error) {
            alert('Failed to load questions: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (questionIndex, answerIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: answerIndex
        });
    };

    const submitTest = async () => {
        const timeTaken = Math.floor((Date.now() - timer) / 1000);
        let correctCount = 0;

        questions.forEach((q, index) => {
            if (answers[index] === q.correct_answer) {
                correctCount++;
            }
        });

        setLoading(true);
        try {
            const response = await aptitudeAPI.submitTest({
                category,
                difficulty,
                questions_data: { questions, answers },
                correct_answers: correctCount,
                total_questions: questions.length,
                time_taken: timeTaken
            });

            setResults(response.data);
            setStage('results');
        } catch (error) {
            alert('Failed to submit test: ' + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificate = async () => {
        try {
            setCertLoading(true);
            const response = await aptitudeAPI.getCertificate(results.test_id);
            setCertificate(response.data);
            setStage('certificate');
        } catch (error) {
            alert('Failed to fetch certificate: ' + (error.response?.data?.detail || error.message));
        } finally {
            setCertLoading(false);
        }
    };

    const resetTest = () => {
        setStage('select');
        setCategory('');
        setDifficulty('');
        setQuestions([]);
        setCurrentQuestion(0);
        setAnswers({});
        setResults(null);
        setCertificate(null);
    };

    // Selection Screen
    if (stage === 'select') {
        return (
            <div className="aptitude fade-in">
                <div className="aptitude-header">
                    <Brain size={40} className="header-icon" />
                    <div>
                        <h1 className="gradient-text">Aptitude Tests</h1>
                        <p>Test your skills and earn XP</p>
                    </div>
                </div>

                <div className="test-setup card glow-card" onMouseMove={handleMouseMove}>
                    <h2>Configure Your Test</h2>

                    <div className="form-group">
                        <label className="form-label">Select Category</label>
                        <div className="category-grid">
                            {categories.map((cat, index) => (
                                <button
                                    key={cat.id}
                                    className={`category-card fade-in stagger-${index + 1} ${category === cat.id ? 'selected' : ''}`}
                                    onClick={() => setCategory(cat.id)}
                                >
                                    <span className="category-icon">{cat.icon}</span>
                                    <h3>{cat.name}</h3>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid-cols-2 grid">
                        <div className="form-group">
                            <label className="form-label">Select Difficulty</label>
                            <div className="difficulty-grid">
                                {difficulties.map((diff) => (
                                    <button
                                        key={diff}
                                        className={`difficulty-btn ${difficulty === diff ? 'selected' : ''}`}
                                        onClick={() => setDifficulty(diff)}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Number of Questions</label>
                            <div className="difficulty-grid">
                                {counts.map((c) => (
                                    <button
                                        key={c}
                                        className={`difficulty-btn ${questionCount === c ? 'selected' : ''}`}
                                        onClick={() => setQuestionCount(c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startTest}
                        disabled={!category || !difficulty || loading}
                        className="btn btn-primary btn-large"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {loading ? <div className="spinner"></div> : <>Start Test</>}
                    </button>
                </div>
            </div>
        );
    }


    // Test Screen
    if (stage === 'test') {
        const question = questions[currentQuestion];
        const progress = ((currentQuestion + 1) / questions.length) * 100;

        return (
            <div className="aptitude fade-in">
                <div className="test-header">
                    <div className="test-info">
                        <h2>{category} - {difficulty}</h2>
                        <p>Question {currentQuestion + 1} of {questions.length}</p>
                    </div>
                    <div className="test-timer">
                        <Clock size={20} />
                        <span>{Math.floor((Date.now() - timer) / 1000)}s</span>
                    </div>
                </div>

                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="question-card card">
                    <h3 className="question-text">{question.question}</h3>

                    <div className="options-list">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-btn fade-in stagger-${index + 1} ${answers[currentQuestion] === index ? 'selected' : ''}`}
                                onClick={() => selectAnswer(currentQuestion, index)}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                <span className="option-text">{option}</span>
                                {answers[currentQuestion] === index && <CheckCircle size={20} />}
                            </button>
                        ))}
                    </div>

                    <div className="question-nav">
                        <button
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                            className="btn btn-secondary"
                        >
                            Previous
                        </button>

                        {currentQuestion < questions.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                className="btn btn-primary"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={submitTest}
                                disabled={loading || Object.keys(answers).length !== questions.length}
                                className="btn btn-success"
                            >
                                {loading ? <div className="spinner"></div> : <>Submit Test</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'certificate') {
        return (
            <div className="aptitude fade-in">
                <div className="certificate-view">
                    <div className="certificate-container">
                        <div className="certificate-paper">
                            <div className="holographic-overlay"></div>
                            <div className="cert-border">
                                <div className="cert-header">
                                    <span className="cert-logo">🔱</span>
                                    <h2>Excellence Award</h2>
                                    <p className="cert-subtitle">This prestigious certificate is presented to</p>
                                </div>
                                <div className="cert-body">
                                    <h1 className="cert-name">{certificate?.user_name || 'Candidate'}</h1>
                                    <p className="cert-achievement">For demonstrating exceptional mastery in</p>
                                    <h3 className="cert-course">{certificate?.category} Aptitude</h3>
                                    <p className="cert-performance">
                                        with an outstanding performance score of <span className="cert-score-highlight">{certificate?.score?.toFixed(1)}%</span>
                                    </p>
                                </div>
                                <div className="cert-footer">
                                    <div className="cert-date">
                                        <p>Date of Issue</p>
                                        <strong>{certificate?.completed_at}</strong>
                                    </div>
                                    <div className="cert-signature">
                                        <div className="sig-name">interview prepareation</div>
                                        <div className="sig-line"></div>
                                        <p className="sig-title">AI Assessment Director</p>
                                    </div>
                                    <div className="cert-id">
                                        <p>Verification ID</p>
                                        <strong>{certificate?.certificate_id}</strong>
                                    </div>
                                </div>

                                <div className="cert-stamp">
                                    <div className="cert-stamp-inner">
                                        <span>Official</span>
                                        <span>Certified</span>
                                        <span>2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="button-group mt-4" style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                Download Official PDF
                            </button>
                            <button className="btn btn-secondary" onClick={() => setStage('results')}>
                                Return to Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results Screen
    return (
        <div className="aptitude fade-in">
            <div className="results-container">
                <div className="results-header card glass-card">
                    <Trophy size={60} className="results-icon" />
                    <h1>Test Complete!</h1>
                    <p className="results-message">{results.message}</p>

                    {results.score >= 80 && (
                        <button onClick={fetchCertificate} className="btn btn-secondary mt-3" disabled={certLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem auto' }}>
                            <Trophy size={18} /> {certLoading ? 'Generating...' : 'Get Certificate'}
                        </button>
                    )}
                </div>

                <div className="results-grid">
                    <div className="result-card card fade-in stagger-1">
                        <h3>Your Score</h3>
                        <div className="result-value">{results.score.toFixed(1)}%</div>
                        <div className="result-subtitle">
                            {Math.round((results.score / 100) * questions.length)} / {questions.length} correct
                        </div>
                    </div>

                    <div className="result-card card fade-in stagger-2">
                        <Zap size={32} className="xp-icon" />
                        <h3>XP Earned</h3>
                        <div className="result-value">+{results.xp_earned}</div>
                        <div className="result-subtitle">Total: {results.total_xp} XP</div>
                    </div>

                    <div className="result-card card fade-in stagger-3">
                        <Trophy size={32} className="level-icon" />
                        <h3>Current Level</h3>
                        <div className="result-value">{results.level}</div>
                        <div className="result-subtitle">Keep going!</div>
                    </div>
                </div>

                <div className="results-actions">
                    <button onClick={resetTest} className="btn btn-primary btn-large">
                        Take Another Test
                    </button>
                </div>
            </div>
        </div>
    );
}

