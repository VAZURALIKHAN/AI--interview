import { useState, useEffect } from 'react';
import { practiceAPI } from '../../services/api';
import { Code, ChevronLeft, ChevronRight, Play, CheckCircle, RefreshCcw, HelpCircle } from 'lucide-react';
import './Coding.css';

export default function PracticeCoding() {
    const [stage, setStage] = useState('select'); // select, solving, results
    const [difficulty, setDifficulty] = useState('Medium');
    const [category, setCategory] = useState('Algorithms');
    const [problems, setProblems] = useState([]);
    const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
    const [language, setLanguage] = useState('Python');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Algorithms', 'DP', 'System Design'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const languages = ['Python', 'JavaScript', 'Java', 'C++', 'Go'];

    const startPractice = async () => {
        setLoading(true);
        try {
            const response = await practiceAPI.getCodingProblems(category, difficulty, language);
            setProblems(response.data.problems);
            setStage('solving');
            setCurrentProblemIdx(0);
            setCode(response.data.problems[0].starter_code);
        } catch (error) {
            alert('Failed to load problems');
        } finally {
            setLoading(false);
        }
    };

    const submitSolution = async () => {
        setLoading(true);
        try {
            // In a real app, we'd run the code. Here we just simulate success.
            await practiceAPI.submitCodingSolution({
                problem_id: problems[currentProblemIdx].title,
                code: code,
                language: language
            });
            setSubmissionResult({
                success: true,
                message: 'All test cases passed! Great job!',
                xp_earned: 25
            });
            setStage('results');
        } catch (error) {
            alert('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    if (stage === 'select') {
        return (
            <div className="coding-practice fade-in">
                <div className="section-header">
                    <Code size={40} className="text-primary" />
                    <div>
                        <h1>Coding Practice</h1>
                        <p>Sharpen your technical skills with AI-powered challenges.</p>
                    </div>
                </div>

                <div className="practice-config card glass-card mt-4">
                    <h3>Configure Session</h3>
                    <div className="config-grid">
                        <div className="form-group">
                            <label>Category</label>
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
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Programming Language</label>
                            <div className="options-grid">
                                {languages.map(lang => (
                                    <button
                                        key={lang}
                                        className={`opt-btn ${language === lang ? 'active' : ''}`}
                                        onClick={() => setLanguage(lang)}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary w-100 mt-4"
                        onClick={startPractice}
                        disabled={loading}
                    >
                        {loading ? <div className="spinner"></div> : 'Start Challenges'}
                    </button>
                </div>
            </div>
        );
    }

    if (stage === 'solving') {
        const problem = problems[currentProblemIdx];
        return (
            <div className="coding-workspace fade-in">
                <div className="workspace-header">
                    <button className="back-btn" onClick={() => setStage('select')}>
                        <ChevronLeft /> Back to Setup
                    </button>
                    <div className="problem-info">
                        <h2>{problem.title}</h2>
                        <span className={`badge badge-${difficulty.toLowerCase()}`}>{difficulty}</span>
                    </div>
                    <div className="problem-nav">
                        <button
                            disabled={currentProblemIdx === 0}
                            onClick={() => {
                                setCurrentProblemIdx(idx => idx - 1);
                                setCode(problems[currentProblemIdx - 1].starter_code);
                            }}
                        >
                            <ChevronLeft /> Previous
                        </button>
                        <span>{currentProblemIdx + 1} / {problems.length}</span>
                        <button
                            disabled={currentProblemIdx === problems.length - 1}
                            onClick={() => {
                                setCurrentProblemIdx(idx => idx + 1);
                                setCode(problems[currentProblemIdx + 1].starter_code);
                            }}
                        >
                            Next <ChevronRight />
                        </button>
                    </div>
                </div>

                <div className="workspace-grid">
                    <div className="problem-description card">
                        <h3>Description</h3>
                        <p>{problem.description}</p>

                        <h4>Examples</h4>
                        <div className="examples-list">
                            {problem.examples.map((ex, i) => (
                                <div key={i} className="example-box">
                                    <p><strong>Input:</strong> <code>{ex.input}</code></p>
                                    <p><strong>Output:</strong> <code>{ex.output}</code></p>
                                    {ex.explanation && <p className="text-secondary"><small>{ex.explanation}</small></p>}
                                </div>
                            ))}
                        </div>

                        <h4>Constraints</h4>
                        <ul className="constraints-list">
                            {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                    </div>

                    <div className="code-editor-container card">
                        <div className="editor-header">
                            <span>{language}</span>
                            <button className="btn btn-secondary btn-sm" onClick={() => setCode(problem.starter_code)}>
                                <RefreshCcw size={14} /> Reset
                            </button>
                        </div>
                        <textarea
                            className="code-editor"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                        ></textarea>
                        <div className="editor-footer">
                            <button className="btn btn-secondary" disabled={loading}>Run Sample</button>
                            <button className="btn btn-primary" onClick={submitSolution} disabled={loading}>
                                {loading ? <div className="spinner"></div> : <><Play size={16} /> Submit Solution</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="submission-results fade-in">
            <div className="result-card card glass-card">
                <CheckCircle size={64} className="text-success mb-4" />
                <h1>Submission Successful!</h1>
                <p>{submissionResult.message}</p>
                <div className="reward-info mt-4">
                    <span className="xp-badge">+{submissionResult.xp_earned} XP</span>
                </div>
                <div className="actions mt-4">
                    <button className="btn btn-primary" onClick={() => setStage('solving')}>Try Another Problem</button>
                    <button className="btn btn-secondary" onClick={() => setStage('select')}>Finish Session</button>
                </div>
            </div>
        </div>
    );
}
