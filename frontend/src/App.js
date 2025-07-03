import React, { useState } from 'react';
import TextAnalyzer from './components/TextAnalyzer';
import AnalysisResults from './components/AnalysisResults';
import FeedbackForm from './components/FeedbackForm';
import './App.css';

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analyzedText, setAnalyzedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnalysisComplete = (results, text) => {
    setAnalysisResults(results);
    setAnalyzedText(text);
    setShowFeedback(false);
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setAnalysisResults(null);
    setAnalyzedText('');
  };

  const handleShowFeedback = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedback(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text Analysis Tool</h1>
        <p>Analyze text for sentiment, emotions, threats, and vulnerabilities</p>
      </header>
      
      <main className="App-main">
        {error && (
          <div className="error-banner" role="alert">
            <strong>Error:</strong> {error}
            <button 
              className="error-dismiss"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="analysis-container">
          <TextAnalyzer
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
            loading={loading}
            setLoading={setLoading}
          />

          {analysisResults && (
            <AnalysisResults
              results={analysisResults}
              onShowFeedback={handleShowFeedback}
            />
          )}

          {showFeedback && (
            <FeedbackForm
              originalText={analyzedText}
              analysisResults={analysisResults}
              onFeedbackSubmitted={handleFeedbackSubmitted}
              onCancel={() => setShowFeedback(false)}
            />
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Text Analysis Tool. Built with React and Node.js.</p>
      </footer>
    </div>
  );
}

export default App;
