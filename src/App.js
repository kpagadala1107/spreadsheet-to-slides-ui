import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [targetAudience, setTargetAudience] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTargetAudienceChange = (e) => {
    setTargetAudience(e.target.value);
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setDownloading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetAudience', targetAudience);
    
    try {
      const response = await axios.post('https://spreadsheet-to-slides-production.up.railway.app/api/convert', formData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error:', error);
      alert('Error converting file');
    }
    setDownloading(false);
  };

  return (
    <div className="app-container">
      <div className="converter-card">
        <div className="header">
          <h1 className="title">📊 Spreadsheet to PowerPoint</h1>
          <p className="subtitle">Convert your Excel or CSV files to professional presentations</p>
        </div>
        
        <div className="upload-section">
          <label className="file-input-label">
            <input 
              type="file" 
              accept=".xlsx,.csv" 
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="file-input-button">
              <span className="upload-icon">📁</span>
              {file ? file.name : 'Choose File'}
            </div>
          </label>
          
          {file && (
            <div className="file-info">
              <span className="file-selected">✓ File selected: {file.name}</span>
            </div>
          )}
        </div>

        <div className="prompt-section">
          <label className="prompt-label">
            Target Audience
          </label>
          <textarea
            value={targetAudience}
            onChange={handleTargetAudienceChange}
            placeholder="Describe your target audience (e.g., 'Executives', 'Sales Team', 'Marketing Department')..."
            className="prompt-input"
            rows="3"
          />
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={!file || downloading}
          className={`convert-button ${downloading ? 'loading' : ''}`}
        >
          {downloading ? (
            <>
              <span className="spinner"></span>
              Converting...
            </>
          ) : (
            <>
              <span className="convert-icon">🚀</span>
              Convert to PowerPoint
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default App;