import { memo } from 'react';

const Banner = () => {
  return (
    <section className="section-banner" id="section_banner">
      <div className="image-overlay"></div>
      <div className="image-content">
        <h2>Welcome Page</h2>
        <p>Welcome to the Tenetics product Authentication Portal.</p>
        <div className="authenticate-btn">
          <a href="#section_authenicate" className="btn">
            Authenticate
          </a>
        </div>
      </div>
    </section>
  );
};

export default memo(Banner);
