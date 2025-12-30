import './Spinner.css';

const Spinner = ({ size = 20 }) => (
  <span className="spinner" style={{ width: size, height: size }} aria-label="Loading" />
);

export default Spinner;
