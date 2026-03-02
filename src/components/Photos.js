import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Photos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setIsCameraActive(true); // Set this first to render video element
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }
      });
      
      console.log('Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Stream set to video element');
        await videoRef.current.play();
        console.log('Video playing');
      } else {
        console.error('Video ref is null');
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Cannot access camera. Please allow camera permission.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageDataUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageDataUrl);
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>📷 Photo Capture - {item?.name || 'User'}</h1>
        <button className="back-btn" onClick={() => navigate('/details', { state: { item } })}>← Back to Details</button>
      </header>

      <div className="photo-capture-container">
        {!capturedImage ? (
          <div className="camera-section">
            {!isCameraActive ? (
              <div className="camera-placeholder">
                <div className="camera-icon">📷</div>
                <h2>Ready to capture photo</h2>
                <button className="start-camera-btn" onClick={startCamera}>
                  Start Camera
                </button>
              </div>
            ) : (
              <div className="camera-view">
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                />
                <button className="capture-btn" onClick={capturePhoto}>
                  📸 Capture Photo
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="photo-result">
            <h2>✅ Photo Captured Successfully!</h2>
            <div className="captured-image">
              <img src={capturedImage} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div className="photo-actions">
              <button className="retake-btn" onClick={retakePhoto}>
                🔄 Retake Photo
              </button>
              <button className="save-btn" onClick={() => navigate('/list')}>
                💾 Save & Return to List
              </button>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Photos;
