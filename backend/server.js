const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory storage for feedback (in production, use a database)
const feedbackStorage = [];

// Mock analysis function
function analyzeText(text) {
  // Simple mock analysis logic - in production, this would call an NLP API
  const wordCount = text.split(/\s+/).length;
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'happy', 'joy', 'pleased'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'disappointed', 'frustrated', 'annoying'];
  const threatWords = ['kill', 'destroy', 'attack', 'hurt', 'harm', 'violence', 'bomb', 'gun', 'threat', 'danger'];
  const vulnerabilityWords = ['weak', 'vulnerable', 'exposed', 'insecure', 'helpless', 'defenseless', 'fragile'];
  
  const lowerText = text.toLowerCase();
  
  // Sentiment analysis
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
    positiveCount += matches;
  });
  
  negativeWords.forEach(word => {
    const matches = (lowerText.match(new RegExp(word, 'g')) || []).length;
    negativeCount += matches;
  });
  
  let sentiment = 'neutral';
  if (positiveCount > negativeCount) {
    sentiment = 'positive';
  } else if (negativeCount > positiveCount) {
    sentiment = 'negative';
  }
  
  // Threat analysis
  const threatCount = threatWords.reduce((count, word) => {
    return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
  }, 0);
  
  const threatLevel = threatCount > 0 ? (threatCount > 2 ? 'high' : 'medium') : 'low';
  
  // Vulnerability analysis
  const vulnerabilityCount = vulnerabilityWords.reduce((count, word) => {
    return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
  }, 0);
  
  const vulnerabilityLevel = vulnerabilityCount > 0 ? (vulnerabilityCount > 2 ? 'high' : 'medium') : 'low';
  
  // Emotion analysis
  const emotions = {
    anger: ['angry', 'furious', 'rage', 'mad', 'irritated', 'annoyed'].reduce((count, word) => {
      return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
    }, 0),
    fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous'].reduce((count, word) => {
      return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
    }, 0),
    joy: ['happy', 'joyful', 'excited', 'delighted', 'cheerful', 'elated'].reduce((count, word) => {
      return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
    }, 0),
    sadness: ['sad', 'depressed', 'melancholy', 'gloomy', 'miserable', 'upset'].reduce((count, word) => {
      return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
    }, 0),
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned'].reduce((count, word) => {
      return count + (lowerText.match(new RegExp(word, 'g')) || []).length;
    }, 0)
  };
  
  // Find dominant emotion
  const dominantEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
  
  return {
    sentiment: {
      overall: sentiment,
      confidence: Math.min(Math.abs(positiveCount - negativeCount) / wordCount * 100, 100),
      positiveScore: positiveCount,
      negativeScore: negativeCount
    },
    threat: {
      level: threatLevel,
      score: threatCount,
      detected: threatCount > 0
    },
    vulnerability: {
      level: vulnerabilityLevel,
      score: vulnerabilityCount,
      detected: vulnerabilityCount > 0
    },
    emotions: {
      scores: emotions,
      dominant: dominantEmotion,
      intensity: emotions[dominantEmotion]
    },
    metadata: {
      wordCount,
      characterCount: text.length,
      analyzedAt: new Date().toISOString()
    }
  };
}

// Validation middleware
function validateTextInput(req, res, next) {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ 
      error: 'Text input is required',
      code: 'MISSING_TEXT'
    });
  }
  
  if (typeof text !== 'string') {
    return res.status(400).json({ 
      error: 'Text must be a string',
      code: 'INVALID_TEXT_TYPE'
    });
  }
  
  if (text.length > 10000) {
    return res.status(400).json({ 
      error: 'Text exceeds maximum length of 10,000 characters',
      code: 'TEXT_TOO_LONG',
      maxLength: 10000,
      currentLength: text.length
    });
  }
  
  if (text.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Text cannot be empty or contain only whitespace',
      code: 'EMPTY_TEXT'
    });
  }
  
  next();
}

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'text-analysis-api'
  });
});

// Analyze text endpoint
app.post('/analyze', validateTextInput, (req, res) => {
  try {
    const { text } = req.body;
    const analysis = analyzeText(text);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Internal server error during analysis',
      code: 'ANALYSIS_ERROR'
    });
  }
});

// Feedback endpoint
app.post('/feedback', (req, res) => {
  try {
    const { 
      originalText, 
      analysisResults, 
      userFeedback, 
      rating, 
      suggestions,
      userEmail 
    } = req.body;
    
    // Validate feedback data
    if (!userFeedback && !rating && !suggestions) {
      return res.status(400).json({
        error: 'At least one feedback field (feedback, rating, or suggestions) is required',
        code: 'MISSING_FEEDBACK'
      });
    }
    
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({
        error: 'Rating must be a number between 1 and 5',
        code: 'INVALID_RATING'
      });
    }
    
    const feedbackEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      originalText: originalText || '',
      analysisResults: analysisResults || {},
      userFeedback: userFeedback || '',
      rating: rating || null,
      suggestions: suggestions || '',
      userEmail: userEmail || null
    };
    
    feedbackStorage.push(feedbackEntry);
    
    console.log('Feedback received:', {
      id: feedbackEntry.id,
      timestamp: feedbackEntry.timestamp,
      rating: feedbackEntry.rating,
      hasText: !!feedbackEntry.userFeedback
    });
    
    res.json({
      success: true,
      message: 'Feedback received successfully',
      feedbackId: feedbackEntry.id
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      error: 'Internal server error while processing feedback',
      code: 'FEEDBACK_ERROR'
    });
  }
});

// Get feedback (for debugging/admin purposes)
app.get('/feedback', (req, res) => {
  res.json({
    success: true,
    count: feedbackStorage.length,
    feedback: feedbackStorage.slice(-10) // Return last 10 feedback entries
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;