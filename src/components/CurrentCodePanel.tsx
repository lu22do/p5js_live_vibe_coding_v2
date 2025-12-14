import React, { useState, useEffect } from 'react';

interface CurrentCodePanelProps {
  currentCode: string;
  onRun: (code: string) => void;
  onTransitionToggle: (enabled: boolean) => void;
}

const CurrentCodePanel: React.FC<CurrentCodePanelProps> = ({ currentCode, onRun, onTransitionToggle }) => {
  const [editedCode, setEditedCode] = useState<string>(currentCode);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(false);

  useEffect(() => {
    setEditedCode(currentCode);
  }, [currentCode]);

  const handleRun = () => {
    onRun(editedCode);
  };

  const handleTransitionToggle = () => {
    const newState = !transitionEnabled;
    setTransitionEnabled(newState);
    onTransitionToggle(newState);
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
      <button onClick={handleTransitionToggle} style={{ marginTop: '10px', marginLeft: '10px' }}>
        {transitionEnabled ? 'Disable Transition' : 'Enable Transition'}
      </button>
    </div>
  );
};

export default CurrentCodePanel;