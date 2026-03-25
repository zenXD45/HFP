import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, FileText, Heart, Zap, Shield, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ResultsScreen = ({ result, onBack }) => {

  const isHighRisk = result?.riskLevel === 'High Risk';
  const probability = result?.probability || 0;
  
  // Colors based on risk
  const accentColor = isHighRisk ? '#F87171' : '#34D399';
  const accentGlow = isHighRisk ? 'rgba(248, 113, 113, 0.3)' : 'rgba(52, 211, 153, 0.3)';
  const accentBg = isHighRisk ? 'rgba(248, 113, 113, 0.08)' : 'rgba(52, 211, 153, 0.08)';

  // SVG circle math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (probability / 100) * circumference;

  const handleGeneratePdf = async () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;

    const buttons = document.getElementById('action-buttons');
    if (buttons) buttons.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0B0F1A' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Heart_Failure_Risk_Report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report.");
    } finally {
      if (buttons) buttons.style.display = 'flex';
    }
  };

  return (
    <div id="pdf-content" style={{ paddingBottom: '140px' }}>
      
      {/* Hero Result Card — Circular Gauge */}
      <motion.div 
        className="glass-card" 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px 32px' }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Circular Progress Ring */}
        <motion.div 
          style={{ position: 'relative', width: 140, height: 140, marginBottom: 24 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 150, damping: 15 }}
        >
          <svg width="140" height="140" className="risk-ring">
            {/* Background track */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="10"
            />
            {/* Animated arc */}
            <motion.circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={accentColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: `drop-shadow(0 0 10px ${accentGlow})` }}
            />
          </svg>
          {/* Center text */}
          <div style={{ 
            position: 'absolute', inset: 0, 
            display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center'
          }}>
            <motion.span 
              style={{ fontSize: '2.2rem', fontWeight: 800, color: accentColor, lineHeight: 1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring' }}
            >
              {probability}%
            </motion.span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Risk Score
            </span>
          </div>
        </motion.div>
        
        {/* Risk badge */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`stat-pill ${isHighRisk ? 'danger' : 'success'}`}
          style={{ marginBottom: 16 }}
        >
          {isHighRisk ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
          {result?.riskLevel || 'Low Risk'}
        </motion.div>

        <motion.p 
          style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 280, lineHeight: 1.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isHighRisk 
            ? "Elevated cardiac risk detected. Please consult a cardiologist for a comprehensive evaluation."
            : "Your cardiac risk profile appears favorable. Continue maintaining a healthy lifestyle."}
        </motion.p>
      </motion.div>

      {/* Risk Bar Detail Card */}
      <motion.div 
        className="glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} style={{ color: 'var(--warning)' }} />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Risk Analysis</span>
          </div>
          <span style={{ color: accentColor, fontWeight: 700, fontSize: '0.85rem' }}>{probability}/100</span>
        </div>
        
        {/* Risk bar */}
        <div className="risk-bar-track" style={{ marginBottom: 16 }}>
          <motion.div 
            className={`risk-bar-fill ${isHighRisk ? 'high' : 'low'}`}
            initial={{ width: 0 }}
            animate={{ width: `${probability}%` }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Scale labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600 }}>LOW RISK</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--warning)', fontWeight: 600 }}>MODERATE</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--danger)', fontWeight: 600 }}>HIGH RISK</span>
        </div>

        {/* Detailed info grid */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-item-label">Prediction</div>
            <div className="info-item-value" style={{ color: accentColor }}>
              {isHighRisk ? 'Positive' : 'Negative'}
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Confidence</div>
            <div className="info-item-value">
              {isHighRisk ? probability : 100 - probability}%
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Heart Rhythm</div>
            <div className="info-item-value" style={{ fontSize: '0.85rem' }}>
              {result?.rhythm || 'N/A'}
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-label">Model</div>
            <div className="info-item-value" style={{ fontSize: '0.85rem' }}>
              Random Forest
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recommendation Card */}
      <motion.div 
        className="glass-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Shield size={16} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recommendation</span>
        </div>
        <div style={{ 
          background: isHighRisk ? 'rgba(248, 113, 113, 0.06)' : 'rgba(52, 211, 153, 0.06)', 
          border: `1px solid ${isHighRisk ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)'}`,
          borderRadius: 'var(--radius-md)', 
          padding: '14px 16px' 
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>
            {isHighRisk 
              ? "⚠️ Your results indicate elevated cardiovascular risk. We strongly recommend scheduling an appointment with a cardiologist for further diagnostic testing including echocardiography and stress testing."
              : "✅ Your results are encouraging. To maintain heart health, continue regular exercise, a balanced diet, and routine check-ups. Monitor blood pressure and cholesterol levels periodically."}
          </p>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      <div id="action-buttons" className="bottom-bar" style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
         <motion.button 
           onClick={handleGeneratePdf} 
           className="btn-primary"
           whileTap={{ scale: 0.97 }}
           style={{ maxWidth: 520 }}
         >
           <FileText size={18} /> Generate PDF Report
         </motion.button>
         <motion.button 
           onClick={onBack} 
           className="btn-secondary"
           whileTap={{ scale: 0.97 }}
           style={{ maxWidth: 520 }}
         >
           <ArrowLeft size={18} /> New Assessment
         </motion.button>
      </div>

    </div>
  );
};

export default ResultsScreen;
