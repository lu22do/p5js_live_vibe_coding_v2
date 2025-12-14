import React, { useState, useEffect } from 'react';

interface CodePanelProps {
  currentCode: string;
  onCodeChange: (code: string) => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ currentCode, onCodeChange }) => {
  const [editedCode, setEditedCode] = useState<string>(currentCode);

  useEffect(() => {
    setEditedCode(currentCode);
  }, [currentCode]);

  const handleRun = () => {
    onCodeChange(editedCode);
  };

  return (
    <div className="panel code-panel">
      <h2>Code</h2>
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

export default CodePanel;