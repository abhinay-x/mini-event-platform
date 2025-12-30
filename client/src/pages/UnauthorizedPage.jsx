import { Link } from 'react-router-dom';
import './FallbackPages.css';

const UnauthorizedPage = () => (
  <div className="fallback-page">
    <div className="card">
      <h1>Unauthorized</h1>
      <p>Your session is missing or expired. Please login to continue.</p>
      <Link className="btn btn-primary" to="/login">
        Go to login
      </Link>
    </div>
  </div>
);

export default UnauthorizedPage;
