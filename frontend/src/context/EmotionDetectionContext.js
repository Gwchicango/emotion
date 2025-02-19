import React, { createContext, useState, useContext } from 'react';

const EmotionDetectionContext = createContext();

export const useEmotionDetection = () => {
  return useContext(EmotionDetectionContext);
};

export const EmotionDetectionProvider = ({ children }) => {
  const [isEmotionDetectionStarted, setIsEmotionDetectionStarted] = useState(false);
  const [aiSdkControls, setAiSdkControls] = useState(null);

  return (
    <EmotionDetectionContext.Provider value={{ isEmotionDetectionStarted, setIsEmotionDetectionStarted, aiSdkControls, setAiSdkControls }}>
      {children}
    </EmotionDetectionContext.Provider>
  );
};