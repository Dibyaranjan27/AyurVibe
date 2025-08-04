// src/components/FloatingLeaves.tsx

// We'll create the CSS for this in the next step
import './FloatingLeaves.css';

const FloatingLeaves = () => {
  // Create an array to easily render multiple leaves
  const leafCount = 12;
  const leaves = Array.from({ length: leafCount }, (_, i) => i);

  return (
    <div className="leaves-container" aria-hidden="true">
      {leaves.map(i => (
        <div className="leaf" key={i}>
          {/* You can use an SVG here instead of an emoji for better styling */}
          🌿
        </div>
      ))}
    </div>
  );
};

export default FloatingLeaves;