export default function Failed({ code }) {
  return (
    <section className="failure">
      <div className="content">
        <h2 style={{ margin: '20px 0 25px', fontSize: '12px' }}>Result for '{code}'</h2>
        <h2>
          <b>POSSIBLE COUNTERFEIT</b>
        </h2>
        <p>
          Your product is a potential counterfeit. Please contact Customer Service for further
          verification
        </p>
      </div>
    </section>
  );
}
