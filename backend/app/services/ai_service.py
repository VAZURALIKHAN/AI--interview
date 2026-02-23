"""
AI Service for interview questions, resume analysis, and feedback generation
"""
import google.generativeai as genai
from app.core.config import settings
import json
from typing import List, Dict, Any

# Configure Gemini AI
genai.configure(api_key=settings.GEMINI_API_KEY)


class AIService:
    def __init__(self):
        try:
            # Only initialize if API key is valid (not placeholder)
            if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-here":
                self.model = genai.GenerativeModel('gemini-pro')
                self.use_ai = True
            else:
                self.model = None
                self.use_ai = False
                print("⚠️  Gemini API key not configured. Using fallback questions.")
        except Exception as e:
            self.model = None
            self.use_ai = False
            print(f"⚠️  AI Service initialization failed: {e}. Using fallback questions.")
    
    def generate_aptitude_questions(self, category: str, difficulty: str, count: int = 10) -> List[Dict]:
        """Generate aptitude test questions using AI"""
        
        # Use fallback if AI is not available
        if not self.use_ai or self.model is None:
            print(f"Using fallback questions for {category} - {difficulty}")
            return self._get_fallback_questions(category, difficulty, count)
        
        prompt = f"""
        Generate {count} {difficulty} level {category} aptitude questions in JSON format.
        Each question should have:
        - question: the question text
        - options: array of 4 options
        - correct_answer: index of correct option (0-3)
        - explanation: brief explanation of the answer
        
        Return ONLY a valid JSON array, nothing else.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Clean the response to get only JSON
            text = response.text.strip()
            # Remove markdown code blocks if present
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            questions = json.loads(text)
            return questions[:count]
        except Exception as e:
            print(f"AI generation error: {e}")
            # Return fallback questions
            return self._get_fallback_questions(category, difficulty, count)
    
    def generate_interview_questions(self, role: str, difficulty: str, count: int = 5) -> List[Dict]:
        """Generate interview questions for a specific role"""
        prompt = f"""
        Generate {count} {difficulty} level interview questions for a {role} position.
        Include both technical and behavioral questions.
        
        Return a JSON array where each question has:
        - question: the question text
        - type: "technical" or "behavioral"
        - expected_points: key points that should be covered in answer
        
        Return ONLY valid JSON, nothing else.
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            questions = json.loads(text)
            return questions[:count]
        except Exception as e:
            print(f"AI generation error: {e}")
            return self._get_fallback_interview_questions(role, count)
    
    def evaluate_interview_response(self, question: str, response: str, expected_points: List[str]) -> Dict:
        """Evaluate an interview response using AI"""
        prompt = f"""
        Evaluate this interview response:
        
        Question: {question}
        Expected Points: {', '.join(expected_points)}
        Candidate's Response: {response}
        
        Provide:
        - score: 0-100
        - feedback: constructive feedback
        - strengths: what was good
        - improvements: what could be better
        
        Return ONLY valid JSON with these fields.
        """
        
        try:
            response_obj = self.model.generate_content(prompt)
            text = response_obj.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            evaluation = json.loads(text)
            return evaluation
        except Exception as e:
            print(f"AI evaluation error: {e}")
            return {
                "score": 70,
                "feedback": "Good attempt. Keep practicing!",
                "strengths": ["Clear communication"],
                "improvements": ["Add more technical details"]
            }

    def generate_coding_problems(self, category: str, difficulty: str, language: str = "Python", count: int = 3) -> List[Dict]:
        """Generate coding problems using AI"""
        
        task_specific_instruction = ""
        if "SQL" in category:
            task_specific_instruction = f"The problems should be SQL challenges. 'starter_code' should be a SQL query template. 'constraints' should describe the database schema."
        elif "Bug Fixing" in category:
            task_specific_instruction = f"The problems should be bug-fixing tasks. 'starter_code' should contain buggy {language} code. 'examples' should show the buggy input/output vs expected."
        elif "Flashcards" in category:
            task_specific_instruction = f"The problems should be flashcard-style questions. 'title' is the question, 'description' is the concise answer, and 'constraints' are key bullet points to remember."
        else:
            task_specific_instruction = f"The problems should be standard coding challenges. 'starter_code' should be a function template in {language}."

        prompt = f"""
        Generate {count} {difficulty} level coding/technical problems for category '{category}'.
        {task_specific_instruction}
        
        Each problem should have:
        - title: Problem title or question
        - description: Detailed description or answer
        - constraints: Array of constraints or key points
        - examples: Array of objects with 'input', 'output', 'explanation'
        - starter_code: Code template, buggy code, or SQL script
        - test_cases: Array of objects with 'input', 'expected_output'
        
        Return ONLY a valid JSON array.
        """
        
        try:
            if not self.use_ai or self.model is None:
                raise Exception("AI not available")
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            problems = json.loads(text)
            return problems[:count]
        except Exception as e:
            print(f"AI coding generation error: {e}")
            return [
                {
                    "title": "Two Sum",
                    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    "constraints": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
                    "examples": [
                        {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}
                    ],
                    "starter_code": "def two_sum(nums, target):\n    # Write your code here\n    pass",
                    "test_cases": [
                        {"input": "[2,7,11,15], 9", "expected_output": "[0,1]"}
                    ]
                },
                {
                    "title": "Valid Parentheses",
                    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                    "constraints": ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
                    "examples": [
                        {"input": "s = '()[]{}'", "output": "true"}
                    ],
                    "starter_code": "def isValid(s):\n    # Your code here\n    pass",
                    "test_cases": [
                        {"input": "('()[]{}')", "expected_output": "true"}
                    ]
                }
            ]

    def generate_aptitude_tutorial(self, category: str, topic: str) -> Dict:
        """Generate an aptitude tutorial using AI"""
        prompt = f"""
        Create a comprehensive tutorial for the aptitude topic '{topic}' in the category '{category}'.
        Include:
        - title: Topic title
        - overview: Brief introduction
        - key_concepts: Array of key concepts with definitions
        - formulas: Array of relevant formulas
        - examples: Array of solved examples with step-by-step explanations
        - tips: Array of shortcuts or tips
        
        Return ONLY a valid JSON object.
        """
        
        try:
            if not self.use_ai or self.model is None:
                raise Exception("AI not available")
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            tutorial = json.loads(text)
            return tutorial
        except Exception as e:
            print(f"AI tutorial generation error: {e}")
            return {
                "title": topic,
                "overview": f"Learn about {topic} in {category} aptitude.",
                "key_concepts": [],
                "formulas": [],
                "examples": [],
                "tips": ["Practice regularly to improve speed and accuracy."]
            }
    
    def analyze_resume(self, resume_text: str) -> Dict:
        """Analyze resume and provide comprehensive feedback"""
        prompt = f"""
        Analyze this resume in detail and provide comprehensive feedback:
        
        {resume_text}
        
        Provide a detailed JSON response with these fields:
        - ats_score: ATS compatibility score (0-100) based on formatting, keywords, structure
        - ats_friendly: boolean, true if score >= 75
        - ats_analysis: object with:
          - formatting_score: 0-100 (clean, parseable format)
          - keyword_optimization: 0-100 (industry keywords present)
          - structure_score: 0-100 (proper sections, clear hierarchy)
          - readability_score: 0-100 (clear, concise language)
          - overall_feedback: string explaining the ATS score
        
        - positive_points: array of strings highlighting what's GOOD about the resume (at least 5 points):
          - Strong technical skills
          - Quantifiable achievements
          - Good formatting
          - Clear career progression
          - Relevant experience
          etc.
        
        - negative_points: array of strings highlighting what NEEDS IMPROVEMENT (at least 5 points):
          - Missing sections
          - Vague descriptions
          - Formatting issues  
          - Lack of metrics
          - Too lengthy/too brief
          etc.
        
        - skills: extracted technical skills as array
        - experience_years: estimated years of professional experience
        - strengths: array of overall strengths (3-5 items)
        - improvements: array of specific actionable suggestions (5-7 items)
        - missing_sections: array of  sections that should be added
        - keywords_found: array of important industry keywords detected
        - keywords_missing: array of important keywords that should be added
        
        Be specific, constructive, and actionable. Return ONLY valid JSON.
        """
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith('```'):
                text = text.split('```')[1]
                if text.startswith('json'):
                    text = text[4:]
            text = text.strip()
            
            analysis = json.loads(text)
            
            # Ensure all required fields exist
            if 'positive_points' not in analysis:
                analysis['positive_points'] = []
            if 'negative_points' not in analysis:
                analysis['negative_points'] = []
            if 'ats_analysis' not in analysis:
                analysis['ats_analysis'] = {
                    "formatting_score": analysis.get('ats_score', 75),
                    "keyword_optimization": 70,
                    "structure_score": 75,
                    "readability_score": 80,
                    "overall_feedback": "ATS analysis completed"
                }
            if 'ats_friendly' not in analysis:
                analysis['ats_friendly'] = analysis.get('ats_score', 75) >= 75
                
            return analysis
        except Exception as e:
            print(f"AI analysis error: {e}")
            # Return comprehensive fallback with all fields
            return {
                "ats_score": 75,
                "ats_friendly": True,
                "ats_analysis": {
                    "formatting_score": 75,
                    "keyword_optimization": 70,
                    "structure_score": 75,
                    "readability_score": 80,
                    "overall_feedback": "Resume has decent ATS compatibility. Standard formatting detected with room for improvement in keyword optimization."
                },
                "positive_points": [
                    "Clean and professional formatting",
                    "Technical skills are listed clearly",
                    "Experience section is present",
                    "Contact information is provided",
                    "Structured layout is easy to follow"
                ],
                "negative_points": [
                    "Could benefit from more quantifiable achievements (metrics, percentages)",
                    "Some descriptions may be too generic",
                    "Consider adding more industry-specific keywords",
                    "Action verbs could be more impactful",
                    "May need to highlight key accomplishments better"
                ],
                "skills": ["Python", "JavaScript", "SQL", "Communication", "Problem Solving"],
                "experience_years": 2,
                "strengths": [
                    "Good technical foundation",
                    "Clear structure and organization",
                    "Professional presentation"
                ],
                "improvements": [
                    "Add more quantifiable achievements with metrics",
                    "Include specific technologies and tools used",
                    "Expand on project outcomes and impact",
                    "Add a projects section if missing",
                    "Optimize with industry-relevant keywords",
                    "Use stronger action verbs (Led, Architected, Optimized)",
                    "Keep bullet points concise yet impactful"
                ],
                "missing_sections": ["Projects", "Certifications"],
                "keywords_found": ["Python", "JavaScript", "Development"],
                "keywords_missing": ["API", "Cloud", "Testing", "CI/CD", "Agile"]
            }

    def explain_lesson_concept(self, course_title: str, lesson_title: str, lesson_content: str) -> str:
        """Generate an AI explanation for a lesson concept."""
        prompt = f"""
        You are an expert tutor. Explain the concept of '{lesson_title}' from the course '{course_title}'.
        
        Lesson Content Context:
        {lesson_content}
        
        Provide a concise, beginner-friendly explanation (max 200 words). 
        Include:
        1. Definition
        2. Real-world analogy
        3. Key takeaway
        
        Format as clear Markdown.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"AI explanation error: {e}")
            return f"**{lesson_title}**\n\nThis concept is fundamental to {course_title}. Please refer to the video and text content for a detailed explanation."
    
    def _get_fallback_questions(self, category: str, difficulty: str, count: int) -> List[Dict]:
        """Fallback questions if AI fails"""
        questions_bank = {
            "Logical": [
                {
                    "question": "If A is taller than B, and B is taller than C, who is the shortest?",
                    "options": ["A", "B", "C", "Cannot determine"],
                    "correct_answer": 2,
                    "explanation": "C is shorter than B, and B is shorter than A, so C is the shortest."
                },
                {
                    "question": "What comes next in the series: 2, 6, 12, 20, 30, ?",
                    "options": ["38", "40", "42", "44"],
                    "correct_answer": 2,
                    "explanation": "Pattern: +4, +6, +8, +10, +12. So 30 + 12 = 42"
                },
                {
                    "question": "If all roses are flowers and some flowers fade quickly, which statement is definitely true?",
                    "options": ["All roses fade quickly", "Some roses are flowers", "No flowers fade quickly", "All flowers are roses"],
                    "correct_answer": 1,
                    "explanation": "From 'all roses are flowers', we can definitively say 'some roses are flowers'."
                },
                {
                    "question": "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
                    "options": ["EOJDEJFM", "MFEDJJOE", "NFEJDJOF", "EOJDJEFN"],
                    "correct_answer": 2,
                    "explanation": "Each letter is moved one position forward in the alphabet."
                },
                {
                    "question": "Five friends are sitting in a row. A is to the left of B but to the right of C. D is to the right of B and E is to the right of D. Who is in the middle?",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": 1,
                    "explanation": "Order: C, A, B, D, E. So B is in the middle."
                },
                {
                    "question": "Find the odd one out: 3, 5, 11, 14, 17, 21",
                    "options": ["5", "11", "14", "21"],
                    "correct_answer": 2,
                    "explanation": "All are prime numbers except 14 (14 = 2 × 7)."
                },
                {
                    "question": "If '+' means '×', '×' means '-', '-' means '÷' and '÷' means '+', what is 15 + 2 × 9 - 3 ÷ 5?",
                    "options": ["20", "22", "25", "28"],
                    "correct_answer": 3,
                    "explanation": "15 × 2 - 9 ÷ 3 + 5 = 30 - 3 + 5 - 4 = 28"
                },
                {
                    "question": "Which word does NOT belong: Square, Triangle, Circle, Rectangle, Cube?",
                    "options": ["Square", "Triangle", "Circle", "Cube"],
                    "correct_answer": 3,
                    "explanation": "Cube is 3D, all others are 2D shapes."
                },
                {
                    "question": "If the day before yesterday was Thursday, what will be the day after tomorrow?",
                    "options": ["Sunday", "Monday", "Tuesday", "Wednesday"],
                    "correct_answer": 1,
                    "explanation": "Day before yesterday = Thursday, Yesterday = Friday, Today = Saturday, Tomorrow = Sunday, Day after tomorrow = Monday"
                },
                {
                    "question": "Complete the analogy: Book : Pages :: Tree : ?",
                    "options": ["Forest", "Leaves", "Branches", "Roots"],
                    "correct_answer": 1,
                    "explanation": "A book is made of pages, similarly a tree has leaves."
                },
                {
                    "question": "A is the father of B, but B is not A's son. What is the relationship of B to A?",
                    "options": ["Daughter", "Nephew", "Cousin", "Step-son"],
                    "correct_answer": 0,
                    "explanation": "If B is not the son, then B must be the daughter."
                },
                {
                    "question": "If CLOCK is coded as KCOLD, then how will WATCH be coded?",
                    "options": ["HCTAW", "HCTA X", "HCTAY", "HCTAZ"],
                    "correct_answer": 0,
                    "explanation": "The word is reversed. WATCH reversed is HCTAW."
                }
            ],
            "Quantitative": [
                {
                    "question": "What is 15% of 200?",
                    "options": ["25", "30", "35", "40"],
                    "correct_answer": 1,
                    "explanation": "15% of 200 = (15/100) × 200 = 30"
                },
                {
                    "question": "If a train travels 120 km in 2 hours, what is its average speed?",
                    "options": ["50 km/h", "55 km/h", "60 km/h", "65 km/h"],
                    "correct_answer": 2,
                    "explanation": "Speed = Distance/Time = 120/2 = 60 km/h"
                },
                {
                    "question": "The average of 5 numbers is 27. If one number is excluded, the average becomes 25. What is the excluded number?",
                    "options": ["30", "33", "35", "37"],
                    "correct_answer": 2,
                    "explanation": "Sum of 5 numbers = 27×5 = 135. Sum of 4 numbers = 25×4 = 100. Excluded = 135-100 = 35"
                },
                {
                    "question": "A shopkeeper offers a 20% discount and still makes a 20% profit. If the cost price is $100, what was the marked price?",
                    "options": ["$144", "$150", "$156", "$160"],
                    "correct_answer": 1,
                    "explanation": "Selling price = 100 + 20% = $120. If 80% of Marked price = 120, then Marked price = 120/0.8 = $150"
                },
                {
                    "question": "If x + y = 10 and x - y = 4, what is the value of x?",
                    "options": ["5", "6", "7", "8"],
                    "correct_answer": 2,
                    "explanation": "Adding both equations: 2x = 14, so x = 7"
                },
                {
                    "question": "What is the compound interest on $5000 for 2 years at 10% per annum?",
                    "options": ["$1000", "$1050", "$1100", "$1150"],
                    "correct_answer": 1,
                    "explanation": "A = 5000(1.1)² = 6050. CI = 6050 - 5000 = $1050"
                },
                {
                    "question": "In a class of 50 students, 30 play cricket and 25 play football. If 10 play both, how many play neither?",
                    "options": ["3", "5", "7", "10"],
                    "correct_answer": 1,
                    "explanation": "Total = Cricket + Football - Both + Neither. 50 = 30 + 25 - 10 + Neither. Neither = 5"
                },
                {
                    "question": "A can complete a work in 12 days and B in 18 days. How long will they take working together?",
                    "options": ["6.5 days", "7 days", "7.2 days", "8 days"],
                    "correct_answer": 2,
                    "explanation": "Combined rate = 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days"
                },
                {
                    "question": "The ratio of boys to girls in a class is 3:2. If there are 30 boys, how many girls are there?",
                    "options": ["15", "18", "20", "25"],
                    "correct_answer": 2,
                    "explanation": "3:2 = 30:x. So x = (2×30)/3 = 20"
                },
                {
                    "question": "What is 25% of 25% of 400?",
                    "options": ["20", "25", "30", "35"],
                    "correct_answer": 1,
                    "explanation": "25% of 400 = 100. 25% of 100 = 25"
                },
                {
                    "question": "Find the sum of the first 20 even natural numbers.",
                    "options": ["400", "420", "440", "460"],
                    "correct_answer": 1,
                    "explanation": "Sum of first n even numbers = n(n+1) = 20(21) = 420"
                }
            ],
            "Verbal": [
                {
                    "question": "Choose the word most similar in meaning to GARRULOUS:",
                    "options": ["Silent", "Talkative", "Angry", "Happy"],
                    "correct_answer": 1,
                    "explanation": "Garrulous means excessively talkative."
                },
                {
                    "question": "Choose the antonym of ZENITH:",
                    "options": ["Peak", "Summit", "Nadir", "Apex"],
                    "correct_answer": 2,
                    "explanation": "Zenith means highest point. Nadir means lowest point."
                },
                {
                    "question": "Complete the sentence: Despite the _____ evidence, the jury remained unconvinced.",
                    "options": ["scant", "meager", "compelling", "dubious"],
                    "correct_answer": 2,
                    "explanation": "'Despite' indicates contrast. Compelling evidence should convince, but didn't."
                },
                {
                    "question": "Find the correctly spelled word:",
                    "options": ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
                    "correct_answer": 1,
                    "explanation": "The correct spelling is 'Accommodate' with double 'c' and double 'm'."
                },
                {
                    "question": "Choose the word that best completes: Optimist : Hopeful :: Pessimist : _____",
                    "options": ["Gloomy", "Happy", "Neutral", "Excited"],
                    "correct_answer": 0,
                    "explanation": "An optimist is hopeful, while a pessimist is gloomy."
                },
                {
                    "question": "Identify the grammatically correct sentence:",
                    "options": ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She don't likes coffee"],
                    "correct_answer": 2,
                    "explanation": "'She doesn't like coffee' uses correct subject-verb agreement."
                },
                {
                    "question": "What does the idiom 'A blessing in disguise' mean?",
                    "options": ["A hidden curse", "Something good that seemed bad at first", "A religious ceremony", "A perfect situation"],
                    "correct_answer": 1,
                    "explanation": "It means something that appears bad but turns out to be good."
                },
                {
                    "question": "Choose the synonym of EPHEMERAL:",
                    "options": ["Permanent", "Eternal", "Temporary", "Endless"],
                    "correct_answer": 2,
                    "explanation": "Ephemeral means lasting for a very short time, i.e., temporary."
                },
                {
                    "question": "Which word is a noun in this sentence: 'The quick brown fox jumps over the lazy dog'?",
                    "options": ["Quick", "Brown", "Fox", "Jumps"],
                    "correct_answer": 2,
                    "explanation": "'Fox' is a noun (a thing/animal). Quick and brown are adjectives, jumps is a verb."
                },
                {
                    "question": "Choose the correct form: Neither of the students _____ completed their homework.",
                    "options": ["have", "has", "are", "were"],
                    "correct_answer": 1,
                    "explanation": "'Neither' is singular and takes a singular verb 'has'."
                }
            ]
        }
        
        # Normalize category name (handle case variations)
        category_key = category.capitalize() if category.lower() in ["logical", "quantitative", "verbal"] else "Logical"
        available_questions = questions_bank.get(category_key, questions_bank["Logical"])
        
        # Return requested number of questions (cycle if needed)
        result = []
        for i in range(count):
            result.append(available_questions[i % len(available_questions)])
        
        return result
    
    def _get_fallback_interview_questions(self, role: str, count: int) -> List[Dict]:
        """Fallback interview questions"""
        return [
            {
                "question": f"Tell me about your experience with {role} technologies.",
                "type": "technical",
                "expected_points": ["Specific technologies", "Projects", "Problem-solving"]
            },
            {
                "question": "Describe a challenging project you worked on.",
                "type": "behavioral",
                "expected_points": ["Challenge", "Approach", "Result"]
            }
        ][:count]


# Singleton instance
ai_service = AIService()
