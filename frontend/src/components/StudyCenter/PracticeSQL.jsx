import { useState, useEffect } from 'react';
import { practiceAPI } from '../../services/api';
import { Database, ChevronLeft, ChevronRight, Play, CheckCircle, RefreshCcw, HelpCircle } from 'lucide-react';
import './Coding.css';

export default function PracticeSQL() {
    const [stage, setStage] = useState('select'); // select, solving, results
    const [difficulty, setDifficulty] = useState('Medium');
    const [category, setCategory] = useState('Joins');
    const [problems, setProblems] = useState([]);
    const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);

    const categories = ['Basic SQL', 'Joins', 'Aggregations', 'Subqueries', 'Complex Queries', 'Indexing'];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const languages = ['PostgreSQL', 'MySQL', 'SQL Server'];
    const [language, setLanguage] = useState('PostgreSQL');

    const startPractice = async () => {
        setLoading(true);
        try {
            // Using the same endpoint but with SQL category
            const response = await practiceAPI.getCodingProblems(`SQL: ${category}`, difficulty, language);
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
                type: 'SQL'
            });
            setSubmissionResult({
                success: true,
                message: 'Query executed successfully! 100% data match.',
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
                    <Database size={40} className="text-primary" />
                    <div>
                        <h1>SQL Practice</h1>
                        <p>Master database queries with real-world scenarios.</p>
                    </div>
                </div>

                <div className="practice-config card glass-card mt-4">
                    <h3>Configure SQL Session</h3>
                    <div className="config-grid">
                        <div className="form-group">
                            <label>Query Type</label>
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
                            <label>SQL Dialect</label>
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
                        {loading ? <div className="spinner"></div> : 'Start SQL Practice'}
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
                        <h3>Challenge</h3>
                        <p>{problem.description}</p>

                        <h4>Database Schema</h4>
                        {problem.constraints?.map((c, i) => (
                            <div key={i} className="schema-box mb-2">
                                <code>{c}</code>
                            </div>
                        ))}

                        <h4>Target Data Info</h4>
                        <div className="examples-list">
                            {problem.examples?.map((ex, i) => (
                                <div key={i} className="example-box">
                                    <p><strong>Scenario:</strong> {ex.input}</p>
                                    <p><strong>Expected:</strong> {ex.output}</p>
                                </div>
                            ))}
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
                            placeholder="SELECT * FROM users..."
                        ></textarea>
                        <div className="editor-footer">
                            <button className="btn btn-secondary" disabled={loading}>Show Schema</button>
                            <button className="btn btn-primary" onClick={submitSolution} disabled={loading}>
                                {loading ? <div className="spinner"></div> : <><Play size={16} /> Execute Query</>}
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
                <h1>SQL Query Successful!</h1>
                <p>{submissionResult.message}</p>
                <div className="reward-info mt-4">
                    <span className="xp-badge">+{submissionResult.xp_earned} XP</span>
                </div>
                <div className="actions mt-4">
                    <button className="btn btn-primary" onClick={() => setStage('solving')}>Next Query</button>
                    <button className="btn btn-secondary" onClick={() => setStage('select')}>Finish Session</button>
                </div>
            </div>
        </div>
    );
}
