import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Add styling
import Confetti from 'react-confetti';

const App = () => {
  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [celebrate, setCelebrate] = useState(false); // For confetti
  const [thumbsDown, setThumbsDown] = useState(false); // For thumbs-down emojis

  const offset = Math.random() * 100; // Random offset for pagination
  const API_KEY = '5c83ba5b-2f6f-4258-9925-9952d28b54d0'; // Replace with your CricAPI key
  const API_URL = `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=${offset}`;

  const handleSurpriseMe = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      const matches = response.data.data; // Updated to match the provided data structure

      // Filter for live or ended matches
      const validMatches = matches.filter(match => match.matchStarted && match.matchEnded);

      if (validMatches.length === 0) {
        setError('No matches found.');
        setLoading(false);
        return;
      }

      // Randomly select a match
      const randomMatch = validMatches[Math.floor(Math.random() * validMatches.length)];
      setMatch(randomMatch);
      setPrediction('');
      setResult('');
      setCelebrate(false);
      setThumbsDown(false);
    } catch (err) {
      setError('Failed to fetch match data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrediction = (team) => {
    setPrediction(team);
    if (team === match.status.split(' won ')[0]) {
      setResult('Correct! You predicted the winning team.');
      setCelebrate(true);
    } else {
      setResult(`Incorrect! The winning team was ${match.status.split(' won ')[0]}.`);
      setThumbsDown(true); // Trigger thumbs-down emojis
    }
  };

  // Reset celebration effects after a few seconds
  useEffect(() => {
    if (celebrate || thumbsDown) {
      const timer = setTimeout(() => {
        setCelebrate(false);
        setThumbsDown(false);
      }, 5000); // Stop effects after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [celebrate, thumbsDown]);

  return (
    <div className="container">
      <button onClick={handleSurpriseMe} disabled={loading} className="button-85">
        {loading ? 'Loading...' : 'Surprise Me!'}
      </button>

      {error && <p className="error">{error}</p>}

      {match && (<h1>Cricket Score Predictor</h1>)}
      {match && (
        <div className="match-details">
          <h2>Match: {match.teams[0]} vs {match.teams[1]}</h2>
          <p>Venue: {match.venue}</p>
          <p>Date: {new Date(match.date).toLocaleDateString()}</p>

          <h3>Predict the winning team</h3>
          <div className="prediction-buttons">
            <button
              onClick={() => handlePrediction(match.teams[0])}
              className={!!prediction ? prediction == match.teams[0] ? "button-50 disabled" : "button-50 disabled loser" :"button-50"}
              disabled={!!prediction} // Disable if prediction is made
            >
              {match.teams[0]}
            </button>
            <button
              onClick={() => handlePrediction(match.teams[1])}
              className={!!prediction ? prediction == match.teams[1] ? "button-50 disabled" : "button-50 disabled loser" :"button-50"}
              disabled={!!prediction} // Disable if prediction is made
            >
              {match.teams[1]}
            </button>
          </div>

          {prediction && (
            <div className="result">
              <h3>{result}</h3>
              <div className="score-details">
                <h3>Scores:</h3>
                {match.score && match.score.map((inning, index) => (
                  <p key={index}>
                    {inning.inning}: {inning.r}/{inning.w} in {inning.o} overs
                  </p>
                ))}
                <p>Status: {match.status}</p>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Confetti for correct prediction */}
      {celebrate && <Confetti />}

      {/* Thumbs-down emojis for incorrect prediction */}
      {thumbsDown && (
        <div className="wrong-prediction-container">
          {Array.from({ length: 50 }).map((_, index) => (
            <span
              key={index}
              className="wrong-prediction-emoji"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            >
              😢
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;