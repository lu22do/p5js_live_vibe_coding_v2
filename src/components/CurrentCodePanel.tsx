import React, { useState, useEffect } from 'react';

interface CodePanelProps {
  currentCode: string;
  onRun: (code: string) => void;
}

const CurrentCodePanel: React.FC<CodePanelProps> = ({ currentCode, onRun }) => {
  const [editedCode, setEditedCode] = useState<string>(currentCode);

  useEffect(() => {
    setEditedCode(currentCode);
  }, [currentCode]);

  const handleRun = () => {
    onRun(editedCode);
  };

  return (
    <div className="panel code-panel">
      <h2>Current Code</h2>
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

export default CurrentCodePanel;