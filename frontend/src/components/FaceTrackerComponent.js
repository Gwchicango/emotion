import { useEffect, useRef } from "react";
import "./componentCSS/faceTrackerComponent.css";

const FaceTrackerComponent = ({ videoEl }) => {
  const timeout = useRef(null);
  const faceTracker = useRef(null);
  const sdk_w = useRef(null);
  const sdk_h = useRef(null);

  useEffect(() => {
    if (!videoEl?.current) return;

    faceTracker.current = document.querySelector("#faceTracker");
    
    function handleFaceEvents(evt) {
      if (evt.detail?.rects?.length > 0) {
        const $vid = videoEl.current;
        const scale_w = $vid.offsetWidth / sdk_w.current;
        const scale_h = $vid.offsetHeight / sdk_h.current;
        const y_diff = $vid.offsetHeight - sdk_h.current * 2;
        const x_diff = $vid.offsetWidth - sdk_w.current * 2;
        const offset_x = Math.round(x_diff / 2);
        const offset_y = Math.round(y_diff / 2);

        faceTracker.current.style.width = `${Math.round(evt.detail.rects[0].width * scale_w)}px`;
        faceTracker.current.style.height = `${Math.round(evt.detail.rects[0].height * scale_h)}px`;
        faceTracker.current.style.top = `${Math.round(evt.detail.rects[0].y * scale_h) + (y_diff > x_diff ? offset_y : 0)}px`;
        faceTracker.current.style.left = `${Math.round(evt.detail.rects[0].x * scale_w) + (y_diff < x_diff ? offset_x : 0)}px`;
        faceTracker.current.style.display = "block";

        resetTimeout();
      }
    }

    function setSdkDimensions(evt) {
      sdk_w.current = evt.detail.width;
      sdk_h.current = evt.detail.height;
    }

    function resetTimeout() {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        faceTracker.current.style.display = "none";
      }, 3000);
    }

    window.addEventListener("CY_FACE_DETECTOR_RESULT", handleFaceEvents);
    window.addEventListener("CY_CAMERA_RESULT", setSdkDimensions);

    return () => {
      window.removeEventListener("CY_FACE_DETECTOR_RESULT", handleFaceEvents);
      window.removeEventListener("CY_CAMERA_RESULT", setSdkDimensions);
    };
  }, [videoEl]);

  return (
    <div id="faceTrackerContainer">
      <div id="faceTracker"></div>
    </div>
  );
};

const CameraComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error);
      });
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <FaceTrackerComponent videoEl={videoRef} />
    </div>
  );
};

export default CameraComponent;
