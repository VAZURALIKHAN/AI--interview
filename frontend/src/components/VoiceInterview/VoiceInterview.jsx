import { useState, useEffect, useRef } from 'react';
import { interviewAPI } from '../../services/api';
import { Mic, MicOff, Volume2, Send, Award, Briefcase, RefreshCw, Loader2, Play, User as UserIcon, Smile, UserCheck, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './VoiceInterview.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceInterview() {
    const [stage, setStage] = useState('select');
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [interviewId, setInterviewId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [personality, setPersonality] = useState('Friendly');
    const [questionCount, setQuestionCount] = useState(5);

    const personalities = {
        'Friendly': { name: 'Emily', description: 'Encouraging & supportive', pitch: 1.1, rate: 1.0 },
        'Professional': { name: 'Marcus', description: 'Strict & thorough', pitch: 0.9, rate: 0.95 },
        'Executive': { name: 'Sarah', description: 'Strategic & high-level', pitch: 1.0, rate: 1.05 }
    };

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    const roles = [
        'Software Developer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Engineer',
        'AI/ML Engineer',
        'Data Scientist',
        'Product Manager',
        'Project Manager',
        'UI/UX Designer',
        'Digital Marketing Specialist',
        'Cybersecurity Analyst',
        'HR Specialist',
        'Talent Acquisition Manager',
        'AI Ethics Officer',
        'Employee Experience Specialist',
        'Business Development Manager',
        'Finance Analyst',
        'Cloud Solution Architect',
        'Blockchain Developer'
    ];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const counts = [3, 5, 10];

    useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        setTranscript(prev => prev + event.results[i][0].transcript + ' ');
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Ensure voices are loaded
        const loadVoices = () => {
            if (synthRef.current) synthRef.current.getVoices();
        };
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const speak = (text, callback) => {
        if (!synthRef.current) return;
        setIsSpeaking(true);
        const currentPersonality = personalities[personality];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = currentPersonality.rate;
        utterance.pitch = currentPersonality.pitch;

        // Find a matching voice
        const voices = synthRef.current.getVoices();
        let voice;
        if (personality === 'Professional') { // Marcus - Male
            voice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Male')) || voices[0];
        } else { // Emily/Sarah - Female
            voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Female')) || voices[0];
        }
        if (voice) utterance.voice = voice;

        utterance.onend = () => {
            setIsSpeaking(false);
            if (callback) callback();
        };
        synthRef.current.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const startInterview = async () => {
        if (!role || !difficulty) return;
        setLoading(true);
        try {
            const res = await interviewAPI.startInterview(role, difficulty, questionCount);
            setInterviewId(res.data.interview_id);
            setQuestions(res.data.questions);
            setStage('interview');

            // Introduce HR
            const intro = `Hello! I'm ${personalities[personality].name}, your AI interviewer today for the ${role} position. We'll go through ${questionCount} questions. Let's start with the first one.`;
            speak(intro, () => {
                speak(res.data.questions[0].question);
            });
        } catch (error) {
            alert('Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    const submitResponse = async () => {
        if (!transcript.trim()) return;
        setLoading(true);
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        try {
            const question = questions[currentQuestion];
            const res = await interviewAPI.submitResponse(interviewId, {
                question_id: currentQuestion,
                question: question.question,
                response: transcript,
                expected_points: question.expected_points
            });

            setFeedback([...feedback, res.data.evaluation]);
            setTranscript('');

            if (currentQuestion < questions.length - 1) {
                const nextQ = currentQuestion + 1;
                setCurrentQuestion(nextQ);
                const transitions = [
                    "Got it. Thanks for that answer. Next question:",
                    "I see. Let's move on to the next one:",
                    "Great. Moving forward:",
                    "Understood. How about this next one:"
                ];
                const transition = transitions[Math.floor(Math.random() * transitions.length)];
                speak(transition, () => {
                    speak(questions[nextQ].question);
                });
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
            speak("We've completed the interview. Excellent work! I've calculated your results. You can review them now.");
        } catch (error) {
            alert('Failed to complete interview');
        }
    };

    const handleMouseMove = (e) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    };

    if (stage === 'select') {
        return (
            <div className="voice-interview fade-in">
                <div className="voice-interview-header">
                    <div className="header-icon-voice">
                        <Mic size={48} />
                    </div>
                    <div>
                        <h1 className="gradient-text">AI HR Voice Interview</h1>
                        <p>Real-time conversational practice with our AI HR Manager</p>
                    </div>
                </div>

                <div className="interview-setup card glow-card" onMouseMove={handleMouseMove}>
                    <div className="setup-grid">
                        <div className="form-group">
                            <label className="form-label">Target Role</label>
                            <div className="role-grid">
                                {roles.map((r) => (
                                    <button
                                        key={r}
                                        className={`role-btn ${role === r ? 'selected' : ''}`}
                                        onClick={() => setRole(r)}
                                    >
                                        <Briefcase size={20} />
                                        <span>{r}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="setup-options">
                            <div className="form-group">
                                <label className="form-label">Interview Difficulty</label>
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

                            <div className="form-group mt-3">
                                <label className="form-label">Interviewer Personality</label>
                                <div className="personality-grid-voice">
                                    {Object.entries(personalities).map(([key, value]) => (
                                        <button
                                            key={key}
                                            className={`personality-btn-voice ${personality === key ? 'selected' : ''}`}
                                            onClick={() => setPersonality(key)}
                                        >
                                            <div className="personality-icon">
                                                {key === 'Friendly' && <Smile size={24} />}
                                                {key === 'Professional' && <UserCheck size={24} />}
                                                {key === 'Executive' && <Crown size={24} />}
                                            </div>
                                            <div className="personality-info">
                                                <span className="personality-name">{key} ({value.name})</span>
                                                <span className="personality-desc">{value.description}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startInterview}
                        disabled={loading || !role || !difficulty}
                        className="btn btn-primary btn-large"
                        style={{ width: '100%', marginTop: '2rem', height: '60px' }}
                    >
                        {loading ? <Loader2 className="spinner" /> : 'Enter Interview Room'}
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'interview') {
        const question = questions[currentQuestion];
        return (
            <div className="voice-interview fade-in">
                <div className="hr-container">
                    <div className="hr-avatar-wrapper">
                        <div className="hr-avatar">
                            <UserIcon size={100} color="var(--primary-light)" />
                            {isSpeaking && (
                                <div className="voice-waves">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="wave-bar"></div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="question-text-box">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <span className="badge badge-primary mb-2">Question {currentQuestion + 1} of {questions.length}</span>
                                <h2>{question?.question}</h2>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="status-indicator">
                        {isSpeaking ? (
                            <div className="status-badge status-speaking">
                                <Volume2 size={16} /> AI is speaking...
                            </div>
                        ) : isListening ? (
                            <div className="status-badge status-listening">
                                <Mic size={16} /> Listening to you...
                            </div>
                        ) : (
                            <div className="status-badge status-idle"> Ready for your answer</div>
                        )}
                    </div>
                </div>

                <div className="voice-controls">
                    <div className="transcript-preview">
                        {transcript || (isListening ? "Listening..." : "Click the mic and start speaking your answer...")}
                    </div>

                    <div className="action-buttons">
                        <button
                            className={`mic-button ${isListening ? 'listening' : ''}`}
                            onClick={toggleListening}
                            disabled={isSpeaking || loading}
                        >
                            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
                        </button>

                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, height: '80px', borderRadius: '40px', fontSize: '1.25rem' }}
                            onClick={submitResponse}
                            disabled={!transcript || isSpeaking || loading}
                        >
                            {loading ? <Loader2 className="spinner" /> : (
                                <><Send size={24} /> Submit Answer</>
                            )}
                        </button>
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() => speak(question.question)}
                        disabled={isSpeaking}
                    >
                        <RefreshCw size={18} /> Repeat Question
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="voice-interview fade-in">
            <div className="results-header card mb-3">
                <Award size={80} className="results-icon" />
                <h1>Interview Results</h1>
                <div className="result-value" style={{ fontSize: '4rem' }}>{results?.overall_score?.toFixed(1)}%</div>
                <div className="badge badge-success mt-2">+{results?.xp_earned} XP EARNED</div>
            </div>

            <div className="voice-results">
                <div className="card">
                    <h3>HR Feedback</h3>
                    <div className="feedback-scroll">
                        {feedback.map((f, i) => (
                            <div key={i} className="feedback-item">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="badge badge-primary">Q{i + 1}</span>
                                    <span className="feedback-score">{f.score}%</span>
                                </div>
                                <p className="mb-2"><strong>Feedback:</strong> {f.feedback}</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="badge badge-success">Strengths: {f.strengths?.[0]}</div>
                                    <div className="badge badge-warning">Improve: {f.improvements?.[0]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => { setStage('select'); setCurrentQuestion(0); setFeedback([]); setTranscript(''); }}
                    className="btn btn-primary btn-large"
                >
                    Practice Again
                </button>
            </div>
        </div>
    );
}
