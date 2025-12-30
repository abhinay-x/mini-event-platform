import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => (
  <div className="landing-page">
    <header className="landing-hero">
      <p className="pill">AI-ready · Secure RSVPs · Full CRUD</p>
      <h1>Plan events the modern way.</h1>
      <p className="hero-copy">
        Mini Event Platform lets your team ideate, publish, and protect hybrid experiences with media uploads, AI copy,
        and stress-free attendance tracking.
      </p>
      <div className="hero-cta">
        <Link className="btn btn-primary" to="/register">
          Get started
        </Link>
        <Link className="btn btn-outline" to="/login">
          Sign in
        </Link>
      </div>
    </header>

    <section className="landing-grid">
      <article className="card">
        <h3>Creator tools</h3>
        <p>Publish immersive events with cover uploads, rich descriptions, and capacity controls.</p>
      </article>
      <article className="card">
        <h3>Smart RSVPs</h3>
        <p>Track confirmed seats, lock sold-out events, and notify guests instantly.</p>
      </article>
      <article className="card">
        <h3>Actionable insights</h3>
        <p>Dashboards highlight trends, returning guests, and AI-suggested improvements.</p>
      </article>
    </section>

    <section className="landing-footer">
      <p className="eyebrow">Ready when you are</p>
      <h2>Launch your next experience in minutes.</h2>
      <div className="hero-cta">
        <Link className="btn btn-primary" to="/register">
          Create my account
        </Link>
        <Link className="btn btn-outline" to="/login">
          I already have access
        </Link>
      </div>
    </section>
  </div>
);

export default LandingPage;
