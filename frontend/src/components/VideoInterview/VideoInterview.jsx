import { useState, useRef, useEffect } from 'react';
import { interviewAPI } from '../../services/api';
import { Video, Square, Play, Award, Briefcase, Camera } from 'lucide-react';
import './VideoInterview.css';

export default function VideoInterview() {
    const [stage, setStage] = useState('select'); // select, recording, review
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [interviewId, setInterviewId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoURL, setVideoURL] = useState(null);
    const [questionCount, setQuestionCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);

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
    const counts = [3, 5, 8];

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
            setStage('recording');

        } catch (error) {
            alert('Failed to start interview: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (stage === 'recording' && !streamRef.current) {
            setupCamera();
        }

        return () => {
            if (stage !== 'recording' && streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [stage]);

    const setupCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                },
                audio: true
            });
            streamRef.current = stream;
            // Delay slightly to ensure video element is rendered
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (error) {
            console.error("Camera Error:", error);
            alert('Camera access denied or not found. Please ensure you have a camera connected and permissions are granted.');
            setStage('select');
        }
    };

    const startRecording = () => {
        if (!streamRef.current) return;

        const recorder = new MediaRecorder(streamRef.current);
        const chunks = [];

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoURL(url);
            setRecordedChunks([...recordedChunks, { question: currentQuestion, url }]);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);

        // Auto-stop after 2 minutes
        setTimeout(() => {
            if (recorder.state === 'recording') {
                stopRecording();
            }
        }, 120000);
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setVideoURL(null);
        } else {
            completeInterview();
        }
    };

    const completeInterview = async () => {
        // Stop camera
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

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
            <div className="video-interview fade-in">
                <div className="interview-header">
                    <Video size={40} className="header-icon" />
                    <div>
                        <h1 className="gradient-text">Video Mock Interview</h1>
                        <p>Practice on camera like a real interview</p>
                    </div>
                </div>

                <div className="interview-setup card glow-card" onMouseMove={handleMouseMove}>
                    <div className="camera-preview">
                        <Camera size={64} />
                        <p>Camera will activate when you start the interview</p>
                    </div>

                    <h2>Setup Your Video Interview</h2>

                    <div className="form-group">
                        <label className="form-label">Select Role</label>
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

                    <button onClick={startInterview} disabled={loading || !role || !difficulty} className="btn btn-primary btn-large" style={{ width: '100%', marginTop: '1rem' }}>
                        {loading ? <div className="spinner"></div> : <><Video size={20} /> Start Video Interview</>}
                    </button>
                </div>
            </div>
        );
    }


    if (stage === 'recording') {
        const question = questions[currentQuestion];
        return (
            <div className="video-interview fade-in">
                <div className="interview-progress">
                    <h3>Question {currentQuestion + 1} of {questions.length}</h3>
                    <span className="badge badge-primary">{question.type}</span>
                </div>

                <div className="video-container">
                    <div className="video-panel">
                        {videoURL ? (
                            <video
                                src={videoURL}
                                controls
                                autoPlay
                                className="video-preview"
                            ></video>
                        ) : (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted={!recording}
                                className="video-preview"
                            ></video>
                        )}

                        {recording && <div className="recording-indicator">● REC</div>}
                    </div>

                    <div className="question-panel card">
                        <h2>{question.question}</h2>

                        <div className="recording-controls">
                            {!recording && !videoURL && (
                                <button onClick={startRecording} className="btn btn-primary btn-large">
                                    <Play size={24} /> Start Recording
                                </button>
                            )}

                            {recording && (
                                <button onClick={stopRecording} className="btn btn-error btn-large">
                                    <Square size={24} /> Stop Recording
                                </button>
                            )}

                            {videoURL && (
                                <div className="recorded-actions">
                                    <p className="text-success">✓ Response recorded!</p>
                                    <div className="button-group">
                                        <button onClick={() => setVideoURL(null)} className="btn btn-secondary">
                                            Re-record
                                        </button>
                                        <button onClick={nextQuestion} className="btn btn-primary">
                                            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="interview-tips">
                            <h4>💡 Tips:</h4>
                            <ul>
                                <li>Look at the camera, not the screen</li>
                                <li>Take a moment to think before answering</li>
                                <li>Speak clearly and at a steady pace</li>
                                <li>Maximum 2 minutes per question</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'certificate') {
        return (
            <div className="video-interview fade-in">
                <div className="certificate-view">
                    <div className="certificate-container">
                        <div className="certificate-paper">
                            <div className="cert-border">
                                <div className="cert-header">
                                    <Award size={48} className="cert-icon" />
                                    <h2>Professional Interview Certificate</h2>
                                    <p className="cert-subtitle">This is to certify that</p>
                                </div>
                                <div className="cert-body">
                                    <h1 className="cert-name">{certificate?.user_name || 'Candidate'}</h1>
                                    <p>has demonstrated exceptional performance in the</p>
                                    <h3 className="cert-course">{certificate?.role} ({certificate?.difficulty})</h3>
                                    <p>Technical Mock Interview with a score of {certificate?.score?.toFixed(1)}%</p>
                                    <p className="cert-details">
                                        Issued on {certificate?.completed_at}
                                    </p>
                                </div>
                                <div className="cert-footer">
                                    <div className="cert-signature">
                                        <div className="sig-line">AI Interview Prep Team</div>
                                        <p>Verification Official</p>
                                    </div>
                                    <div className="cert-id">ID: {certificate?.certificate_id}</div>
                                </div>
                            </div>
                        </div>

                        <div className="button-group mt-4" style={{ justifyContent: 'center', display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => window.print()}>
                                Download PDF
                            </button>
                            <button className="btn btn-secondary" onClick={() => setStage('results')}>
                                Back to Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="video-interview fade-in">
            <div className="results-header card">
                <Award size={60} className="results-icon" />
                <h1>Video Interview Complete!</h1>
                <div className="result-value">{results?.overall_score?.toFixed(1)}%</div>
                <p>XP Earned: +{results?.xp_earned}</p>
                <p className="result-subtitle">Great job! Review your recordings to improve further.</p>

                {results?.overall_score >= 70 && (
                    <button onClick={fetchCertificate} className="btn btn-secondary mt-3" disabled={certLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem auto' }}>
                        <Award size={20} /> {certLoading ? 'Generating...' : 'Get Certificate'}
                    </button>
                )}
            </div>

            <button onClick={() => {
                setStage('select');
                setCurrentQuestion(0);
                setRecordedChunks([]);
                setRole('');
                setDifficulty('');
                setCertificate(null);
            }} className="btn btn-primary btn-large">
                Start New Video Interview
            </button>
        </div>
    );
}
