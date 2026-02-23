import { useState } from 'react';
import { resumeAPI } from '../../services/api';
import {
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    TrendingUp,
    Award,
    AlertCircle,
    Search,
    Target,
    ThumbsUp,
    ThumbsDown,
    BarChart3
} from 'lucide-react';
import './Resume.css';

export default function Resume() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.pdf') || selectedFile.name.endsWith('.docx'))) {
            setFile(selectedFile);
        } else {
            alert('Please select a PDF or DOCX file');
        }
    };

    const uploadResume = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const res = await resumeAPI.upload(file);
            setAnalysis(res.data.analysis);
        } catch (error) {
            alert('Upload failed: ' + (error.response?.data?.detail || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="resume fade-in">
            <div className="resume-header">
                <FileText size={40} className="header-icon" />
                <div>
                    <h1 className="gradient-text">AI Resume Analyzer</h1>
                    <p>Get comprehensive AI-powered feedback on your resume with ATS compatibility analysis</p>
                </div>
            </div>

            {!analysis ? (
                <div className="upload-section card">
                    <div className="upload-area">
                        <Upload size={48} />
                        <h3>Upload Your Resume</h3>
                        <p>Supports PDF and DOCX formats • Get instant AI analysis</p>
                        <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="file-input" />
                        {file && <p className="file-name">✓ Selected: {file.name}</p>}
                    </div>
                    <button onClick={uploadResume} disabled={!file || uploading} className="btn btn-primary btn-large">
                        {uploading ? (
                            <>
                                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Search size={20} />
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="analysis-results">
                    {/* ATS Score Section */}
                    <div className="ats-summary card hover-lift">
                        <div className="ats-header">
                            <h2><Award size={28} /> ATS Compatibility Score</h2>
                            <div className={`ats-badge ${analysis.ats_friendly ? 'badge-success' : 'badge-warning'}`}>
                                {analysis.ats_friendly ? '✓ ATS Friendly' : '⚠ Needs Improvement'}
                            </div>
                        </div>

                        <div className="ats-score-main">
                            <div className={`score-circle ${analysis.ats_score >= 75 ? 'good' : 'improve'}`}>
                                <span className="score-value">{analysis.ats_score}</span>
                                <span className="score-label">/ 100</span>
                            </div>
                            <div className="ats-description">
                                <p>{analysis.ats_analysis?.overall_feedback || "Your resume has been analyzed for ATS compatibility."}</p>
                            </div>
                        </div>

                        {/* ATS Breakdown */}
                        {analysis.ats_analysis && (
                            <div className="ats-breakdown">
                                <h3>Detailed ATS Breakdown</h3>
                                <div className="breakdown-grid">
                                    <div className="breakdown-item">
                                        <div className="breakdown-label">
                                            <BarChart3 size={16} />
                                            Formatting
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${analysis.ats_analysis.formatting_score}%` }}></div>
                                        </div>
                                        <span className="breakdown-score">{analysis.ats_analysis.formatting_score}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <div className="breakdown-label">
                                            <Target size={16} />
                                            Keywords
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${analysis.ats_analysis.keyword_optimization}%` }}></div>
                                        </div>
                                        <span className="breakdown-score">{analysis.ats_analysis.keyword_optimization}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <div className="breakdown-label">
                                            <FileText size={16} />
                                            Structure
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${analysis.ats_analysis.structure_score}%` }}></div>
                                        </div>
                                        <span className="breakdown-score">{analysis.ats_analysis.structure_score}%</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <div className="breakdown-label">
                                            <CheckCircle size={16} />
                                            Readability
                                        </div>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${analysis.ats_analysis.readability_score}%` }}></div>
                                        </div>
                                        <span className="breakdown-score">{analysis.ats_analysis.readability_score}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Two-Column Layout for Positive/Negative */}
                    <div className="feedback-grid">
                        {/* Positive Points */}
                        <div className="card feedback-card positive-card">
                            <h3 className="feedback-title">
                                <ThumbsUp size={24} className="positive-icon" />
                                What's Working Well
                            </h3>
                            {analysis.positive_points && analysis.positive_points.length > 0 ? (
                                <ul className="feedback-list positive-list">
                                    {analysis.positive_points.map((point, i) => (
                                        <li key={i}>
                                            <CheckCircle size={18} className="list-icon" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-message">No specific positive points identified</p>
                            )}
                        </div>

                        {/* Negative Points */}
                        <div className="card feedback-card negative-card">
                            <h3 className="feedback-title">
                                <ThumbsDown size={24} className="negative-icon" />
                                Areas for Improvement
                            </h3>
                            {analysis.negative_points && analysis.negative_points.length > 0 ? (
                                <ul className="feedback-list negative-list">
                                    {analysis.negative_points.map((point, i) => (
                                        <li key={i}>
                                            <AlertCircle size={18} className="list-icon" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="empty-message">No specific issues identified</p>
                            )}
                        </div>
                    </div>

                    {/* Keywords Section */}
                    <div className="keywords-section">
                        <div className="card keywords-card">
                            <h3><Target size={24} /> Keywords Analysis</h3>
                            <div className="keywords-grid">
                                <div className="keywords-found">
                                    <h4 className="positive-text">✓ Keywords Found</h4>
                                    <div className="keyword-tags">
                                        {analysis.keywords_found && analysis.keywords_found.length > 0 ? (
                                            analysis.keywords_found.map((keyword, i) => (
                                                <span key={i} className="keyword-tag success">{keyword}</span>
                                            ))
                                        ) : (
                                            <p className="text-tertiary">No keywords tracked</p>
                                        )}
                                    </div>
                                </div>
                                <div className="keywords-missing">
                                    <h4 className="warning-text">⚠ Consider Adding</h4>
                                    <div className="keyword-tags">
                                        {analysis.keywords_missing && analysis.keywords_missing.length > 0 ? (
                                            analysis.keywords_missing.map((keyword, i) => (
                                                <span key={i} className="keyword-tag warning">{keyword}</span>
                                            ))
                                        ) : (
                                            <p className="text-tertiary">All key keywords present</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Sections */}
                    <div className="additional-info">
                        <div className="card">
                            <h3><CheckCircle size={24} /> Overall Strengths</h3>
                            <ul className="simple-list">
                                {analysis.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>

                        <div className="card">
                            <h3><TrendingUp size={24} /> Actionable Improvements</h3>
                            <ul className="simple-list">
                                {analysis.improvements?.map((imp, i) => <li key={i}>{imp}</li>)}
                            </ul>
                        </div>

                        {analysis.missing_sections && analysis.missing_sections.length > 0 && (
                            <div className="card">
                                <h3><XCircle size={24} /> Missing Sections</h3>
                                <ul className="simple-list">
                                    {analysis.missing_sections.map((section, i) => (
                                        <li key={i}>{section}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="card">
                            <h3><FileText size={24} /> Summary</h3>
                            <div className="summary-stats">
                                <div className="stat-box">
                                    <p className="stat-label">Skills Detected</p>
                                    <p className="stat-value">{analysis.skills?.length || 0}</p>
                                </div>
                                <div className="stat-box">
                                    <p className="stat-label">Experience Level</p>
                                    <p className="stat-value">{analysis.experience_years || 0} years</p>
                                </div>
                            </div>
                            {analysis.skills && analysis.skills.length > 0 && (
                                <div className="skills-tags">
                                    {analysis.skills.map((skill, i) => (
                                        <span key={i} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={() => { setAnalysis(null); setFile(null); }} className="btn btn-primary btn-large">
                        <Upload size={20} />
                        Analyze Another Resume
                    </button>
                </div>
            )}
        </div>
    );
}
