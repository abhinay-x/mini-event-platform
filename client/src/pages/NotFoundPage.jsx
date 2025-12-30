import { Link } from 'react-router-dom';
import './FallbackPages.css';

const NotFoundPage = () => (
  <div className="fallback-page">
    <div className="card">
      <h1>404</h1>
      <p>We can’t find that page. Try heading back home.</p>
      <Link className="btn btn-primary" to="/">
        Go home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
