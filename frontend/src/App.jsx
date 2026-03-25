import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardScreen from './screens/DashboardScreen';
import ResultsScreen from './screens/ResultsScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [formData, setFormData] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);

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
          <div className="header-title">CardioGuard</div>
          <div className="header-subtitle">Heart Failure Risk Analysis</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
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
            <div className="loading-spinner"></div>
            <p className="loading-text">Analyzing cardiac data...</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: 8 }}>Running ML model prediction</p>
          </motion.div>
        )}

        {currentScreen === 'results' && (
           <motion.div key="results" initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ type: 'spring', stiffness: 260, damping: 28 }}>
            <ResultsScreen result={predictionResult} onBack={handleBack}/>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
