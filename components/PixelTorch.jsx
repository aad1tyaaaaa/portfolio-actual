/*
 * PixelTorch — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './PixelTorch.css';

// a checkbox: click to light / snuff the voxel torch
const cells = n => Array.from({ length: n }, (_, i) => <div key={i} />);

export default function PixelTorch() {
  return (
    <label className="pixel-torch">
      <div className="simple-text">Click me!</div>
      <input defaultChecked type="checkbox" aria-label="Light the torch" />
      <div className="torch">
        <div className="head">
          <div className="face top">{cells(4)}</div>
          <div className="face left">{cells(4)}</div>
          <div className="face right">{cells(4)}</div>
        </div>
        <div className="stick">
          <div className="side side-left">{cells(16)}</div>
          <div className="side side-right">{cells(16)}</div>
        </div>
      </div>
    </label>
  );
}
