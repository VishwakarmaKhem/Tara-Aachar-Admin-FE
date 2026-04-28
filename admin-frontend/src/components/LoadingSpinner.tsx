import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }: LoadingSpinnerProps) => (
  <div className={`spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
    <div className="spinner-ring" />
    {message && <p className="spinner-message">{message}</p>}
  </div>
);

export default LoadingSpinner;
