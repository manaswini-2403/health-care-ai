function ECGLine({ className }) {
  return (
    <div className={`ecgMini ${className}`}>
      <svg viewBox="0 0 200 60">
        <path
          d="
          M0 30 
          L30 30 
          L40 10 
          L50 50 
          L60 30 
          L120 30 
          L130 15 
          L140 45 
          L150 30 
          L200 30
          "
        />
      </svg>
    </div>
  );
}

export default ECGLine;