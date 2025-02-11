import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Loader } from 'lucide-react';
import axios from 'axios';

function Validation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location.state) {
      navigate('/create');
      return;
    }
    generateFeedback();
  }, [location, navigate]);

  const generateFeedback = async () => {
    const { questions, answers, interviewData } = location.state;
    setLoading(true);

    try {
      const feedbackPromises = questions.map(async (question, index) => {
        const prompt = `
          As an interview evaluator for a ${interviewData.jobRole} position, analyze this response:
          Experience Level: ${interviewData.experience} years
          Tech Stack: ${interviewData.techStack}
          
          Question: ${question}
          Answer: ${answers[index]}
          
          Provide:
          Rating: [1-5]
          Detailed feedback: [Your detailed analysis]
          Areas of improvement: [Specific suggestions]
        `;

        const response = await axios.post('http://localhost:8000/chat', {
          message: prompt
        });

        return {
          question,
          answer: answers[index],
          feedback: response.data.response
        };
      });

      const feedbackResults = await Promise.all(feedbackPromises);
      setFeedback(feedbackResults);
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 animate-spin mx-auto text-blue-500" />
          <h2 className="text-xl font-medium">Analyzing Your Responses</h2>
          <p className="text-gray-400">Generating comprehensive feedback...</p>
        </div>
      </div>
    );
  }

  const averageRating = feedback.length
    ? (feedback.reduce((acc, item) => {
        const rating = parseInt(item.feedback.split('\n')[0].split(':')[1]) || 0;
        return acc + rating;
      }, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Interview Analysis
          </h1>
          <p className="text-gray-400">
            Average Performance Rating: {averageRating}/5
          </p>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-6">
          {feedback.map((item, index) => {
            const sections = item.feedback.split('\n').reduce((acc, line) => {
              if (line.startsWith('Rating:')) acc.rating = parseInt(line.split(':')[1]);
              else if (line.startsWith('Detailed feedback:')) acc.detailed = line.split(':')[1];
              else if (line.startsWith('Areas of improvement:')) acc.improvement = line.split(':')[1];
              return acc;
            }, { rating: 0, detailed: '', improvement: '' });

            return (
              <div key={index} className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 space-y-4">
                  {/* Question and Answer */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Question {index + 1}</h3>
                    <p className="text-gray-300 mb-4">{item.question}</p>
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Your Answer:</h4>
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < sections.rating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-500'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Feedback Sections */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Detailed Feedback</h4>
                      <p className="text-gray-300">{sections.detailed}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Areas for Improvement</h4>
                      <p className="text-gray-300">{sections.improvement}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default Validation;