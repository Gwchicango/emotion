import { useEffect, useRef, useState } from "react";
import "./componentCSS/moodComponent.css";

const MoodComponent = () => {
  const grid = useRef(null);
  const pinWrap = useRef(null);
  const pin = useRef(null);
  const [gridN, setGridN] = useState(38);
  const crtDisableTimeout = useRef(null);

  useEffect(() => {
    if (grid.current && pinWrap.current) {
      bindEvents();
    }

    function resetTimeout() {
      clearTimeout(crtDisableTimeout.current);
      crtDisableTimeout.current = setTimeout(hidePin, 3000);
    }

    function bindEvents() {
      resetTimeout();
      window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", handleEmotionEvent);
      window.addEventListener("resize", setDimensions);
    }

    function handleEmotionEvent(evt) {
      showPin();
      setEmotion(evt.detail.output);
      resetTimeout();
    }

    function setDimensions() {
      if (grid.current && grid.current.clientWidth !== 0) {
        pinWrap.current.style.width = `${grid.current.clientWidth}px`;
        pinWrap.current.style.height = `${grid.current.clientHeight}px`;
      } else {
        setTimeout(setDimensions, 10);
      }
    }

    function setEmotion({ arousal = 0, valence = 0 }) {
      const { x, y } = calculateCoordinates({ valence, arousal });
      setPinPosition(x, y);
    }

    function calculateCoordinates({ valence = 0, arousal = 0 }) {
      const imgOuterWidth = 800;
      const imgInnerWidth = 598;
      const imgXOffset = 101;
      const imgOuterHeight = 686;
      const imgInnerHeight = 598;
      const imgYOffset = 45;

      const normalize = (z) => (z + 1) / 2;

      return {
        x: (100 * (imgXOffset + imgInnerWidth * normalize(valence))) / imgOuterWidth,
        y: (100 * (imgYOffset + imgInnerHeight * normalize(arousal))) / imgOuterHeight,
      };
    }

    function setPinPosition(x, y) {
      if (pin.current) {
        pin.current.style.left = `${x - 5.15}%`;
        pin.current.style.bottom = `${y - 6}%`;
      }
    }

    function showPin() {
      if (pin.current) {
        pin.current.classList.add("show");
      }
    }

    function hidePin() {
      if (pin.current) {
        pin.current.classList.remove("show");
      }
    }

    return () => {
      window.removeEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", handleEmotionEvent);
      window.removeEventListener("resize", setDimensions);
    };
  }, []);

  return (
    <>
      <div className="wrapper" id="grid" ref={grid}>
        <img
          alt=""
          src={gridN === 38 ? "baseGraph.png" : "advancedGraph.png"}
          style={{ width: "100%", height: "100%" }}
        />
        <div className="pin_wrap" ref={pinWrap}>
          <div className="pin" ref={pin}></div>
        </div>
      </div>
      <div className="mood-buttons">
        <button onClick={() => setGridN(38)} disabled={gridN === 38}>
          38 Affects
        </button>
        <button onClick={() => setGridN(98)} disabled={gridN === 98}>
          98 Affects
        </button>
      </div>
    </>
  );
};

export default MoodComponent;