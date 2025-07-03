import React, { useState } from 'react';
import axios from 'axios';
import './TextAnalyzer.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const TextAnalyzer = ({ onAnalysisComplete, onAnalysisError, loading, setLoading }) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [errors, setErrors] = useState({});

  const MAX_CHARS = 10000;

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    
    // Clear errors when user starts typing
    if (errors.text) {
      setErrors({});
    }
  };

  const validateInput = () => {
    const newErrors = {};
    
    if (!text.trim()) {
      newErrors.text = 'Please enter some text to analyze';
    } else if (text.length > MAX_CHARS) {
      newErrors.text = `Text exceeds maximum length of ${MAX_CHARS} characters`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        text: text.trim()
      });

      if (response.data.success) {
        onAnalysisComplete(response.data.data, text.trim());
      } else {
        onAnalysisError('Analysis failed. Please try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        if (errorData.code === 'TEXT_TOO_LONG') {
          setErrors({ text: errorData.error });
        } else if (errorData.code === 'EMPTY_TEXT') {
          setErrors({ text: errorData.error });
        } else {
          onAnalysisError(errorData.error || 'Server error occurred');
        }
      } else if (error.request) {
        // Request was made but no response received
        onAnalysisError('Cannot connect to analysis server. Please check if the backend is running.');
      } else {
        // Something else happened
        onAnalysisError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setCharCount(0);
    setErrors({});
  };

  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  return (
    <div className="text-analyzer">
      <h2>Enter Text to Analyze</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="textarea-container">
          <label htmlFor="analysis-text" className="sr-only">
            Text to analyze (maximum {MAX_CHARS} characters)
          </label>
          <textarea
            id="analysis-text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your text here for sentiment, emotion, threat, and vulnerability analysis..."
            disabled={loading}
            className={`analysis-textarea ${errors.text ? 'error' : ''} ${isOverLimit ? 'over-limit' : ''}`}
            rows={8}
            aria-describedby="char-count error-message"
            maxLength={MAX_CHARS + 100} // Allow slightly over limit for user feedback
          />
          
          <div 
            id="char-count" 
            className={`char-counter ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
            {isOverLimit && (
              <span className="over-limit-text">
                {' '}(Over limit by {(charCount - MAX_CHARS).toLocaleString()})
              </span>
            )}
          </div>
        </div>

        {errors.text && (
          <div id="error-message" className="error-message" role="alert">
            {errors.text}
          </div>
        )}

        <div className="button-group">
          <button 
            type="submit" 
            disabled={loading || !text.trim() || isOverLimit}
            className="analyze-button"
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={handleClear}
            disabled={loading || !text}
            className="clear-button"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextAnalyzer;