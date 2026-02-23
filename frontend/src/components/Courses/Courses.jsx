import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { courseAPI } from '../../services/api';
import { BookOpen, Play, CheckCircle, Award } from 'lucide-react';
import './Courses.css';

export default function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all'); // 'all' or 'my'

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const [allRes, myRes] = await Promise.all([
                courseAPI.getAll(),
                courseAPI.getMyCourses()
            ]);
            setCourses(allRes.data.courses);
            setMyCourses(myRes.data.courses);
        } catch (error) {
            console.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const enrollCourse = async (courseId) => {
        try {
            await courseAPI.enroll(courseId);
            loadCourses();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to enroll');
        }
    };

    const unenrollCourse = async (courseId) => {
        if (!window.confirm('Are you sure you want to unenroll from this course? Your progress will be lost.')) {
            return;
        }
        try {
            await courseAPI.unenroll(courseId);
            loadCourses();
        } catch (error) {
            alert(error.response?.data?.detail || 'Failed to unenroll');
        }
    };

    if (loading) {
        return <div className="courses-loading"><div className="spinner"></div></div>;
    }

    const displayCourses = view === 'all' ? courses : myCourses;

    return (
        <div className="courses fade-in">
            <div className="courses-header">
                <div>
                    <h1 className="gradient-text"><BookOpen size={40} className="float-anim" /> Courses</h1>
                    <p>Learn and earn XP & certificates</p>
                </div>
                <div className="view-toggle">
                    <button
                        className={`btn ${view === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setView('all')}
                    >
                        All Courses
                    </button>
                    <button
                        className={`btn ${view === 'my' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setView('my')}
                    >
                        My Courses ({myCourses.length})
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/roadmaps')}
                    >
                        Career Roadmaps
                    </button>
                </div>
            </div>

            <div className="courses-grid" key={view}>
                {displayCourses.map((course, index) => (
                    <div key={course.id} className={`course-card card hover-lift fade-in stagger-${(index % 6) + 1}`}>
                        <div className="course-header">
                            <h3>{course.title}</h3>
                            <span className={`badge ${course.difficulty === 'Beginner' ? 'badge-success' :
                                course.difficulty === 'Intermediate' ? 'badge-warning' :
                                    'badge-error'
                                }`}>
                                {course.difficulty}
                            </span>
                        </div>

                        <p className="course-description">{course.description}</p>

                        <div className="course-meta">
                            <span><Play size={16} /> {course.total_lessons} lessons</span>
                            <span><Award size={16} /> {course.xp_reward} XP</span>
                        </div>

                        {view === 'my' ? (
                            <div className="course-progress">
                                <div className="flex justify-between mb-1">
                                    <span>Progress</span>
                                    <span>{course.progress_percentage?.toFixed(0)}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${course.progress_percentage}%` }}></div>
                                </div>
                                {course.completed && (
                                    <div className="completed-badge">
                                        <CheckCircle size={20} /> Completed!
                                    </div>
                                )}
                                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 2 }}
                                        onClick={() => navigate(`/courses/${course.id}`)}
                                    >
                                        Continue Learning
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1, padding: '0.5rem' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            unenrollCourse(course.id);
                                        }}
                                        title="Unenroll from course"
                                    >
                                        Unenroll
                                    </button>
                                </div>
                                <button
                                    className="btn btn-sm btn-ghost w-100 mt-2"
                                    onClick={() => navigate('/roadmaps')}
                                    style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}
                                >
                                    View Related Roadmap
                                </button>
                            </div>
                        ) : myCourses.some(c => c.id === course.id) ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <button
                                        className="btn btn-primary"
                                        style={{ flex: 2, filter: 'opacity(0.8)' }}
                                        disabled={true}
                                    >
                                        Enrolled
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ flex: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            unenrollCourse(course.id);
                                        }}
                                    >
                                        Unenroll
                                    </button>
                                </div>
                                <button
                                    className="btn btn-sm btn-ghost w-100"
                                    onClick={() => navigate('/roadmaps')}
                                    style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}
                                >
                                    View Related Roadmap
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => enrollCourse(course.id)}
                                    className="btn btn-primary w-100"
                                >
                                    Enroll Now
                                </button>
                                <button
                                    className="btn btn-sm btn-ghost w-100"
                                    onClick={() => navigate('/roadmaps')}
                                    style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}
                                >
                                    View Path Roadmap
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
