import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Activity, HeartPulse } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }
};

const DashboardScreen = ({ onPredict }) => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    restingBP: '',
    cholesterol: '',
    fastingBS: 0,
    chestPainType: 'ASY',
    restingECG: 'Normal',
    maxHR: '',
    exerciseAngina: 'N',
    oldpeak: '',
    stSlope: 'Flat'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <motion.form 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      onSubmit={handleSubmit} 
      style={{ paddingBottom: '100px' }}
    >
      
      {/* Patient Info Card */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="section-header">
          <div className="section-icon purple">
            <User size={16} />
          </div>
          <span className="section-title">Patient Information</span>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label className="input-label">Age</label>
          <input 
            type="number" 
            name="age" 
            className="input-field" 
            placeholder="e.g. 55" 
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>

        <div>
           <label className="input-label">Gender</label>
           <div className="options-grid">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.gender === 'M' ? 'selected' : ''}`}
                onClick={() => handleSelect('gender', 'M')}
              >
                ♂ MALE
              </motion.div>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.gender === 'F' ? 'selected' : ''}`}
                onClick={() => handleSelect('gender', 'F')}
              >
                ♀ FEMALE
              </motion.div>
           </div>
        </div>
      </motion.div>

      {/* Vital Signs Card */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="section-header">
          <div className="section-icon teal">
            <Activity size={16} />
          </div>
          <span className="section-title">Vital Signs</span>
        </div>
        
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <label className="input-label">Resting Blood Pressure</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              name="restingBP" 
              className="input-field" 
              placeholder="120" 
              value={formData.restingBP}
              onChange={handleChange}
              required
            />
            <span className="input-unit">mm Hg</span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="input-label">Cholesterol</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="number" 
              name="cholesterol" 
              className="input-field" 
              placeholder="198" 
              value={formData.cholesterol}
              onChange={handleChange}
              required
            />
            <span className="input-unit">mg/dL</span>
          </div>
        </div>

        <div>
           <label className="input-label">Fasting Blood Sugar {'>'} 120 mg/dl</label>
           <div className="options-grid">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.fastingBS === 1 ? 'selected' : ''}`}
                onClick={() => handleSelect('fastingBS', 1)}
              >
                YES
              </motion.div>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.fastingBS === 0 ? 'selected' : ''}`}
                onClick={() => handleSelect('fastingBS', 0)}
              >
                NO
              </motion.div>
           </div>
        </div>
      </motion.div>

      {/* ECG & Stress Test Card */}
      <motion.div variants={itemVariants} className="glass-card">
        <div className="section-header">
          <div className="section-icon rose">
            <HeartPulse size={16} />
          </div>
          <span className="section-title">ECG & Stress Test</span>
        </div>

        <div style={{ marginBottom: 16 }}>
           <label className="input-label">Chest Pain Type</label>
           <select 
              name="chestPainType" 
              className="input-field" 
              value={formData.chestPainType}
              onChange={handleChange}
           >
              <option value="TA">Typical Angina</option>
              <option value="ATA">Atypical Angina</option>
              <option value="NAP">Non-Anginal Pain</option>
              <option value="ASY">Asymptomatic</option>
           </select>
        </div>

        <div style={{ marginBottom: 16 }}>
           <label className="input-label">Resting ECG</label>
           <select 
              name="restingECG" 
              className="input-field" 
              value={formData.restingECG}
              onChange={handleChange}
           >
              <option value="Normal">Normal</option>
              <option value="ST">ST-T Wave Abnormality</option>
              <option value="LVH">Left Ventricular Hypertrophy</option>
           </select>
        </div>

        <div style={{ marginBottom: 16 }}>
           <label className="input-label">Exercise Induced Angina</label>
           <div className="options-grid">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.exerciseAngina === 'Y' ? 'selected' : ''}`}
                onClick={() => handleSelect('exerciseAngina', 'Y')}
              >
                YES
              </motion.div>
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className={`option-box ${formData.exerciseAngina === 'N' ? 'selected' : ''}`}
                onClick={() => handleSelect('exerciseAngina', 'N')}
              >
                NO
              </motion.div>
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

        <div>
           <label className="input-label">ST Slope</label>
           <select 
              name="stSlope" 
              className="input-field" 
              value={formData.stSlope}
              onChange={handleChange}
           >
              <option value="Up">Upsloping</option>
              <option value="Flat">Flat</option>
              <option value="Down">Downsloping</option>
           </select>
        </div>

      </motion.div>

      {/* Floating Action Button */}
      <motion.div variants={itemVariants} className="bottom-bar">
        <button type="submit" className="btn-primary">
          <HeartPulse size={18} />
          Analyze Risk
        </button>
      </motion.div>

    </motion.form>
  );
};

export default DashboardScreen;
