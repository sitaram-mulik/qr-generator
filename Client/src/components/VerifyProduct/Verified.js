export default function Verified({ code }) {
  return (
    <>
      <h1 style={{ fontSize: '24px' }}>Your product is authentic</h1>
      <img src={`${process.env.REACT_APP_API_URL || ''}/api/assets/verifyImage/${code}`} />
    </>
  );
}
