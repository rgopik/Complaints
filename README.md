# Text Analysis Tool

A single page web application that analyzes text for sentiment, emotions, threats, and vulnerabilities. Built with React frontend and Node.js/Express backend.

![Text Analysis Tool](https://github.com/user-attachments/assets/f2bf73ab-a861-44f2-b2a7-0de73eb66b85)

## Features

- **Text Input**: Accept up to 10,000 characters of text for analysis
- **Sentiment Analysis**: Detect positive, negative, or neutral sentiment with confidence scores
- **Threat Assessment**: Identify potential threats in text content
- **Vulnerability Detection**: Detect signs of vulnerability or weakness
- **Emotion Analysis**: Analyze emotions including anger, fear, joy, sadness, and surprise
- **User Feedback**: Collect user feedback to improve analysis accuracy
- **Real-time Validation**: Input validation with character counting and error handling
- **Accessible UI**: Screen reader friendly with proper ARIA labels and keyboard navigation
- **Responsive Design**: Works on desktop and mobile devices

![Analysis Results](https://github.com/user-attachments/assets/ce6ae318-575e-47f5-a5f6-939dbca0728e)

## Technology Stack

- **Frontend**: React 18, CSS3, Axios for API calls
- **Backend**: Node.js, Express.js, CORS middleware
- **Analysis**: Mock NLP logic (easily replaceable with real NLP APIs)
- **Storage**: In-memory feedback storage (can be replaced with database)

## Project Structure

```
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file with API endpoints
│   ├── package.json        # Backend dependencies
│   └── node_modules/       # Backend dependencies (auto-generated)
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── TextAnalyzer.js      # Text input component
│   │   │   ├── AnalysisResults.js   # Results display component
│   │   │   ├── FeedbackForm.js      # Feedback form component
│   │   │   ├── TextAnalyzer.css     # Text analyzer styles
│   │   │   ├── AnalysisResults.css  # Results styles
│   │   │   └── FeedbackForm.css     # Feedback form styles
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Main application styles
│   │   └── index.js        # React entry point
│   ├── public/             # Static files
│   ├── package.json        # Frontend dependencies
│   └── build/              # Production build (auto-generated)
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## API Endpoints

### Backend Server (Port 5000)

- `GET /health` - Health check endpoint
- `POST /analyze` - Analyze text for sentiment, emotions, threats, and vulnerabilities
- `POST /feedback` - Submit user feedback about analysis results
- `GET /feedback` - Retrieve feedback data (for debugging/admin purposes)

## Setup and Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your browser.

## Running the Application

1. **Start the Backend** (in one terminal):
```bash
cd backend
npm start
```

2. **Start the Frontend** (in another terminal):
```bash
cd frontend
npm start
```

3. **Access the Application**:
   - Open your browser and go to `http://localhost:3000`
   - The React app will automatically connect to the backend on `http://localhost:5000`

## Usage

1. **Enter Text**: Type or paste your text (up to 10,000 characters) into the text area
2. **Analyze**: Click the "Analyze Text" button to process your text
3. **View Results**: Review the analysis results showing:
   - Sentiment (positive/negative/neutral)
   - Threat level (high/medium/low)
   - Vulnerability level (high/medium/low)
   - Emotion breakdown with dominant emotion
   - Analysis metadata (word count, character count, timestamp)
4. **Provide Feedback**: Click "Provide Feedback" to rate the analysis and submit comments
5. **Clear and Repeat**: Use the "Clear" button to start over with new text

## Input Validation

- **Character Limit**: Maximum 10,000 characters with real-time counter
- **Empty Text**: Prevents submission of empty or whitespace-only text
- **Error Handling**: Clear error messages for various failure scenarios
- **Real-time Feedback**: Character count updates as you type, with visual warnings

## Analysis Logic

The current implementation uses mock analysis logic that can be easily replaced with real NLP APIs:

- **Sentiment**: Word-based scoring using positive/negative word dictionaries
- **Threats**: Keyword detection for threat-related terms
- **Vulnerabilities**: Keyword detection for vulnerability-related terms
- **Emotions**: Multi-category emotion detection (anger, fear, joy, sadness, surprise)

## Feedback System

- User feedback is collected including:
  - Star ratings (1-5 stars)
  - Written comments about accuracy
  - Suggestions for improvement
  - Optional email for follow-up
- Feedback is stored in memory (can be replaced with database storage)
- Validation ensures at least one form of feedback is provided

## Accessibility Features

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast Mode**: Support for high contrast displays
- **Reduced Motion**: Respects user motion preferences
- **Focus Management**: Clear focus indicators
- **Error Announcements**: Screen reader announcements for errors

## Development

### Backend Development

- The backend uses Express.js with CORS enabled for cross-origin requests
- Mock analysis functions can be found in `backend/server.js`
- To integrate real NLP APIs, replace the `analyzeText()` function

### Frontend Development

- React components are modular and reusable
- CSS uses modern features like Grid and Flexbox
- API calls are centralized using Axios
- Environment variables can be used to configure API endpoints

### Building for Production

**Frontend Production Build**:
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

You can configure the API base URL using environment variables:

**Frontend** (`.env` file in frontend directory):
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

## Future Enhancements

- Replace mock analysis with real NLP APIs (OpenAI, Google Cloud NLP, AWS Comprehend)
- Add database storage for feedback and analysis history
- Implement user authentication and analysis history
- Add more sophisticated emotion and sentiment analysis
- Support for multiple languages
- Batch analysis for multiple texts
- Export analysis results to various formats
- Real-time analysis as user types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.