import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Activity, HeartPulse, ChevronRight, ChevronLeft } from 'lucide-react';

const DashboardScreen = ({ onPredict }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '', gender: 'M', restingBP: '', cholesterol: '',
    fastingBS: 0, chestPainType: 'ASY', restingECG: 'Normal',
    maxHR: '', exerciseAngina: 'N', oldpeak: '', stSlope: 'Flat'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelect = (name, value) => setFormData({ ...formData, [name]: value });

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict({
      ...formData,
      age: Number(formData.age),
      restingBP: Number(formData.restingBP),
      cholesterol: Number(formData.cholesterol),
      maxHR: Number(formData.maxHR),
      oldpeak: Number(formData.oldpeak)
    });
  };

  const currentProgress = (step / 3) * 100;

  const renderStep1 = () => (
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
      <div className="section-header">
        <div className="section-icon purple"><User size={16} /></div>
        <span className="section-title">Patient Demographics</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="input-label">Age</label>
        <input type="number" name="age" className="input-field" placeholder="e.g. 55" value={formData.age} onChange={handleChange} required />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="input-label">Gender</label>
        <div className="options-grid">
          <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.gender === 'M' ? 'selected' : ''}`} onClick={() => handleSelect('gender', 'M')}>♂ MALE</motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.gender === 'F' ? 'selected' : ''}`} onClick={() => handleSelect('gender', 'F')}>♀ FEMALE</motion.div>
        </div>
      </div>
      <button type="submit" className="btn-primary" style={{ marginTop: 24 }}>Next Step <ChevronRight size={18} /></button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
      <div className="section-header">
        <div className="section-icon teal"><Activity size={16} /></div>
        <span className="section-title">Vital Signs</span>
      </div>
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label className="input-label">Resting Blood Pressure</label>
        <div style={{ position: 'relative' }}>
          <input type="number" name="restingBP" className="input-field" placeholder="120" value={formData.restingBP} onChange={handleChange} required />
          <span className="input-unit">mm Hg</span>
        </div>
      </div>
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <label className="input-label">Cholesterol</label>
        <div style={{ position: 'relative' }}>
          <input type="number" name="cholesterol" className="input-field" placeholder="198" value={formData.cholesterol} onChange={handleChange} required />
          <span className="input-unit">mg/dL</span>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label className="input-label">Fasting Blood Sugar {'>'} 120 mg/dl</label>
        <div className="options-grid">
          <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.fastingBS === 1 ? 'selected' : ''}`} onClick={() => handleSelect('fastingBS', 1)}>YES</motion.div>
          <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.fastingBS === 0 ? 'selected' : ''}`} onClick={() => handleSelect('fastingBS', 0)}>NO</motion.div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button type="button" onClick={handleBack} className="btn-secondary" style={{ flex: 1 }}><ChevronLeft size={18} /> Back</button>
        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Next <ChevronRight size={18} /></button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card">
      <div className="section-header">
        <div className="section-icon rose"><HeartPulse size={16} /></div>
        <span className="section-title">ECG & Stress Test</span>
      </div>
      <div style={{ marginBottom: 16 }}>
         <label className="input-label">Chest Pain Type</label>
         <select name="chestPainType" className="input-field" value={formData.chestPainType} onChange={handleChange}>
            <option value="TA">Typical Angina</option><option value="ATA">Atypical Angina</option><option value="NAP">Non-Anginal Pain</option><option value="ASY">Asymptomatic</option>
         </select>
      </div>
      <div style={{ marginBottom: 16 }}>
         <label className="input-label">Resting ECG</label>
         <select name="restingECG" className="input-field" value={formData.restingECG} onChange={handleChange}>
            <option value="Normal">Normal</option><option value="ST">ST-T Wave Abnormality</option><option value="LVH">Left Ventricular Hypertrophy</option>
         </select>
      </div>
      <div style={{ marginBottom: 16 }}>
         <label className="input-label">Exercise Induced Angina</label>
         <div className="options-grid">
            <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.exerciseAngina === 'Y' ? 'selected' : ''}`} onClick={() => handleSelect('exerciseAngina', 'Y')}>YES</motion.div>
            <motion.div whileTap={{ scale: 0.95 }} className={`option-box ${formData.exerciseAngina === 'N' ? 'selected' : ''}`} onClick={() => handleSelect('exerciseAngina', 'N')}>NO</motion.div>
         </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <label className="input-label">Max HR</label>
          <div style={{ position: 'relative' }}>
            <input type="number" name="maxHR" className="input-field" placeholder="150" value={formData.maxHR} onChange={handleChange} required />
            <span className="input-unit">bpm</span>
          </div>
        </div>
        <div>
          <label className="input-label">Oldpeak</label>
          <div style={{ position: 'relative' }}>
            <input type="number" step="0.1" name="oldpeak" className="input-field" placeholder="1.5" value={formData.oldpeak} onChange={handleChange} required />
            <span className="input-unit">mm</span>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
         <label className="input-label">ST Slope</label>
         <select name="stSlope" className="input-field" value={formData.stSlope} onChange={handleChange}>
            <option value="Up">Upsloping</option><option value="Flat">Flat</option><option value="Down">Downsloping</option>
         </select>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={handleBack} className="btn-secondary" style={{ flex: 1 }}><ChevronLeft size={18} /> Back</button>
        <button type="submit" className="btn-primary" style={{ flex: 1 }}><HeartPulse size={18} /> Analyze</button>
      </div>
    </motion.div>
  );

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Wizard Progress Bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Step {step} of 3</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{Math.round(currentProgress)}%</span>
        </div>
        <div className="risk-bar-track" style={{ height: 6 }}>
          <motion.div 
            style={{ background: 'var(--primary)', height: '100%', borderRadius: 100 }}
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <form onSubmit={step === 3 ? handleSubmit : handleNext}>
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default DashboardScreen;
