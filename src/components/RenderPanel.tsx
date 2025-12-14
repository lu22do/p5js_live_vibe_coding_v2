import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

interface RenderPanelProps {
  currentCode: string;
}

const RenderPanel: React.FC<RenderPanelProps> = ({ currentCode }) => {
  const renderRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (p5Instance.current) {
      p5Instance.current.remove();
    }
    setError('');
    if (currentCode && renderRef.current) {
      try {
        // Extract the body of the function
        const body = currentCode.replace(/^function\(p\)\s*\{/, '').replace(/\}\s*$/, '').trim();
        const sketch = new Function('p', body) as (p: p5) => void;
        p5Instance.current = new p5(sketch, renderRef.current);
      } catch (error) {
        const err = error as Error;
        setError(`Error creating p5 sketch: ${err.message}`);
        console.error('Error creating p5 sketch:', error);
      }
    }
  }, [currentCode]);

  return (
    <div className="panel render-panel">
      <h2>Render</h2>
      <div ref={renderRef} className="p5-container"></div>
      {error && <div className="error-console" style={{ marginTop: '10px', color: 'red', fontFamily: 'monospace', fontSize: '12px' }}>{error}</div>}
    </div>
  );
};

export default RenderPanel;