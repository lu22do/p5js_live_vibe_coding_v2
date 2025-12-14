import React, { useState, useEffect } from 'react';

interface PreviousCodePanelProps {
  previousCode: string;
  onRun: (code: string) => void;
}

const PreviousCodePanel: React.FC<PreviousCodePanelProps> = ({ previousCode, onRun }) => {
  const [editedCode, setEditedCode] = useState<string>(previousCode);

  useEffect(() => {
    setEditedCode(previousCode);
  }, [previousCode]);

  const handleRun = () => {
    onRun(editedCode);
  };

  return (
    <div className="panel code-panel">
      <h2>Previous Code</h2>
      <textarea
        value={editedCode}
        onChange={(e) => setEditedCode(e.target.value)}
        rows={20}
        cols={50}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      <button onClick={handleRun} style={{ marginTop: '10px' }}>Run Code</button>
    </div>
  );
};

export default PreviousCodePanel;