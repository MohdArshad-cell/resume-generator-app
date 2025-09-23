📄✨ Full-Stack Resume Generator

A dynamic, microservice-based web application that empowers users to create, preview, and download professional, ATS-friendly resumes in PDF, LaTeX, and JSON formats.

🔗 Live Demo on Render
 (replace with your actual deployed link)


💡 Suggestion: Add a clean screenshot or GIF of your application in action!

🚀 Features

✅ Live PDF Preview – Instantly see updates while editing your resume
✅ Multiple Templates – Professionally designed LaTeX templates to choose from
✅ Dynamic Sections – Sections like Experience, Projects, Education appear only if content is provided
✅ Customizable Skills – Create your own categories and define skill levels
✅ Flexible Downloads – Export resume as:

📑 High-quality PDF

📝 Raw LaTeX Source Code

🔗 Structured JSON File
✅ Scalable Architecture – Powered by a robust Java + Python microservice backend

🏗️ Tech Stack & Architecture

This project follows a distributed, microservice-based architecture for scalability and modularity.
graph TD
    A[User's Browser <br/>(React Frontend)] --> B{Java Orchestrator <br/>(Spring Boot)};
    B --> C[Python Generator <br/>(FastAPI + LaTeX)];
    C --> B;
    B --> A;

🕸️ Frontend (resume-builder-frontend)

React + TypeScript → Type-safe, component-based UI
Axios → API communication with backend
Custom CSS (Dark Theme) → Modern, responsive design

☕ Backend Orchestrator (generator)
Java 17 + Spring Boot → Handles client-facing APIs
Spring WebFlux (WebClient) → Non-blocking calls to Python microservice
File Management → Stores and serves downloadable files

🐍 Generator Microservice (resume-engine)
Python + FastAPI → High-performance API for resume generation
Jinja2 → Dynamic LaTeX template rendering
LaTeX (MiKTeX/TexLive) → Converts .tex → PDF

⚙️ Local Setup & Installation
To run this project locally, ensure you have installed:
Node.js (v16+)
JDK 17+
Maven
Python 3.9+
LaTeX distribution (MiKTeX / TeX Live)
Pydantic → Data validation and type checking

1️⃣ Clone the Repository
git clone https://github.com/YourUsername/your-repo-name.git
cd your-repo-name

2️⃣ Start the Python Engine 🐍
cd resume-engine
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate   # On Windows
# source venv/bin/activate   # On macOS/Linux
# Install dependencies
pip install -r requirements.txt
# Run the server
uvicorn app.main:app --reload

👉 Python API will run at: http://localhost:8000

3️⃣ Start the Java Orchestrator ☕
cd generator
# Run Spring Boot app
mvn spring-boot:run

4️⃣ Start the React Frontend 🕸️
cd resume-builder-frontend
# Create environment file
echo REACT_APP_API_BASE_URL=http://localhost:8080 > .env
# Install dependencies
npm install
# Start development server
npm start
👉 Frontend will be available at: http://localhost:3000

📂 Project Structure
your-repo-name/
│── resume-builder-frontend/   # React + TypeScript frontend
│── generator/                 # Java Spring Boot orchestrator
│── resume-engine/             # Python FastAPI microservice
│── README.md                  # Project documentation

🌟 Future Enhancements
✨ Add AI-powered resume suggestions using Gemini/GPT APIs
🎨 More LaTeX template designs
🌐 Cloud storage for resumes
🔒 JWT authentication for user accounts

🤝 Contributing
Contributions are welcome! Please fork this repository, make your changes, and open a PR.

📜 License
This project is licensed under the MIT License.
