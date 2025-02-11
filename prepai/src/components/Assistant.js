import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Camera, CameraOff, Mic, MicOff, ChevronRight, ChevronLeft, CheckCircle, User, Home, LogOut, Menu, Phone, Info } from 'lucide-react';
import axios from 'axios';

// Import your profile image
import AIProfileImage from '../img/aiprofile.jpg'; // Update this path to your actual image

function Assistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showRecordButton, setShowRecordButton] = useState(false);

  useEffect(() => {
    if (location.state?.interviewData) {
      setInterviewData(location.state.interviewData);
      generateQuestions(location.state.interviewData);
    }
    playWelcomeMessage();
  }, [location]);

  const toggleCamera = async () => {
    try {
      if (!isCameraOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      } else {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraOn(false);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleLogout = () => {
    // Clear any authentication tokens or user data
    localStorage.removeItem('authToken');
    // Redirect to login page
    navigate('/login');
  };

  const Sidebar = () => (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-800 w-64 z-40 transform transition-transform duration-300 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src={AIProfileImage} 
              alt="AI Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-white font-semibold">PrepAI</h2>
            <p className="text-sm text-gray-400">Interview Assistant</p>
          </div>
        </div>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/dashboard" 
              className="flex items-center p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="mr-3" size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-gray-300 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
            >
              <LogOut className="mr-3" size={20} />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );

  const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors mr-4"
              aria-label="Menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PrepAI Interview Assistant
            </h1>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="mr-2" size={18} />
              Home
            </Link>
            <Link 
              to="/features" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Info className="mr-2" size={18} />
              Features
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Phone className="mr-2" size={18} />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );

  const generateQuestions = async (data) => {
    setLoading(true);
    try {
      const prompt = `As a technical interviewer for a ${data.jobRole} position, generate 5 challenging but fair interview questions that:
        - Are appropriate for someone with ${data.experience} years of experience
        - Focus on their tech stack: ${data.techStack}
        - Include a mix of technical concepts and practical problem-solving
        - Are clear and specific
        Return only the numbered questions.`;
      
      const response = await axios.post('http://localhost:8000/chat', {
        message: prompt
      });

      const questionsList = response.data.response
        .split('\n')
        .filter(q => q.trim())
        .map(q => q.replace(/^\d+\.?\s*/, '').trim());

      setQuestions(questionsList);
    } catch (error) {
      console.error('Error generating questions:', error);
    }
    setLoading(false);
  };

  const playWelcomeMessage = () => {
    const message = "Welcome to PrepAI! I'll be your interview coach today. I've prepared technical questions based on your profile. Take your time, speak clearly, and remember - this is a safe space to practice. Click 'Start Interview' when you're ready.";
    speakText(message);
  };

  const speakText = (text) => {
    setDisplayedText('');
    setIsSpeaking(true);
    setShowRecordButton(false);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Display text character by character
    let charIndex = 0;
    const textInterval = setInterval(() => {
      if (charIndex <= text.length) {
        setDisplayedText(text.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(textInterval);
        setIsSpeaking(false);
        setShowRecordButton(true);
      }
    }, 30); // Adjust speed as needed

    utterance.onend = () => {
      setIsSpeaking(false);
      setShowRecordButton(true);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    setCurrentQuestionIndex(0);
    speakText(questions[0]);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    setIsRecording(!isRecording);
  };

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: transcript
      }));
    };

    recognition.start();
  };

  const stopRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.stop();
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      speakText(questions[currentQuestionIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      speakText(questions[currentQuestionIndex + 1]);
    }
  };

  const finishInterview = () => {
    navigate('/validation', {
      state: {
        questions,
        answers,
        interviewData
      }
    });
  };

  const renderRightSection = () => (
    <div className="w-1/2 p-8 flex flex-col">
      {/* Top Bar */}
      <div className="w-full bg-gray-800/50 p-4 rounded-t-xl mb-4 flex items-center justify-between">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          PrepAI Interview Assistant
        </h1>
      </div>

      {/* AI Interviewer Profile */}
      <div className="flex-grow flex flex-col">
        <div className="bg-gray-800/50 rounded-xl p-6 flex-grow flex flex-col">
          <div className="flex-shrink-0 flex justify-center mb-6">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500">
              <img 
                src={AIProfileImage} 
                alt="AI Interviewer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">AI Interviewer</h2>
            <p className="text-gray-400">Your Technical Interview Coach</p>
          </div>

          {/* Loading or Welcome State */}
          {loading ? (
            <div className="text-center space-y-4 flex-grow flex flex-col justify-center">
              <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-xl font-medium">Preparing Your Interview</p>
              <p className="text-gray-400">Generating relevant technical questions...</p>
            </div>
          ) : currentQuestionIndex === -1 ? (
            <div className="text-center space-y-8 flex-grow flex flex-col justify-center">
              <button
                onClick={startInterview}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                Start Interview
                <ChevronRight size={20} />
              </button>
            </div>
          ) : (
            <div className="space-y-6 flex-grow flex flex-col">
              {/* Question Display */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex-grow">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}</h2>
                    <span className="text-sm text-gray-400">
                      {currentQuestionIndex + 1} of {questions.length}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-lg text-gray-300 mb-6">
                      {displayedText}
                    </p>
                  </div>
                  
                  {showRecordButton && (
                    <button
                      onClick={toggleRecording}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg transition-all duration-200 ${
                        isRecording
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff size={20} />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic size={20} />
                          <span>Start Recording</span>
                        </>
                      )}
                    </button>
                  )}

                  {answers[currentQuestionIndex] && (
                    <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                      <h3 className="font-semibold mb-2">Your Answer:</h3>
                      <p className="text-gray-300">{answers[currentQuestionIndex]}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                {currentQuestionIndex > 0 ? (
                  <button
                    onClick={handlePrevQuestion}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                ) : (
                  <div></div>
                )}

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!answers[currentQuestionIndex]}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={finishInterview}
                    disabled={!answers[currentQuestionIndex]}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Interview
                    <CheckCircle size={20} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Navbar />
      <Sidebar />
      
      {/* Main content with adjusted padding for navbar */}
      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Left Section */}
        <div className="w-1/2 p-8 border-r border-gray-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Interview Session
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={toggleCamera}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isCameraOn 
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {isCameraOn ? <CameraOff size={20} /> : <Camera size={20} />}
                  <span className="hidden md:inline">
                    {isCameraOn ? 'Stop Camera' : 'Start Camera'}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
              </div>
            </div>

            {interviewData && (
              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Interview Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Position:</span>
                    <span className="text-white font-medium">{interviewData.jobRole}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white font-medium">{interviewData.experience} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tech Stack:</span>
                    <span className="text-white font-medium">{interviewData.techStack}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        {renderRightSection()}
      </div>
    </div>
  );
}

export default Assistant;