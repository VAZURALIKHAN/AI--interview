import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import { Play, Check, Circle, ChevronLeft, ChevronRight, Lock, BookOpen, Bot, X, Award, Download, Map } from 'lucide-react';
import './CourseViewer.css';

export default function CourseViewer() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [lessonContent, setLessonContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(false);

    // AI State
    const [aiExplanation, setAiExplanation] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [progress, setProgress] = useState({
        completed_lessons: [],
        progress_percentage: 0,
        completed: false
    });

    useEffect(() => {
        loadCourseData();
    }, [courseId]);

    useEffect(() => {
        if (activeLesson) {
            loadLessonContent(activeLesson.id);
            setAiExplanation(null); // Reset AI on lesson change
        }
    }, [activeLesson]);

    const loadCourseData = async () => {
        try {
            setLoading(true);
            const [courseRes, progressRes] = await Promise.all([
                courseAPI.getById(courseId),
                courseAPI.getProgress(courseId)
            ]);

            setCourse(courseRes.data);
            setProgress(progressRes.data);

            // Set initial active lesson to first uncompleted lesson or the first lesson
            const firstUncompleted = courseRes.data.lessons.find(
                l => !progressRes.data.completed_lessons.includes(l.id)
            );

            setActiveLesson(firstUncompleted || courseRes.data.lessons[0]);

        } catch (error) {
            console.error("Failed to load course:", error);
            // navigate('/courses'); // Redirect if error
        } finally {
            setLoading(false);
        }
    };

    const loadLessonContent = async (lessonId) => {
        try {
            setContentLoading(true);
            const response = await courseAPI.getLesson(courseId, lessonId);
            setLessonContent(response.data);
        } catch (error) {
            console.error("Failed to load lesson content:", error);
        } finally {
            setContentLoading(false);
        }
    };

    const getAiExplanation = async () => {
        if (!activeLesson) return;
        try {
            setAiLoading(true);
            const response = await courseAPI.getExplanation(courseId, activeLesson.id);
            setAiExplanation(response.data.explanation);
        } catch (error) {
            console.error("Failed to get AI explanation:", error);
            alert("Could not fetch AI explanation. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    const handleLessonComplete = async () => {
        if (!activeLesson) return;

        // Optimistically update UI
        const isAlreadyCompleted = progress.completed_lessons.includes(activeLesson.id);
        if (isAlreadyCompleted) return; // Already completed

        try {
            console.log("Marking lesson as complete:", activeLesson.id);
            const response = await courseAPI.updateProgress(courseId, activeLesson.id, true);
            console.log("Progress updated successfully:", response.data);

            // Update local state by adding the lesson ID if not present
            setProgress(prev => {
                const newCompleted = [...prev.completed_lessons];
                if (!newCompleted.includes(activeLesson.id)) {
                    newCompleted.push(activeLesson.id);
                }
                return {
                    ...prev,
                    completed_lessons: newCompleted,
                    progress_percentage: response.data.progress_percentage,
                    completed: response.data.completed
                };
            });

        } catch (error) {
            console.error("Failed to update progress:", error);
            alert("Failed to save progress. Please try again.");
        }
    };

    const [certificate, setCertificate] = useState(null);
    const [certLoading, setCertLoading] = useState(false);

    useEffect(() => {
        if (progress.completed) {
            fetchCertificate();
        }
    }, [progress.completed]);

    const fetchCertificate = async () => {
        try {
            setCertLoading(true);
            const response = await courseAPI.getCertificate(courseId);
            setCertificate(response.data);
        } catch (error) {
            console.error("Failed to fetch certificate:", error);
        } finally {
            setCertLoading(false);
        }
    };

    if (loading || !course) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    const isLessonCompleted = (id) => progress.completed_lessons.includes(id);

    return (
        <div className="course-viewer fade-in">
            <div className="course-sidebar">
                <div className="sidebar-header">
                    <h3>{course.title}</h3>
                    <div className="progress-container">
                        <div className="progress-info">
                            <span>{progress.progress_percentage.toFixed(0)}% Complete</span>
                            <span>{progress.completed_lessons.length}/{course.total_lessons} Lessons</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${progress.progress_percentage}%` }}
                            ></div>
                        </div>
                        {progress.completed && (
                            <button
                                className="btn btn-primary btn-sm mt-3 w-100"
                                onClick={() => setActiveLesson('certificate')}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Award size={16} /> View Certificate
                            </button>
                        )}
                        <button
                            className="btn btn-ghost btn-sm mt-3 w-100"
                            onClick={() => navigate('/roadmaps')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', border: '1px solid var(--border-color)' }}
                        >
                            <Map size={16} /> Career Roadmaps
                        </button>
                    </div>
                </div>

                <div className="lesson-list">
                    {course.lessons.map((lesson, index) => (
                        <div
                            key={lesson.id}
                            className={`lesson-item ${activeLesson?.id === lesson.id ? 'active' : ''} ${isLessonCompleted(lesson.id) ? 'completed' : ''}`}
                            onClick={() => setActiveLesson(lesson)}
                        >
                            <div className="lesson-status">
                                {isLessonCompleted(lesson.id) ?
                                    <Check size={12} /> :
                                    activeLesson?.id === lesson.id ?
                                        <Play size={10} fill="currentColor" /> :
                                        <span style={{ fontSize: '0.7rem' }}>{index + 1}</span>
                                }
                            </div>
                            <div className="lesson-info">
                                <div className="lesson-title">{lesson.title}</div>
                                <div className="lesson-duration">{lesson.duration_minutes} min</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lesson-content">
                {activeLesson === 'certificate' ? (
                    <div className="certificate-view fade-in">
                        <div className="certificate-header">
                            <h1>Course Completed!</h1>
                            <p>Congratulations on mastering {course.title}. Here is your certificate of completion.</p>
                        </div>

                        {certLoading ? (
                            <div className="loading-container"><div className="spinner"></div></div>
                        ) : certificate ? (
                            <div className="certificate-container">
                                <div className="certificate-paper">
                                    <div className="cert-border">
                                        <div className="cert-header">
                                            <Award size={48} className="cert-icon" />
                                            <h2>Certificate of Completion</h2>
                                            <p className="cert-subtitle">This is to certify that</p>
                                        </div>
                                        <div className="cert-body">
                                            <h1 className="cert-name">{certificate.user_name}</h1>
                                            <p>has successfully completed the course</p>
                                            <h3 className="cert-course">{certificate.course_title}</h3>
                                            <p className="cert-details">
                                                Completed on {certificate.completed_at} • Duration: {certificate.duration_hours} Hours
                                            </p>
                                        </div>
                                        <div className="cert-footer">
                                            <div className="cert-signature">
                                                <div className="sig-line">AI Interview Prep Team</div>
                                                <p>Instructor</p>
                                            </div>
                                            <div className="cert-id">ID: {certificate.certificate_id}</div>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-primary mt-4" onClick={() => window.print()}>
                                    <Download size={20} style={{ marginRight: '0.5rem' }} /> Download Certificate
                                </button>
                            </div>
                        ) : (
                            <div className="error-state">
                                <p>Certificate details unavailable.</p>
                            </div>
                        )}
                    </div>
                ) : contentLoading ? (
                    <div className="loading-container"><div className="spinner"></div></div>
                ) : lessonContent ? (
                    <>
                        <div className="content-header">
                            <h1>{lessonContent.title}</h1>
                        </div>

                        {lessonContent.video_url && (
                            <div className="video-container">
                                {lessonContent.video_url.includes('youtube.com') || lessonContent.video_url.includes('youtu.be') ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={lessonContent.video_url.includes('watch?v=')
                                            ? lessonContent.video_url.replace('watch?v=', 'embed/')
                                            : lessonContent.video_url.replace('youtu.be/', 'youtube.com/embed/')}
                                        title={lessonContent.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <video
                                        src={lessonContent.video_url}
                                        controls
                                        style={{ width: '100%', borderRadius: 'var(--border-radius)' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>

                        )}

                        {/* AI Explain Button */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {!aiExplanation ? (
                                <button
                                    onClick={getAiExplanation}
                                    className="btn btn-secondary"
                                    disabled={aiLoading}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Bot size={18} />
                                    {aiLoading ? 'Asking AI...' : 'Ask AI to Explain This Topic'}
                                </button>
                            ) : (
                                <div className="ai-explanation-card" style={{
                                    background: 'var(--bg-tertiary)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--border-radius)',
                                    border: '1px solid var(--primary)',
                                    position: 'relative'
                                }}>
                                    <button
                                        onClick={() => setAiExplanation(null)}
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                                    >
                                        <X size={18} />
                                    </button>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0, color: 'var(--primary)' }}>
                                        <Bot size={20} /> AI Tutor Explanation
                                    </h4>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                        {aiExplanation}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lesson-body">
                            {lessonContent.content || "No text content available for this lesson."}
                        </div>

                        {/* Related Videos Section */}
                        <div className="related-videos-section">
                            <h3 className="section-title">Related Technical Content</h3>
                            <div className="related-videos-grid">
                                <div className="related-video-card">
                                    <iframe
                                        src="https://www.youtube.com/embed/9X7m_8Y4kSo"
                                        title="Mock Interview"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                    <p>Cracking The Coding Interview</p>
                                </div>
                                <div className="related-video-card">
                                    <iframe
                                        src="https://www.youtube.com/embed/Ssh7pD_IuIA"
                                        title="Roadmap"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                    <p>Interview Study Roadmap</p>
                                </div>
                                <div className="related-video-card">
                                    <iframe
                                        src="https://www.youtube.com/embed/ObeI9P0P52U"
                                        title="FAANG"
                                        frameBorder="0"
                                        allowFullScreen
                                    ></iframe>
                                    <p>System Design Overview</p>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                                    if (idx > 0) setActiveLesson(course.lessons[idx - 1]);
                                }}
                                disabled={course.lessons.findIndex(l => l.id === activeLesson?.id) === 0}
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>

                            {!isLessonCompleted(activeLesson.id) ? (
                                <button
                                    className="btn btn-primary complete-btn"
                                    onClick={handleLessonComplete}
                                >
                                    Mark as Complete <Check size={18} />
                                </button>
                            ) : (
                                <button
                                    className="btn btn-secondary complete-btn"
                                    onClick={() => {
                                        const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                                        if (idx < course.lessons.length - 1) setActiveLesson(course.lessons[idx + 1]);
                                        else setActiveLesson('certificate'); // Go to certificate if finished
                                    }}
                                >
                                    {course.lessons.findIndex(l => l.id === activeLesson.id) === course.lessons.length - 1 ? 'View Certificate' : 'Next Lesson'} <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="empty-state">Select a lesson to start learning</div>
                )}
            </div>
        </div >
    );
}
