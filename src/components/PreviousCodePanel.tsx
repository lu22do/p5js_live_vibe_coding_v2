import React, { useState, useEffect } from 'react';

interface PreviousCodePanelProps {
  previousCode: string;
  onCodeChange: (code: string) => void;
}

const PreviousCodePanel: React.FC<PreviousCodePanelProps> = ({ previousCode, onCodeChange }) => {
  const [editedCode, setEditedCode] = useState<string>(previousCode);

  useEffect(() => {
    setEditedCode(previousCode);
  }, [previousCode]);

  const handleRun = () => {
    onCodeChange(editedCode);
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