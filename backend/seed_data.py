"""
Script to seed the database with sample data
Run this with: python seed_data.py
"""
import sys
import os
from sqlalchemy.orm import Session

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine
from app.models.models import Course, Lesson, FAQ, Base

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_courses(db: Session):
    """Seed courses and lessons"""
    
    # Clear existing courses
    db.query(Course).delete()
    db.query(Lesson).delete()
    
    courses_data = [
        # Core Programming (10 courses)
        {
            "title": "Data Structures & Algorithms Masterclass",
            "description": "Master fundamental data structures and algorithms essential for coding interviews at top tech companies",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 15,
            "duration_hours": 25,
            "xp_reward": 250,
            "thumbnail": "/courses/dsa.jpg"
        },
        {
            "title": "Python Programming for Interviews",
            "description": "Deep dive into Python for technical interviews with hands-on practice",
            "category": "Programming",
            "difficulty": "Beginner",
            "total_lessons": 18,
            "duration_hours": 30,
            "xp_reward": 200,
            "thumbnail": "/courses/python.jpg"
        },
        {
            "title": "JavaScript & Web Development",
            "description": "Complete JavaScript course covering ES6+, async programming, and web APIs",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 20,
            "duration_hours": 35,
            "xp_reward": 280,
            "thumbnail": "/courses/javascript.jpg"
        },
        {
            "title": "Java Enterprise Development",
            "description": "Master Java for enterprise applications and Spring Boot framework",
            "category": "Programming",
            "difficulty": "Advanced",
            "total_lessons": 25,
            "duration_hours": 45,
            "xp_reward": 350,
            "thumbnail": "/courses/java.jpg"
        },
        {
            "title": "C++ Advanced Programming",
            "description": "Advanced C++ concepts including STL, memory management, and design patterns",
            "category": "Programming",
            "difficulty": "Advanced",
            "total_lessons": 22,
            "duration_hours": 38,
            "xp_reward": 320,
            "thumbnail": "/courses/cpp.jpg"
        },
        {
            "title": "Go Programming Essentials",
            "description": "Learn Go for building scalable backend services and microservices",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 16,
            "duration_hours": 28,
            "xp_reward": 240,
            "thumbnail": "/courses/golang.jpg"
        },
        {
            "title": "Rust Systems Programming",
            "description": "Master Rust for safe and concurrent systems programming",
            "category": "Programming",
            "difficulty": "Advanced",
            "total_lessons": 20,
            "duration_hours": 36,
            "xp_reward": 340,
            "thumbnail": "/courses/rust.jpg"
        },
        {
            "title": "TypeScript Full Course",
            "description": "Type-safe JavaScript development with TypeScript for large applications",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 15,
            "duration_hours": 26,
            "xp_reward": 230,
            "thumbnail": "/courses/typescript.jpg"
        },
        {
            "title": "Kotlin for Android Development",
            "description": "Modern Android development with Kotlin and Jetpack Compose",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 24,
            "duration_hours": 42,
            "xp_reward": 310,
            "thumbnail": "/courses/kotlin.jpg"
        },
        {
            "title": "Swift iOS Development",
            "description": "Build iOS applications with Swift and SwiftUI",
            "category": "Programming",
            "difficulty": "Intermediate",
            "total_lessons": 23,
            "duration_hours": 40,
            "xp_reward": 300,
            "thumbnail": "/courses/swift.jpg"
        },
        
        # Web Development (8 courses)
        {
            "title": "React & Frontend Development",
            "description": "Build modern web applications with React, hooks, and state management",
            "category": "Web Development",
            "difficulty": "Intermediate",
            "total_lessons": 22,
            "duration_hours": 40,
            "xp_reward": 300,
            "thumbnail": "/courses/react.jpg"
        },
        {
            "title": "Vue.js Complete Guide",
            "description": "Comprehensive Vue.js course with Composition API and Vuex",
            "category": "Web Development",
            "difficulty": "Intermediate",
            "total_lessons": 19,
            "duration_hours": 34,
            "xp_reward": 270,
            "thumbnail": "/courses/vuejs.jpg"
        },
        {
            "title": "Angular Enterprise Applications",
            "description": "Build large-scale applications with Angular and RxJS",
            "category": "Web Development",
            "difficulty": "Advanced",
            "total_lessons": 26,
            "duration_hours": 46,
            "xp_reward": 360,
            "thumbnail": "/courses/angular.jpg"
        },
        {
            "title": "Node.js Backend Development",
            "description": "Server-side JavaScript with Express, MongoDB, and authentication",
            "category": "Web Development",
            "difficulty": "Intermediate",
            "total_lessons": 21,
            "duration_hours": 37,
            "xp_reward": 285,
            "thumbnail": "/courses/nodejs.jpg"
        },
        {
            "title": "Full Stack Web Development",
            "description": "Complete MERN stack development from frontend to backend",
            "category": "Web Development",
            "difficulty": "Advanced",
            "total_lessons": 30,
            "duration_hours": 55,
            "xp_reward": 400,
            "thumbnail": "/courses/fullstack.jpg"
        },
        {
            "title": "GraphQL API Development",
            "description": "Build modern APIs with GraphQL, Apollo, and best practices",
            "category": "Web Development",
            "difficulty": "Advanced",
            "total_lessons": 17,
            "duration_hours": 30,
            "xp_reward": 260,
            "thumbnail": "/courses/graphql.jpg"
        },
        {
            "title": "Next.js & Server Components",
            "description": "Modern React framework with SSR, SSG, and server components",
            "category": "Web Development",
            "difficulty": "Advanced",
            "total_lessons": 20,
            "duration_hours": 36,
            "xp_reward": 310,
            "thumbnail": "/courses/nextjs.jpg"
        },
        {
            "title": "Web Performance Optimization",
            "description": "Optimize web applications for speed and user experience",
            "category": "Web Development",
            "difficulty": "Advanced",
            "total_lessons": 14,
            "duration_hours": 24,
            "xp_reward": 220,
            "thumbnail": "/courses/webperf.jpg"
        },
        
        # Data Science & AI (10 courses)
        {
            "title": "Machine Learning Interview Prep",
            "description": "ML algorithms, model evaluation, and interview questions for data science roles",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 16,
            "duration_hours": 28,
            "xp_reward": 350,
            "thumbnail": "/courses/ml.jpg"
        },
        {
            "title": "Deep Learning with PyTorch",
            "description": "Neural networks, CNNs, RNNs, and transformers with PyTorch",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 24,
            "duration_hours": 44,
            "xp_reward": 380,
            "thumbnail": "/courses/pytorch.jpg"
        },
        {
            "title": "TensorFlow & Keras Masterclass",
            "description": "Build and deploy deep learning models with TensorFlow 2.0",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 22,
            "duration_hours": 40,
            "xp_reward": 370,
            "thumbnail": "/courses/tensorflow.jpg"
        },
        {
            "title": "Natural Language Processing",
            "description": "NLP techniques, transformers, and large language models",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 20,
            "duration_hours": 38,
            "xp_reward": 350,
            "thumbnail": "/courses/nlp.jpg"
        },
        {
            "title": "Computer Vision Deep Dive",
            "description": "Image processing, object detection, and segmentation",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 21,
            "duration_hours": 39,
            "xp_reward": 360,
            "thumbnail": "/courses/cv.jpg"
        },
        {
            "title": "Data Analysis with Pandas",
            "description": "Data manipulation, cleaning, and analysis using Python Pandas",
            "category": "Data Science",
            "difficulty": "Beginner",
            "total_lessons": 15,
            "duration_hours": 25,
            "xp_reward": 200,
            "thumbnail": "/courses/pandas.jpg"
        },
        {
            "title": "Data Visualization Mastery",
            "description": "Create stunning visualizations with Matplotlib, Seaborn, and Plotly",
            "category": "Data Science",
            "difficulty": "Intermediate",
            "total_lessons": 14,
            "duration_hours": 23,
            "xp_reward": 210,
            "thumbnail": "/courses/dataviz.jpg"
        },
        {
            "title": "Statistical Analysis for Data Science",
            "description": "Statistical methods, hypothesis testing, and A/B testing",
            "category": "Data Science",
            "difficulty": "Intermediate",
            "total_lessons": 18,
            "duration_hours": 32,
            "xp_reward": 270,
            "thumbnail": "/courses/stats.jpg"
        },
        {
            "title": "Big Data with Spark",
            "description": "Process large-scale data with Apache Spark and PySpark",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 19,
            "duration_hours": 35,
            "xp_reward": 320,
            "thumbnail": "/courses/spark.jpg"
        },
        {
            "title": "MLOps & Model Deployment",
            "description": "Deploy and monitor ML models in production environments",
            "category": "Data Science",
            "difficulty": "Advanced",
            "total_lessons": 17,
            "duration_hours": 31,
            "xp_reward": 290,
            "thumbnail": "/courses/mlops.jpg"
        },
        
        # Cloud & DevOps (7 courses)
        {
            "title": "Cloud Computing with AWS",
            "description": "Master AWS services, deployment, and cloud architecture patterns",
            "category": "Cloud",
            "difficulty": "Advanced",
            "total_lessons": 18,
            "duration_hours": 32,
            "xp_reward": 320,
            "thumbnail": "/courses/aws.jpg"
        },
        {
            "title": "Microsoft Azure Fundamentals",
            "description": "Azure cloud services, virtual machines, and app services",
            "category": "Cloud",
            "difficulty": "Intermediate",
            "total_lessons": 16,
            "duration_hours": 29,
            "xp_reward": 260,
            "thumbnail": "/courses/azure.jpg"
        },
        {
            "title": "Google Cloud Platform",
            "description": "GCP services, Kubernetes Engine, and cloud functions",
            "category": "Cloud",
            "difficulty": "Intermediate",
            "total_lessons": 17,
            "duration_hours": 30,
            "xp_reward": 270,
            "thumbnail": "/courses/gcp.jpg"
        },
        {
            "title": "DevOps & CI/CD Pipeline",
            "description": "Learn Docker, Kubernetes, Jenkins, and modern DevOps practices",
            "category": "DevOps",
            "difficulty": "Advanced",
            "total_lessons": 15,
            "duration_hours": 26,
            "xp_reward": 280,
            "thumbnail": "/courses/devops.jpg"
        },
        {
            "title": "Docker & Containerization",
            "description": "Container technologies and orchestration with Docker",
            "category": "DevOps",
            "difficulty": "Intermediate",
            "total_lessons": 13,
            "duration_hours": 22,
            "xp_reward": 230,
            "thumbnail": "/courses/docker.jpg"
        },
        {
            "title": "Kubernetes Administration",
            "description": "Deploy and manage applications on Kubernetes clusters",
            "category": "DevOps",
            "difficulty": "Advanced",
            "total_lessons": 20,
            "duration_hours": 37,
            "xp_reward": 330,
            "thumbnail": "/courses/kubernetes.jpg"
        },
        {
            "title": "Terraform Infrastructure as Code",
            "description": "Automate infrastructure provisioning with Terraform",
            "category": "DevOps",
            "difficulty": "Advanced",
            "total_lessons": 14,
            "duration_hours": 25,
            "xp_reward": 250,
            "thumbnail": "/courses/terraform.jpg"
        },
        
        # Database & Backend (5 courses)
        {
            "title": "Database Design & SQL Mastery",
            "description": "Learn database design, normalization, and master SQL queries",
            "category": "Database",
            "difficulty": "Intermediate",
            "total_lessons": 14,
            "duration_hours": 22,
            "xp_reward": 220,
            "thumbnail": "/courses/sql.jpg"
        },
        {
            "title": "MongoDB & NoSQL Databases",
            "description": "Document databases, data modeling, and aggregation pipelines",
            "category": "Database",
            "difficulty": "Intermediate",
            "total_lessons": 15,
            "duration_hours": 26,
            "xp_reward": 240,
            "thumbnail": "/courses/mongodb.jpg"
        },
        {
            "title": "PostgreSQL Advanced Techniques",
            "description": "Advanced PostgreSQL features and performance tuning",
            "category": "Database",
            "difficulty": "Advanced",
            "total_lessons": 16,
            "duration_hours": 28,
            "xp_reward": 270,
            "thumbnail": "/courses/postgresql.jpg"
        },
        {
            "title": "Redis & Caching Strategies",
            "description": "In-memory data structures and caching for high performance",
            "category": "Database",
            "difficulty": "Intermediate",
            "total_lessons": 12,
            "duration_hours": 20,
            "xp_reward": 200,
            "thumbnail": "/courses/redis.jpg"
        },
        {
            "title": "Microservices Architecture",
            "description": "Design and build scalable microservices-based applications",
            "category": "System Design",
            "difficulty": "Advanced",
            "total_lessons": 22,
            "duration_hours": 41,
            "xp_reward": 370,
            "thumbnail": "/courses/microservices.jpg"
        },
        
        # System Design & Soft Skills (5 courses)
        {
            "title": "System Design for Interviews",
            "description": "Learn to design scalable distributed systems like Instagram, Netflix, and Uber",
            "category": "System Design",
            "difficulty": "Advanced",
            "total_lessons": 12,
            "duration_hours": 20,
            "xp_reward": 300,
            "thumbnail": "/courses/system-design.jpg"
        },
        {
            "title": "Behavioral Interview Excellence",
            "description": "Master the STAR method and ace behavioral interviews with confidence",
            "category": "Soft Skills",
            "difficulty": "Beginner",
            "total_lessons": 10,
            "duration_hours": 8,
            "xp_reward": 150,
            "thumbnail": "/courses/behavioral.jpg"
        },
        {
            "title": "Technical Communication Skills",
            "description": "Improve your ability to explain complex technical concepts clearly",
            "category": "Soft Skills",
            "difficulty": "Beginner",
            "total_lessons": 9,
            "duration_hours": 12,
            "xp_reward": 130,
            "thumbnail": "/courses/communication.jpg"
        },
        {
            "title": "Leadership & Team Management",
            "description": "Develop leadership skills for tech team management",
            "category": "Soft Skills",
            "difficulty": "Intermediate",
            "total_lessons": 11,
            "duration_hours": 18,
            "xp_reward": 180,
            "thumbnail": "/courses/leadership.jpg"
        },
        {
            "title": "Problem Solving & Critical Thinking",
            "description": "Advanced problem-solving techniques for technical interviews",
            "category": "Soft Skills",
            "difficulty": "Intermediate",
            "total_lessons": 13,
            "duration_hours": 21,
            "xp_reward": 190,
            "thumbnail": "/courses/problemsolving.jpg"
        },
        
        # Security & Testing (5 courses)
        {
            "title": "Cybersecurity Fundamentals",
            "description": "Learn security principles, common vulnerabilities, and best practices",
            "category": "Security",
            "difficulty": "Intermediate",
            "total_lessons": 16,
            "duration_hours": 28,
            "xp_reward": 260,
            "thumbnail": "/courses/security.jpg"
        },
        {
            "title": "Ethical Hacking & Penetration Testing",
            "description": "Security testing, vulnerability assessment, and penetration testing",
            "category": "Security",
            "difficulty": "Advanced",
            "total_lessons": 20,
            "duration_hours": 38,
            "xp_reward": 340,
            "thumbnail": "/courses/pentest.jpg"
        },
        {
            "title": "Application Security (OWASP)",
            "description": "Secure coding practices and OWASP Top 10 vulnerabilities",
            "category": "Security",
            "difficulty": "Intermediate",
            "total_lessons": 14,
            "duration_hours": 24,
            "xp_reward": 240,
            "thumbnail": "/courses/appsec.jpg"
        },
        {
            "title": "Test-Driven Development",
            "description": "Write testable code and master TDD practices",
            "category": "Testing",
            "difficulty": "Intermediate",
            "total_lessons": 13,
            "duration_hours": 22,
            "xp_reward": 220,
            "thumbnail": "/courses/tdd.jpg"
        },
        {
            "title": "Automated Testing & QA",
            "description": "Selenium, Cypress, and comprehensive testing strategies",
            "category": "Testing",
            "difficulty": "Intermediate",
            "total_lessons": 15,
            "duration_hours": 26,
            "xp_reward": 240,
            "thumbnail": "/courses/qa.jpg"
        }
    ]
    
    for course_data in courses_data:
        course = Course(**course_data)
        db.add(course)
        db.commit()
        db.refresh(course)
        
        # Add lessons for each course
        for i in range(course.total_lessons):
            lesson = Lesson(
                course_id=course.id,
                title=f"Lesson {i+1}: Chapter {i+1} of {course.title}",
                content=f"This is the detailed content for Lesson {i+1} of the {course.title} course. In this chapter, we explore key concepts and practical applications.",
                video_url=f"https://www.youtube.com/embed/dQw4w9WgXcQ", # Placeholder for educational video
                order=i+1,
                duration_minutes=45
            )
            db.add(lesson)
    
    db.commit()
    print(f"✅ Seeded {len(courses_data)} courses with lessons")


def seed_faqs(db: Session):
    """Seed FAQ data"""
    
    # Clear existing FAQs
    db.query(FAQ).delete()
    
    faqs_data = [
        {
            "category": "General",
            "question": "What is AI Interview Prep?",
            "answer": "AI Interview Prep is a comprehensive platform that helps you prepare for technical interviews using AI-powered mock interviews, aptitude tests, resume analysis, and structured courses.",
            "order": 1
        },
        {
            "category": "General",
            "question": "How does the XP system work?",
            "answer": "You earn XP points by completing tests, interviews, courses, and maintaining daily streaks. Every 1000 XP unlocks a new level, giving you access to achievements and recognition.",
            "order": 2
        },
        {
            "category": "General",
            "question": "Is AI Interview Prep free?",
            "answer": "Yes! Most features are completely free. We offer premium features for advanced users who want more practice questions and detailed analytics.",
            "order": 3
        },
        {
            "category": "Tests",
            "question": "What types of aptitude tests are available?",
            "answer": "We offer Logical Reasoning, Quantitative Aptitude, and Verbal Ability tests with three difficulty levels (Easy, Medium, Hard). Each test is AI-generated for unique practice every time.",
            "order": 4
        },
        {
            "category": "Tests",
            "question": "How are tests scored?",
            "answer": "Tests are scored based on correct answers out of total questions. You receive immediate feedback, detailed explanations, and earn XP based on your performance (higher scores = more XP).",
            "order": 5
        },
        {
            "category": "Tests",
            "question": "Can I retake tests?",
            "answer": "Yes! You can take as many tests as you want. Each time you'll get new AI-generated questions, so it's always fresh practice.",
            "order": 6
        },
        {
            "category": "Interviews",
            "question": "How do AI mock interviews work?",
            "answer": "Select your desired role and difficulty level. Our AI generates relevant interview questions. Answer them in text format, and receive detailed AI-powered feedback on your responses including strengths and areas for improvement.",
            "order": 7
        },
        {
            "category": "Interviews",
            "question": "What roles are supported for mock interviews?",
            "answer": "We support Software Developer, Data Scientist, Product Manager, DevOps Engineer, and many more roles. Questions are tailored to each specific role and include both technical and behavioral questions.",
            "order": 8
        },
        {
            "category": "Interviews",
            "question": "Can I practice video interviews?",
            "answer": "Yes! Our video mock interview feature allows you to practice answering questions on camera, simulating real interview conditions. You can review your recordings and get AI feedback on both content and presentation.",
            "order": 9
        },
        {
            "category": "Resume",
            "question": "What resume formats are supported?",
            "answer": "We support PDF and DOCX formats. Upload your resume to get AI-powered analysis, ATS score (how well it performs in applicant tracking systems), and specific improvement suggestions.",
            "order": 10
        },
        {
            "category": "Resume",
            "question": "What is ATS score?",
            "answer": "ATS (Applicant Tracking System) score indicates how well your resume will perform in automated screening systems used by companies. A score above 80 means your resume is well-optimized for ATS systems.",
            "order": 11
        },
        {
            "category": "Resume",
            "question": "How can I improve my ATS score?",
            "answer": "Follow the AI suggestions: use standard section headings, include relevant keywords from job descriptions, avoid complex formatting, use common fonts, and quantify your achievements with numbers.",
            "order": 12
        },
        {
            "category": "Courses",
            "question": "How do I enroll in courses?",
            "answer": "Browse available courses, click 'Enroll Now', and start learning immediately. Track your progress as you complete lessons. You'll earn XP and certificates upon completion.",
            "order": 13
        },
        {
            "category": "Courses",
            "question": "Do I get certificates?",
            "answer": "Yes! Upon completing a course with 100% progress, you'll automatically receive a shareable certificate that you can add to your LinkedIn profile or resume.",
            "order": 14
        },
        {
            "category": "Courses",
            "question": "Can I learn at my own pace?",
            "answer": "Absolutely! All courses are self-paced. You can pause, resume, and revisit lessons anytime. Your progress is automatically saved.",
            "order": 15
        },
        {
            "category": "Account",
            "question": "How do I maintain my streak?",
            "answer": "Login daily and complete at least one activity (test, interview, or course lesson). Your streak increases with consecutive daily logins and earns you bonus XP.",
            "order": 16
        },
        {
            "category": "Account",
            "question": "What happens if I lose my streak?",
            "answer": "If you miss a day, your streak resets to 0. But don't worry! You can start building it again immediately. The XP you've already earned is never lost.",
            "order": 17
        },
        {
            "category": "Account",
            "question": "How do I change my password?",
            "answer": "Go to Settings > Change Password. Enter your current password and your new password (minimum 6 characters). Click 'Change Password' to update.",
            "order": 18
        },
        {
            "category": "Technical",
            "question": "What browsers are supported?",
            "answer": "AI Interview Prep works best on modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). We recommend Chrome for the best experience.",
            "order": 19
        },
        {
            "category": "Technical",
            "question": "Is my data secure?",
            "answer": "Yes! We use industry-standard encryption for all data transmission and storage. Your personal information, test results, and resume data are securely stored and never shared with third parties.",
            "order": 20
        }
    ]
    
    for faq_data in faqs_data:
        faq = FAQ(**faq_data)
        db.add(faq)
    
    db.commit()
    print(f"✅ Seeded {len(faqs_data)} FAQs")


def main():
    print("🌱 Starting database seeding...")
    db = SessionLocal()
    
    try:
        seed_courses(db)
        seed_faqs(db)
        print("\n🎉 Database seeding completed successfully!")
        print("\nSeeded data:")
        print("  - 50 Courses with lessons")
        print("  - 20 FAQs across multiple categories")
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
