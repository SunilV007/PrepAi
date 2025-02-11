import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CameraOff, BookOpen, Code, Briefcase, Clock } from 'lucide-react';

function Create() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: '',
    experience: '',
    techStack: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/assistant', { state: { interviewData: formData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="flex h-screen">
        <div className="w-1/2 p-8 border-r border-gray-800">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Interview Setup
            </h2>
            
            <div className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700">
              <div className="mb-4 flex justify-between items-center">
                <button
                  onClick={toggleCamera}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isCameraOn 
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  }`}
                >
                  {isCameraOn ? (
                    <>
                      <CameraOff size={20} />
                      <span>Stop Camera</span>
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      <span>Start Camera</span>
                    </>
                  )}
                </button>
              </div>
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <BookOpen size={20} />
                Interview Guidelines
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  • Ensure you're in a quiet, well-lit environment
                </li>
                <li className="flex items-start gap-2">
                  • Test your microphone and camera before starting
                </li>
                <li className="flex items-start gap-2">
                  • Speak clearly and maintain eye contact with the camera
                </li>
                <li className="flex items-start gap-2">
                  • Take your time to think before answering questions
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Customize Your Interview
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Briefcase size={18} />
                  Position Title
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Clock size={18} />
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  min="0"
                  placeholder="e.g. 5"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Code size={18} />
                  Technical Skills
                </label>
                <textarea
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                  placeholder="e.g. React, Node.js, TypeScript, AWS"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                Begin Interview
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create;