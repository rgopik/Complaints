import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const FeedbackForm = ({ originalText, analysisResults, onFeedbackSubmitted, onCancel }) => {
  const [feedback, setFeedback] = useState({
    userFeedback: '',
    rating: 0,
    suggestions: '',
    userEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFeedback(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFeedback(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!feedback.userFeedback.trim() && !feedback.rating && !feedback.suggestions.trim()) {
      newErrors.general = 'Please provide at least one form of feedback (rating, comments, or suggestions)';
    }
    
    if (feedback.userEmail && !isValidEmail(feedback.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const feedbackData = {
        originalText,
        analysisResults,
        userFeedback: feedback.userFeedback.trim(),
        rating: feedback.rating || null,
        suggestions: feedback.suggestions.trim(),
        userEmail: feedback.userEmail.trim() || null
      };

      const response = await axios.post(`${API_BASE_URL}/feedback`, feedbackData);

      if (response.data.success) {
        setSubmitted(true);
        setTimeout(() => {
          onFeedbackSubmitted();
        }, 2000);
      } else {
        setErrors({ general: 'Failed to submit feedback. Please try again.' });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        setErrors({ general: errorData.error || 'Server error occurred' });
      } else if (error.request) {
        setErrors({ general: 'Cannot connect to server. Please check if the backend is running.' });
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-form submitted">
        <div className="success-message">
          <h3>✅ Thank you for your feedback!</h3>
          <p>Your feedback has been submitted successfully and will help improve our analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form">
      <div className="feedback-header">
        <h3>Provide Feedback</h3>
        <p>Help us improve our text analysis by sharing your thoughts on the results.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <div className="error-message general-error" role="alert">
            {errors.general}
          </div>
        )}

        {/* Rating Section */}
        <div className="form-section">
          <label className="section-label">
            How would you rate the accuracy of this analysis?
          </label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${feedback.rating >= star ? 'filled' : ''}`}
                onClick={() => handleRatingChange(star)}
                aria-label={`Rate ${star} out of 5 stars`}
                disabled={submitting}
              >
                ★
              </button>
            ))}
            <span className="rating-label">
              {feedback.rating > 0 && (
                <span>
                  {feedback.rating} / 5 stars
                  {feedback.rating === 1 && ' - Poor'}
                  {feedback.rating === 2 && ' - Fair'}
                  {feedback.rating === 3 && ' - Good'}
                  {feedback.rating === 4 && ' - Very Good'}
                  {feedback.rating === 5 && ' - Excellent'}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="form-section">
          <label htmlFor="user-feedback" className="section-label">
            Comments about the analysis results (optional)
          </label>
          <textarea
            id="user-feedback"
            value={feedback.userFeedback}
            onChange={handleInputChange('userFeedback')}
            placeholder="Tell us what you think about the analysis results. Was anything incorrect or missing?"
            disabled={submitting}
            className={errors.userFeedback ? 'error' : ''}
            rows={4}
          />
          {errors.userFeedback && (
            <div className="error-message" role="alert">
              {errors.userFeedback}
            </div>
          )}
        </div>

        {/* Suggestions Section */}
        <div className="form-section">
          <label htmlFor="suggestions" className="section-label">
            Suggestions for improvement (optional)
          </label>
          <textarea
            id="suggestions"
            value={feedback.suggestions}
            onChange={handleInputChange('suggestions')}
            placeholder="How can we improve our text analysis? Any features you'd like to see?"
            disabled={submitting}
            className={errors.suggestions ? 'error' : ''}
            rows={3}
          />
          {errors.suggestions && (
            <div className="error-message" role="alert">
              {errors.suggestions}
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="form-section">
          <label htmlFor="user-email" className="section-label">
            Email (optional - for follow-up)
          </label>
          <input
            type="email"
            id="user-email"
            value={feedback.userEmail}
            onChange={handleInputChange('userEmail')}
            placeholder="your.email@example.com"
            disabled={submitting}
            className={errors.userEmail ? 'error' : ''}
          />
          {errors.userEmail && (
            <div className="error-message" role="alert">
              {errors.userEmail}
            </div>
          )}
          <div className="help-text">
            We'll only use this to follow up on your feedback if needed.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          <button 
            type="submit" 
            disabled={submitting}
            className="submit-button"
          >
            {submitting ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              'Submit Feedback'
            )}
          </button>
          
          <button 
            type="button" 
            onClick={onCancel}
            disabled={submitting}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;