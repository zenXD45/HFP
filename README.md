<div align="center">
  <h1>❤️ CardioGuard: Heart Failure Prediction App</h1>
  <p><i>A full-stack machine learning application for analyzing cardiovascular risk based on patient vitals and health indicators.</i></p>
</div>

---

## 📖 Introduction & Working of the App

**CardioGuard** is a robust web application designed to assess the likelihood of heart failure in patients using a trained Machine Learning model. The app receives various physiological inputs (such as Age, Blood Pressure, Cholesterol, ECG results, etc.), processes them through a **Random Forest Classification Model**, and presents a detailed, visually appealing risk analysis report to the user.

### **How it Works (User Flow):**
1. **Data Entry (Dashboard):** The user enters patient demographics, vital signs, and ECG/stress test results via an intuitive, glassmorphic UI.
2. **Prediction Request:** Upon submission, the frontend structural data is sent as a JSON payload to the FastAPI backend.
3. **Model Inference:** The backend maps the categorical inputs into numerical features and runs inferences using a pre-trained `scikit-learn` Random Forest model.
4. **Results Display:** The prediction accuracy and risk category are returned to the frontend, rendering a dynamic, animated circular gauge chart and providing personalized health recommendations.
5. **PDF Export:** The user can instantly generate an exportable PDF copy of their diagnostic results using the integrated PDF generation tool.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React 19 (via Vite)
- **Styling:** Vanilla CSS (App.css & index.css) featuring a custom Glassmorphism UI, Responsive Design, and CSS Variables for dynamic theming.
- **Animations:** `framer-motion` for smooth, spring-based micro-interactions, layout transitions, and SVG chart animations.
- **Icons:** `lucide-react` for clean, modern SVG iconography.
- **Utilities:** `html2canvas` & `jspdf` for taking a snapshot of the results and exporting them as a high-quality PDF.

### **Backend**
- **Framework:** FastAPI (Python)
- **Machine Learning:** `scikit-learn` (v1.6.1), `pandas` for dataframe manipulation, and `joblib` for secure and fast model loading.
- **Server:** `uvicorn` as the ASGI web server.
- **Data Validation:** `pydantic` for strict type checking of the incoming JSON payloads.

---

## 📂 Project Structure

```text
HFP/
├── backend/
│   ├── main.py                     # FastAPI server entry point
│   ├── rf_heart_failure_model.pkl  # Trained Random Forest ML model
│   ├── requirements.txt            # Python dependencies
│   └── test_api.py                 # API test script
└── frontend/
    ├── package.json                # Node modules and scripts
    ├── vite.config.js              # Vite bundler configuration
    ├── index.html                  # Main HTML template
    └── src/
        ├── main.jsx                # React root rendering
        ├── App.jsx                 # Application layout and routing state
        ├── index.css & App.css     # Global styles and variables
        └── screens/
            ├── DashboardScreen.jsx # Patient input form layout
            └── ResultsScreen.jsx   # Prediction data visualization display
```

---

## 🖥️ Frontend Logic & Architecture in Detail

The frontend is a Single Page Application (SPA) driven by React state handling without the need for an external router (like React Router), keeping it lightweight and fast.

### `App.jsx`
- **State Management:** Manages the active screen (`currentScreen`) transitioning between `dashboard`, `loading`, and `results`. It also holds the `formData` and `predictionResult`.
- **API Communication:** The `handlePredict` function accepts user data, triggers the loading screen, and makes a `POST` request to the backend `/predict` endpoint. Upon a successful response, it routes the user to the `results` view.
- **Animation Orchestration:** Wraps screen components in `framer-motion`'s `<AnimatePresence>` to orchestrate fluid exit and entry animations of screens.

### `screens/DashboardScreen.jsx`
- **Form Handling:** Maintains its own isolated `formData` state. It captures 11 critical data points including Age, Gender, Resting BP, Cholesterol, Fasting Blood Sugar, Chest Pain Type, Resting ECG, Max Heart Rate, Exercise Angina, Oldpeak, and ST Slope.
- **UI Components:** Utilizes customized `<motion.div>` interactive buttons and styled `<select>` dropdowns for a seamless user experience. All form inputs are strictly bound to state to ensure React remains the single source of truth.
- **Submission:** On submit, it prevents default browser reload and propagates the collected payload up to `App.jsx` via the `onPredict` callback.

### `screens/ResultsScreen.jsx`
- **Data Visualization:** Extracts the `probability` and `riskLevel` from the backend response. It dynamically calculates SVG stroke-dash arrays to animate a circular "Risk Gauge" graph based on the risk percentage utilizing `framer-motion`.
- **Dynamic Theming:** Modifies its color palette conditionally (Red metrics for High Risk, Green metrics for Low Risk) to give instant visual feedback.
- **PDF Generation logic:** Employs `handleGeneratePdf` to momentarily hide action buttons, use `html2canvas` to screenshot the DOM element `#pdf-content`, and injects the image into a `jsPDF` instance allowing the user to download their personalized medical report.

---

## ⚙️ Backend Logic & Architecture in Detail

The backend serves as a standalone microservice, built for low latency and high concurrency using FastAPI.

### `main.py`
- **Model Loading Mechanism:** On server startup, it accesses the current absolute directory path to safely locate and load `rf_heart_failure_model.pkl` using `joblib`. Warnings caused by scikit-learn version differences are gracefully ignored so the application boots securely.
- **CORS Middleware:** Configured strictly with `CORSMiddleware` to accept cross-origin requests necessary for the React frontend running on a different port during development.
- **Pydantic Data Validation:** The `PatientData` class derives from Pydantic `BaseModel`. It guarantees that incoming POST bodies contain exactly the required fields with matching data types (e.g., `age` must be an `int`, `oldpeak` must be a `float`).

### Model Integration & The `/predict` Endpoint
- **Feature Engineering/Mapping:** The ML Model was previously trained with One-Hot Encoded variables. The raw JSON payload is unpacked and mapped to 18 specific boolean/integer variables required by the model.
  - *Example:* The string `ST Slope` (Up, Flat, Down) is algorithmically categorized into an integer format `{0, 1, 2}`.
  - Data strings corresponding to Gender or Chest Pain type are assigned `1` or `0` across respective columns like `Sex_M`, `Sex_F`, `ChestPainType_ASY`, etc.
- **Dataframe Construction:** Passes this mapped dictionary into a Pandas DataFrame ensuring the exact column order expected by the Random Forest Model is maintained.
- **Prediction Logic:** 
  - `model.predict(df)`: Computes the binary threshold (1 for heart failure, 0 for healthy).
  - `model.predict_proba(df)`: Computes the granular probability array. We retrieve index `1` to isolate the percentage risk of heart failure.
- **Response Formatting:** Wraps the resulting probability, a calculated string identifier ("High Risk" vs "Low Risk"), and a derived "heart rhythm" prognosis based on ECG metrics into a final JSON response sent back to the frontend.

---

## 🚀 Setup & Installation Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)

### 1. Start the Backend API
Navigate to the `backend` directory and install the necessary Python dependencies.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
*The FastAPI server will start on `http://localhost:8000`.*

### 2. Start the Frontend Application
Open a new terminal, navigate to the `frontend` directory, install JS packages, and spin up the Vite development server.
```bash
cd frontend
npm install
npm run dev
```
*The web app will be accessible at `http://localhost:5173`.*

---

<div align="center">
  <p><i>Developed with passion for predictive healthcare technology.</i></p>
</div>
