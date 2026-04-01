import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import DashboardScreen from './screens/DashboardScreen';
import ResultsScreen from './screens/ResultsScreen';

const LoadingStages = () => {
  const [stage, setStage] = useState(0);
  const stages = ['Parsing Patient Data...', 'Evaluating ECG Results...', 'Running ML Model...'];
  useEffect(() => {
    const int = setInterval(() => { setStage(s => (s + 1) % stages.length) }, 500);
    return () => clearInterval(int);
  }, []);
  return (
    <div style={{ textAlign: 'center', marginTop: 24, height: 40 }}>
      <AnimatePresence mode="wait">
        <motion.p key={stage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
          {stages[stage]}
        </motion.p>
      </AnimatePresence>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: 4 }}>Simulating AI analysis</p>
    </div>
  );
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [formData, setFormData] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -8, scale: 0.98 }
  };

  const handlePredict = async (data) => {
    setFormData(data);
    setCurrentScreen('loading');
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL}/predict`
        : '/api/predict';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Prediction request failed');
      }
      
      const result = await response.json();
      
      setTimeout(() => {
        setPredictionResult(result);
        setCurrentScreen('results');
      }, 1500);
      
    } catch (error) {
       console.error("Error making prediction:", error);
       alert("Failed to connect to the prediction server. Is the FastAPI backend running?");
       setCurrentScreen('dashboard');
    }
  };

  const handleBack = () => {
    setCurrentScreen('dashboard');
    setPredictionResult(null);
  };

  return (
    <div className="app-container">
      
      {/* Header */}
      <motion.div 
        className="header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="header-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0 5.4 5.4 0 0 0 0 7.65l8.42 8.42 8.42-8.42a5.4 5.4 0 0 0 0-7.65z"/>
          </svg>
        </div>
        <div>
          <div className="header-title">HFP</div>
          <div className="header-subtitle">Heart Failure Risk Analysis</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
           <motion.button
             type="button"
             onClick={toggleTheme}
             whileTap={{ scale: 0.9 }}
             style={{ 
               background: 'rgba(255,255,255,0.06)', 
               border: '1px solid rgba(255,255,255,0.08)', 
               width: 36, height: 36, borderRadius: 10,
               color: 'var(--text-muted)', cursor: 'pointer',
               display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
             }}
           >
             <AnimatePresence mode="wait">
               {theme === 'dark' ? (
                 <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                   <Sun size={18} />
                 </motion.div>
               ) : (
                 <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                   <Moon size={18} color="var(--text-main)" />
                 </motion.div>
               )}
             </AnimatePresence>
           </motion.button>
           {currentScreen === 'results' && (
             <motion.button 
               onClick={handleBack} 
               whileTap={{ scale: 0.9 }}
               style={{ 
                 background: 'rgba(255,255,255,0.06)', 
                 border: '1px solid rgba(255,255,255,0.08)', 
                 width: 36, height: 36, borderRadius: 10,
                 color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer',
                 display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}
             >
               ✕
             </motion.button>
           )}
        </div>
      </motion.div>

      {/* Screen Router */}
      <AnimatePresence mode="wait">
        {currentScreen === 'dashboard' && (
          <motion.div key="dashboard" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
            <DashboardScreen onPredict={handlePredict} />
          </motion.div>
        )}

        {currentScreen === 'loading' && (
          <motion.div 
            key="loading" 
            initial="initial" 
            animate="in" 
            exit="out" 
            variants={pageVariants}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}
          >
            <svg width="120" height="60" viewBox="0 0 120 60" style={{ filter: 'drop-shadow(0 0 8px var(--primary-glow))' }}>
               <motion.path
                 d="M 10 30 L 30 30 L 40 10 L 55 50 L 70 30 L 110 30"
                 fill="none"
                 stroke="var(--primary)"
                 strokeWidth="4"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: 1 }}
                 transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
               />
            </svg>
            <LoadingStages />
          </motion.div>
        )}

        {currentScreen === 'results' && (
           <motion.div key="results" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
            <ResultsScreen result={predictionResult} formData={formData} onBack={handleBack} theme={theme} />
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
