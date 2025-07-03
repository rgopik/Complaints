import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

// Try to import config, fallback to default if not found
let CONFIG;
try {
  CONFIG = require('./config').CONFIG;
} catch (error) {
  // Fallback configuration if config.js doesn't exist
  CONFIG = {
    BACKEND_URL: 'http://192.168.1.100:5000', // Replace with your backend server IP
    MAX_CHARACTERS: 10000,
    ENDPOINTS: {
      ANALYZE: '/analyze',
      FEEDBACK: '/feedback'
    },
    REQUEST_TIMEOUT: 30000,
    UI: {
      PRIMARY_COLOR: '#2196F3',
      SUCCESS_COLOR: '#4CAF50',
      WARNING_COLOR: '#FF9800',
      ERROR_COLOR: '#F44336',
      NEUTRAL_COLOR: '#757575'
    }
  };
}

// Configure axios timeout
axios.defaults.timeout = CONFIG.REQUEST_TIMEOUT;

export default function App() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const analyzeText = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text to analyze');
      return;
    }

    if (inputText.length > CONFIG.MAX_CHARACTERS) {
      Alert.alert('Error', `Text exceeds ${CONFIG.MAX_CHARACTERS} character limit`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${CONFIG.BACKEND_URL}${CONFIG.ENDPOINTS.ANALYZE}`, {
        text: inputText,
      });
      setAnalysisResult(response.data);
      setShowFeedback(false);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Error',
        'Failed to analyze text. Please check your connection and backend server.'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter feedback');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${CONFIG.BACKEND_URL}${CONFIG.ENDPOINTS.FEEDBACK}`, {
        originalText: inputText,
        analysis: analysisResult,
        feedback: feedbackText,
      });
      Alert.alert('Success', 'Feedback submitted successfully');
      setFeedbackText('');
      setShowFeedback(false);
    } catch (error) {
      console.error('Feedback error:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setInputText('');
    setAnalysisResult(null);
    setShowFeedback(false);
    setFeedbackText('');
  };

  const renderAnalysisResult = () => {
    if (!analysisResult) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Analysis Results</Text>
        
        {/* Sentiment */}
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Sentiment</Text>
          <Text style={[styles.sectionValue, { color: getSentimentColor(analysisResult.sentiment) }]}>
            {analysisResult.sentiment || 'Not detected'}
          </Text>
        </View>

        {/* Threat Level */}
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Threat Level</Text>
          <Text style={[styles.sectionValue, { color: getThreatColor(analysisResult.threat) }]}>
            {analysisResult.threat || 'Not detected'}
          </Text>
        </View>

        {/* Vulnerability */}
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Vulnerability</Text>
          <Text style={styles.sectionValue}>
            {analysisResult.vulnerability || 'Not detected'}
          </Text>
        </View>

        {/* Expressions */}
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Key Expressions</Text>
          {analysisResult.expressions && analysisResult.expressions.length > 0 ? (
            analysisResult.expressions.map((expr, index) => (
              <Text key={index} style={styles.expressionItem}>• {expr}</Text>
            ))
          ) : (
            <Text style={styles.sectionValue}>No key expressions found</Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.sectionValue}>
            {analysisResult.details || 'No additional details'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => setShowFeedback(true)}
        >
          <Text style={styles.buttonText}>Provide Feedback</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFeedbackForm = () => {
    if (!showFeedback) return null;

    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Submit Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          multiline
          numberOfLines={4}
          placeholder="Enter your feedback about the analysis..."
          value={feedbackText}
          onChangeText={setFeedbackText}
        />
        <View style={styles.feedbackButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setShowFeedback(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={submitFeedback}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return '#666';
    const s = sentiment.toLowerCase();
    if (s.includes('positive')) return CONFIG.UI.SUCCESS_COLOR;
    if (s.includes('negative')) return CONFIG.UI.ERROR_COLOR;
    return CONFIG.UI.WARNING_COLOR;
  };

  const getThreatColor = (threat) => {
    if (!threat) return '#666';
    const t = threat.toLowerCase();
    if (t.includes('high') || t.includes('severe')) return CONFIG.UI.ERROR_COLOR;
    if (t.includes('medium') || t.includes('moderate')) return CONFIG.UI.WARNING_COLOR;
    if (t.includes('low') || t.includes('minimal')) return CONFIG.UI.SUCCESS_COLOR;
    return '#666';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Complaints Analyzer</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Enter text to analyze ({inputText.length}/{CONFIG.MAX_CHARACTERS} characters)
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={6}
              placeholder="Enter your complaint or text here..."
              value={inputText}
              onChangeText={setInputText}
              maxLength={CONFIG.MAX_CHARACTERS}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.analyzeButton]}
              onPress={analyzeText}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Analyzing...' : 'Analyze Text'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={resetForm}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {renderAnalysisResult()}
          {renderFeedbackForm()}
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  analyzeButton: {
    backgroundColor: CONFIG.UI.PRIMARY_COLOR,
  },
  resetButton: {
    backgroundColor: CONFIG.UI.NEUTRAL_COLOR,
  },
  feedbackButton: {
    backgroundColor: CONFIG.UI.SUCCESS_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  resultSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sectionValue: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  expressionItem: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
    marginLeft: 10,
  },
  feedbackContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 15,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: CONFIG.UI.NEUTRAL_COLOR,
  },
  submitButton: {
    backgroundColor: CONFIG.UI.SUCCESS_COLOR,
  },
});
