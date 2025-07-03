import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ results, onShowFeedback }) => {
  const { sentiment, threat, vulnerability, emotions, metadata } = results;

  const getSentimentColor = (sentimentType) => {
    switch (sentimentType) {
      case 'positive': return '#4CAF50';
      case 'negative': return '#f44336';
      case 'neutral': return '#FF9800';
      default: return '#666';
    }
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getVulnerabilityColor = (level) => {
    switch (level) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const formatConfidence = (confidence) => {
    return Math.round(confidence);
  };

  const EmotionBar = ({ emotion, score, maxScore }) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    
    return (
      <div className="emotion-item">
        <div className="emotion-label">
          <span className="emotion-name">{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
          <span className="emotion-score">{score}</span>
        </div>
        <div className="emotion-bar-container">
          <div 
            className="emotion-bar"
            style={{ width: `${percentage}%` }}
            aria-label={`${emotion} intensity: ${score} out of ${maxScore}`}
          />
        </div>
      </div>
    );
  };

  const maxEmotionScore = Math.max(...Object.values(emotions.scores));

  return (
    <div className="analysis-results">
      <div className="results-header">
        <h2>Analysis Results</h2>
        <button 
          className="feedback-button"
          onClick={onShowFeedback}
          aria-label="Provide feedback on this analysis"
        >
          Provide Feedback
        </button>
      </div>

      <div className="results-grid">
        {/* Sentiment Analysis */}
        <div className="result-card sentiment-card">
          <h3>Sentiment Analysis</h3>
          <div className="sentiment-main">
            <div 
              className="sentiment-indicator"
              style={{ backgroundColor: getSentimentColor(sentiment.overall) }}
            >
              {sentiment.overall.toUpperCase()}
            </div>
            <div className="sentiment-details">
              <div className="confidence">
                Confidence: {formatConfidence(sentiment.confidence)}%
              </div>
              <div className="sentiment-scores">
                <span className="positive-score">
                  Positive: {sentiment.positiveScore}
                </span>
                <span className="negative-score">
                  Negative: {sentiment.negativeScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Threat Analysis */}
        <div className="result-card threat-card">
          <h3>Threat Assessment</h3>
          <div className="threat-main">
            <div 
              className="threat-indicator"
              style={{ backgroundColor: getThreatColor(threat.level) }}
            >
              {threat.level.toUpperCase()}
            </div>
            <div className="threat-details">
              <div className="threat-status">
                {threat.detected ? '⚠️ Threats detected' : '✅ No threats detected'}
              </div>
              {threat.detected && (
                <div className="threat-score">
                  Threat indicators: {threat.score}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vulnerability Analysis */}
        <div className="result-card vulnerability-card">
          <h3>Vulnerability Assessment</h3>
          <div className="vulnerability-main">
            <div 
              className="vulnerability-indicator"
              style={{ backgroundColor: getVulnerabilityColor(vulnerability.level) }}
            >
              {vulnerability.level.toUpperCase()}
            </div>
            <div className="vulnerability-details">
              <div className="vulnerability-status">
                {vulnerability.detected ? '⚠️ Vulnerabilities detected' : '✅ No vulnerabilities detected'}
              </div>
              {vulnerability.detected && (
                <div className="vulnerability-score">
                  Vulnerability indicators: {vulnerability.score}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emotion Analysis */}
        <div className="result-card emotions-card">
          <h3>Emotion Analysis</h3>
          <div className="emotions-main">
            <div className="dominant-emotion">
              <strong>Dominant Emotion:</strong> 
              <span className="emotion-name">
                {emotions.dominant.charAt(0).toUpperCase() + emotions.dominant.slice(1)}
              </span>
              <span className="emotion-intensity">
                (Intensity: {emotions.intensity})
              </span>
            </div>
            
            <div className="emotions-breakdown">
              <h4>Emotion Breakdown</h4>
              <div className="emotions-list">
                {Object.entries(emotions.scores).map(([emotion, score]) => (
                  <EmotionBar 
                    key={emotion}
                    emotion={emotion}
                    score={score}
                    maxScore={maxEmotionScore}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Metadata */}
      <div className="metadata-section">
        <h3>Analysis Details</h3>
        <div className="metadata-grid">
          <div className="metadata-item">
            <span className="metadata-label">Word Count:</span>
            <span className="metadata-value">{metadata.wordCount.toLocaleString()}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Character Count:</span>
            <span className="metadata-value">{metadata.characterCount.toLocaleString()}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Analyzed At:</span>
            <span className="metadata-value">
              {new Date(metadata.analyzedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;