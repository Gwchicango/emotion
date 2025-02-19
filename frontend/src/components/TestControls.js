import React from 'react';
import { Button } from './ui/Button';

const TestControls = ({ isActive, startTest, testComplete }) => (
  <div className="test-controls">
    <Button
      onClick={startTest}
      disabled={isActive}
      className="start-button"
    >
      {testComplete ? 'Reiniciar Test' : 'Iniciar Test'}
    </Button>
  </div>
);

export default TestControls;