import { useState } from 'react';
import { interviewAPI } from '../../services/api';
import { MessageSquare, Send, Award, Briefcase } from 'lucide-react';
import './Interview.css';

export default function Interview() {
    const [stage, setStage] = useState('select');
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [interviewId, setInterviewId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [response, setResponse] = useState('');
    const [feedback, setFeedback] = useState([]);
    const [questionCount, setQuestionCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [certificate, setCertificate] = useState(null);
    const [certLoading, setCertLoading] = useState(false);

    const roles = [
        'Software Developer',
        'Full Stack Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Data Scientist',
        'Data Engineer',
        'Machine Learning Engineer',
        'Product Manager',
        'DevOps Engineer',
        'Cloud Architect',
        'UI/UX Designer',
        'Cybersecurity Analyst',
        'QA/Test Engineer',
        'Mobile Developer',
        'Engineering Manager',
        'Business Development Manager',
        'Finance Analyst',
        'Marketing Specialist',
        'Sales Executive'
    ];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const counts = [3, 5, 10];

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    };

    const startInterview = async () => {
        if (!role || !difficulty) return;
        setLoading(true);
        try {
            const res = await interviewAPI.startInterview(role, difficulty, questionCount);
            setInterviewId(res.data.interview_id);
            setQuestions(res.data.questions);
            setStage('interview');
        } catch (error) {
            alert('Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    const submitResponse = async () => {
        if (!response.trim()) return;
        setLoading(true);
        try {
            const question = questions[currentQuestion];
            const res = await interviewAPI.submitResponse(interviewId, {
                question_id: currentQuestion,
                question: question.question,
                response,
                expected_points: question.expected_points
            });
            setFeedback([...feedback, res.data.evaluation]);
            setResponse('');
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
            } else {
                completeInterview();
            }
        } catch (error) {
            alert('Failed to submit response');
        } finally {
            setLoading(false);
        }
    };

    const completeInterview = async () => {
        try {
            const res = await interviewAPI.completeInterview(interviewId);
            setResults(res.data);
            setStage('results');
        } catch (error) {
            alert('Failed to complete interview');
        }
    };

    const fetchCertificate = async () => {
        try {
            setCertLoading(true);
            const response = await interviewAPI.getCertificate(interviewId);
            setCertificate(response.data);
            setStage('certificate');
        } catch (error) {
            alert('Failed to fetch certificate: ' + (error.response?.data?.detail || error.message));
        } finally {
            setCertLoading(false);
        }
    };

    if (stage === 'select') {
        return (
            <div className="interview fade-in">
                <div className="interview-header">
                    <MessageSquare size={40} className="header-icon" />
                    <div>
                        <h1 className="gradient-text">Mock Interview</h1>
                        <p>Practice with AI-powered interviews</p>
                    </div>
                </div>

                <div className="interview-setup card glow-card" onMouseMove={handleMouseMove}>
                    <h2>Setup Your Interview</h2>

                    <div className="form-group">
                        <label className="form-label">Select Role</label>
                        <div className="role-grid">
                            {roles.map((r) => (
                                <button
                                    key={r}
                                    className={`role-btn ${role === r ? 'selected' : ''}`}
                                    onClick={() => setRole(r)}
                                >
                                    <Briefcase size={24} />
                                    <span>{r}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid-cols-2 grid">
                        <div className="form-group">
                            <label className="form-label">Difficulty</label>
                            <div className="difficulty-grid">
                                {difficulties.map((d) => (
                                    <button
                                        key={d}
                                        className={`difficulty-btn ${difficulty === d ? 'selected' : ''}`}
                                        onClick={() => setDifficulty(d)}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Questions</label>
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

                    <button onClick={startInterview} disabled={loading} className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <div className="spinner"></div> : 'Start Interview'}
                    </button>
                </div>
            </div>
        );
    }


    if (stage === 'interview') {
        const question = questions[currentQuestion];
        return (
            <div className="interview fade-in">
                <div className="interview-progress">
                    <h3>Question {currentQuestion + 1} of {questions.length}</h3>
                    <span className="badge badge-primary">{question.type}</span>
                </div>

                <div className="question-card card">
                    <h2>{question.question}</h2>

                    <div className="form-group">
                        <textarea
                            className="textarea"
                            rows="8"
                            placeholder="Type your answer here..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        ></textarea>
                    </div>

                    <button onClick={submitResponse} disabled={loading} className="btn btn-primary">
                        {loading ? <div className="spinner"></div> : (
                            <><Send size={20} /> {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Interview'}</>
                        )}
                    </button>
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
                                    <h3 className="cert-course">{certificate?.role} Interview</h3>
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
                                        <div className="sig-name">Interview Preparation AI</div>
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

    return (
        <div className="interview fade-in">
            <div className="results-header card">
                <Award size={80} className="results-icon" style={{ color: 'var(--warning)', filter: 'drop-shadow(0 0 20px var(--warning))', margin: '0 auto 1.5rem' }} />
                <h1>Interview Complete!</h1>
                <div className="result-value" style={{ fontSize: '4rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--primary-light), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '1rem 0' }}>
                    {results?.overall_score?.toFixed(1)}%
                </div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>XP Earned: <span style={{ color: 'var(--primary-light)', fontWeight: 'bold' }}>+{results?.xp_earned}</span></p>

                {results?.overall_score >= 70 && (
                    <button onClick={fetchCertificate} className="btn btn-secondary mt-3" disabled={certLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem auto 0' }}>
                        <Award size={18} /> {certLoading ? 'Generating...' : 'Claim Certificate'}
                    </button>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={() => { setStage('select'); setCurrentQuestion(0); setFeedback([]); }} className="btn btn-primary btn-large">
                    Start New Interview
                </button>
            </div>
        </div>
    );
}
