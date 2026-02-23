import { useState, useEffect } from 'react';
import { practiceAPI } from '../../services/api';
import { Bug, ChevronLeft, ChevronRight, Play, CheckCircle, RefreshCcw, HelpCircle, ShieldAlert } from 'lucide-react';
import './Coding.css';

export default function BugFixing() {
    const [stage, setStage] = useState('select'); // select, solving, results
    const [difficulty, setDifficulty] = useState('Medium');
    const [category, setCategory] = useState('Logic Error');
    const [problems, setProblems] = useState([]);
    const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('JavaScript');
    const [loading, setLoading] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    const categories = ['Logic Error', 'Syntax Error', 'Security Vuln', 'Performance Issue', 'API Bug'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const languages = ['JavaScript', 'Python', 'Java', 'C++', 'ruby', 'php'];

    const startPractice = async () => {
        setLoading(true);
        try {
            // Using the same endpoint but with Bug Fixing category
            const response = await practiceAPI.getCodingProblems(`Bug Fixing: ${category}`, difficulty, language);
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
            await practiceAPI.submitCodingSolution({
                problem_id: problems[currentProblemIdx].title,
                code: code,
                language: language,
                type: 'Bug Fix'
            });
            setSubmissionResult({
                success: true,
                message: 'Bug Squashed! All tests passed and code is stable.',
                xp_earned: 30
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
                    <Bug size={40} className="text-secondary" />
                    <div>
                        <h1>Bug Fixing Practice</h1>
                        <p>Identify and resolve bugs in real-world code snippets.</p>
                    </div>
                </div>

                <div className="practice-config card glass-card mt-4">
                    <h3>Configure Bug Session</h3>
                    <div className="config-grid">
                        <div className="form-group">
                            <label>Bug Type</label>
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
                            <label>Language</label>
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
                        {loading ? <div className="spinner"></div> : 'Start Debugging'}
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
                        <span className="badge badge-error">BUG</span>
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
                        <h3>Bug Report</h3>
                        <p>{problem.description}</p>

                        <h4>Evidence</h4>
                        <div className="examples-list">
                            {problem.examples?.map((ex, i) => (
                                <div key={i} className="example-box error-box">
                                    <p><strong>Input:</strong> {ex.input}</p>
                                    <p><strong>Actual Error:</strong> <code>{ex.output}</code></p>
                                    <p><strong>Expected:</strong> {ex.explanation}</p>
                                </div>
                            ))}
                        </div>

                        <div className="alert-box warning mt-4">
                            <ShieldAlert size={20} />
                            <span>Fix the underlying issue without breaking secondary logic.</span>
                        </div>
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
                            <button className="btn btn-secondary" disabled={loading}>Run Tests</button>
                            <button className="btn btn-primary" onClick={submitSolution} disabled={loading}>
                                {loading ? <div className="spinner"></div> : <><Play size={16} /> Deploy Fix</>}
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
                <h1>Bug Resolved!</h1>
                <p>{submissionResult.message}</p>
                <div className="reward-info mt-4">
                    <span className="xp-badge">+{submissionResult.xp_earned} XP</span>
                </div>
                <div className="actions mt-4">
                    <button className="btn btn-primary" onClick={() => setStage('solving')}>Find Another Bug</button>
                    <button className="btn btn-secondary" onClick={() => setStage('select')}>Mission Accomplished</button>
                </div>
            </div>
        </div>
    );
}
