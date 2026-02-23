import { useState } from 'react';
import { Map, ChevronRight, CheckCircle, Circle, ArrowRight, User, Palette, BarChart, Globe, Briefcase, Shield, Video, Cloud } from 'lucide-react';
import './Roadmaps.css';

export default function Roadmaps() {
    const [selectedCategory, setSelectedCategory] = useState('Developer');
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);

    const roadmapData = {
        'Developer': [
            {
                title: 'Full Stack Developer',
                description: 'Master both frontend and backend technologies.',
                steps: ['HTML/CSS/JS', 'React/Vue', 'Node.js/Python', 'Databases (SQL/NoSQL)', 'Cloud & Deployment']
            },
            {
                title: 'Mobile App Developer',
                description: 'Build native and cross-platform mobile apps.',
                steps: ['Swift/Kotlin', 'React Native/Flutter', 'Mobile UI Patterns', 'State Management', 'App Store Deployment']
            },
            {
                title: 'DevOps Engineer',
                description: 'Bridge the gap between development and operations.',
                steps: ['Linux Basics', 'Docker & Kubernetes', 'CI/CD Pipelines', 'Cloud (AWS/Azure)', 'Infrastructure as Code']
            },
            {
                title: 'AI/ML Engineer',
                description: 'Build intelligent systems and models.',
                steps: ['Mathematics/Stats', 'Python for AI', 'Scikit-Learn/TensorFlow', 'Neural Networks', 'Model Deployment']
            },
            {
                title: 'Cybersecurity Developer',
                description: 'Focus on secure coding and infrastructure.',
                steps: ['Networking Basics', 'Cryptography', 'Secure Coding Practices', 'Penetration Testing', 'Security Compliance']
            }
        ],
        'Designer': [
            {
                title: 'UI/UX Designer',
                description: 'Create beautiful and functional user experiences.',
                steps: ['Design Principles', 'Figma/Adobe XD', 'User Research', 'Prototyping', 'Design Systems']
            },
            {
                title: 'Graphic Designer',
                description: 'Visual communication through various media.',
                steps: ['Typography', 'Color Theory', 'Adobe Illustrator/Photoshop', 'Branding', 'Print vs Digital']
            },
            {
                title: 'Motion Designer',
                description: 'Bring designs to life with animation.',
                steps: ['Animation Principles', 'After Effects', 'Keyframing', '3D Basics (Cinema 4D)', 'Video Editing']
            },
            {
                title: 'Product Designer',
                description: 'Holistic approach to creating digital products.',
                steps: ['Business Strategy', 'UX Research', 'Interface Design', 'Prototyping', 'Product Management Basics']
            },
            {
                title: 'Web Designer',
                description: 'Focus on designing for the web specifically.',
                steps: ['Responsive Design', 'Web Standards', 'CMS (WordPress/Webflow)', 'HTML/CSS for Designers', 'SEO Basics']
            }
        ],
        'Analyst': [
            {
                title: 'Data Analyst',
                description: 'Turn raw data into actionable insights.',
                steps: ['Excel Advanced', 'SQL', 'Data Visualization (Tableau/PowerBI)', 'Python/R for Data', 'Statistical Analysis']
            },
            {
                title: 'Business Analyst',
                description: 'Bridge business needs with technical solutions.',
                steps: ['Requirement Gathering', 'Process Mapping', 'Agile Methodologies', 'UML Diagrams', 'Stakeholder Management']
            },
            {
                title: 'Financial Analyst',
                description: 'Analyze financial data and trends.',
                steps: ['Financial Modeling', 'Accounting Basics', 'Valuation Methods', 'Corporate Finance', 'Investment Analysis']
            },
            {
                title: 'Cybersecurity Analyst',
                description: 'Monitor and protect organizational assets.',
                steps: ['SIEM Tools', 'Incident Response', 'Vulnerability Scanning', 'Network Monitoring', 'Security Frameworks']
            },
            {
                title: 'System Analyst',
                description: 'Optimize and design information systems.',
                steps: ['System Design', 'Database Structures', 'Software Lifecycle', 'Testing & QA', 'Technical Documentation']
            }
        ],
        'Digital Marketing': [
            {
                title: 'SEO Specialist',
                description: 'Improve search engine rankings and traffic.',
                steps: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Link Building', 'Google Analytics/Search Console']
            },
            {
                title: 'Content Marketer',
                description: 'Create and distribute valuable content.',
                steps: ['Copywriting', 'Content Strategy', 'Video Production', 'Blogging', 'Engagement Metrics']
            },
            {
                title: 'Social Media Manager',
                description: 'Manage brand presence on social platforms.',
                steps: ['Platform Strategies', 'Community Management', 'Paid Social Ads', 'Content Calendars', 'Influence Marketing']
            },
            {
                title: 'PPC Expert',
                description: 'Manage paid search and display campaigns.',
                steps: ['Google Ads', 'Facebook Ads', 'Conversion Tracking', 'Ad Copy Optimization', 'Budget Management']
            },
            {
                title: 'Email Marketer',
                description: 'Drive engagement through email campaigns.',
                steps: ['List Building', 'Segmenting', 'A/B Testing', 'Automation Flows', 'Deliverability Optimization']
            }
        ],
        'Management': [
            {
                title: 'Product Manager',
                description: 'Manage the lifecycle of a product from ideation to launch.',
                steps: ['Market Research', 'Product Strategy', 'Agile/Scrum', 'Stakeholder Management', 'Data-Driven Decision Making']
            },
            {
                title: 'Project Manager',
                description: 'Deliver projects on time, within scope, and on budget.',
                steps: ['Project Planning', 'Risk Management', 'Resource Allocation', 'Budgeting', 'Communication Skills']
            },
            {
                title: 'HR Specialist',
                description: 'Manage talent acquisition and employee relations.',
                steps: ['Recruitment', 'Onboarding', 'Performance Management', 'Labor Laws', 'Employee Engagement']
            },
            {
                title: 'Sales Manager',
                description: 'Drive revenue growth through strategic sales.',
                steps: ['Lead Generation', 'Sales Funnels', 'Negotiation', 'CRM Tools', 'Team Leadership']
            }
        ],
        'Security': [
            {
                title: 'Ethical Hacker',
                description: 'Identify vulnerabilities to strengthen security.',
                steps: ['Linux & Networking', 'Penetration Testing', 'Web App Security', 'Kali Linux', 'Security Certifications']
            },
            {
                title: 'Security Architect',
                description: 'Design and build resilient security infrastructures.',
                steps: ['Network Architecture', 'Access Control', 'Identity Management', 'Security Protocols', 'Disaster Recovery']
            },
            {
                title: 'SOC Analyst',
                description: 'Monitor and respond to security threats in real-time.',
                steps: ['SIEM Tools', 'Log Analysis', 'Incident Response', 'Threat Intelligence', 'Vulnerability Management']
            }
        ],
        'Content': [
            {
                title: 'Video Editor',
                description: 'Tell compelling stories through visual editing.',
                steps: ['Adobe Premiere/Final Cut', 'Color Grading', 'Sound Design', 'Storytelling', 'VFX Basics']
            },
            {
                title: 'Technical Writer',
                description: 'Create clear documentation for complex products.',
                steps: ['Clear Writing', 'API Documentation', 'Markdown/DITA', 'Audience Analysis', 'Technical Literacy']
            },
            {
                title: 'Content Strategist',
                description: 'Plan and manage content across all platforms.',
                steps: ['Content Audits', 'SEO Strategy', 'Brand Voice', 'Analytics', 'Editorial Calendars']
            }
        ]
    };

    const categories = [
        { name: 'Developer', icon: <Globe size={20} /> },
        { name: 'Designer', icon: <Palette size={20} /> },
        { name: 'Analyst', icon: <BarChart size={20} /> },
        { name: 'Digital Marketing', icon: <User size={20} /> },
        { name: 'Management', icon: <Briefcase size={20} /> },
        { name: 'Security', icon: <Shield size={20} /> },
        { name: 'Content', icon: <Video size={20} /> }
    ];

    return (
        <div className="roadmaps-container fade-in">
            <div className="roadmaps-header">
                <h1 className="gradient-text">Career Roadmaps</h1>
                <p>Follow these step-by-step guides to master your chosen career path.</p>
            </div>

            <div className="category-tabs glass-card">
                {categories.map(cat => (
                    <button
                        key={cat.name}
                        className={`tab-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(cat.name);
                            setSelectedRoadmap(null);
                        }}
                    >
                        {cat.icon}
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="roadmaps-content">
                {!selectedRoadmap ? (
                    <div className="roadmaps-grid">
                        {roadmapData[selectedCategory].map((roadmap, index) => (
                            <div
                                key={index}
                                className="roadmap-card card hover-lift fade-in stagger-1"
                                onClick={() => setSelectedRoadmap(roadmap)}
                            >
                                <h3>{roadmap.title}</h3>
                                <p>{roadmap.description}</p>
                                <div className="card-footer">
                                    <span>{roadmap.steps.length} Key Milestones</span>
                                    <button className="btn btn-sm btn-primary">
                                        View Details <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="roadmap-details fade-in">
                        <button className="back-btn" onClick={() => setSelectedRoadmap(null)}>
                            <ArrowRight style={{ transform: 'rotate(180deg)' }} /> Back to {selectedCategory}
                        </button>

                        <div className="details-header">
                            <h2>{selectedRoadmap.title}</h2>
                            <p>{selectedRoadmap.description}</p>
                        </div>

                        <div className="steps-timeline">
                            {selectedRoadmap.steps.map((step, index) => (
                                <div key={index} className="step-item fade-in stagger-1">
                                    <div className="step-marker">
                                        {index === 0 ? <CheckCircle className="text-primary" /> : <Circle className="text-secondary" />}
                                        {index < selectedRoadmap.steps.length - 1 && <div className="step-connector"></div>}
                                    </div>
                                    <div className="step-content glass-card">
                                        <h4>Step {index + 1}: {step}</h4>
                                        <p>Learn the fundamentals and gain practical experience in this area.</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="action-footer mt-4">
                            <button className="btn btn-primary btn-large">
                                Start Learning This Path
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
