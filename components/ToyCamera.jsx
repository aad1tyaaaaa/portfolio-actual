/*
 * ToyCamera — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './ToyCamera.css';

// a checkbox: click to snap, the photo slides out
export default function ToyCamera() {
  return (
    <div className="toy-camera-container">
      <label className="toy-camera-wrapper">
        <input type="checkbox" className="toy-camera-input" aria-label="Take a photo" />
        <div className="toy-camera-body">
          <div className="toy-camera-button" />
          <div className="toy-camera-lens" />
          <div className="toy-camera-photo">
            <div className="photo-image" />
            <div className="photo-text" />
            <div className="photo-text" style={{ width: '40%' }} />
          </div>
        </div>
        <div className="toy-camera-shadow" />
      </label>
    </div>
  );
}
