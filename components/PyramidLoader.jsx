/*
 * PyramidLoader — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './PyramidLoader.css';

export default function PyramidLoader() {
  return (
    <div className="pyramid-loader" role="status" aria-label="Loading">
      <div className="pyramid-loader__wrapper">
        <span className="pyramid-loader__side pyramid-loader__side1" />
        <span className="pyramid-loader__side pyramid-loader__side2" />
        <span className="pyramid-loader__side pyramid-loader__side3" />
        <span className="pyramid-loader__side pyramid-loader__side4" />
        <span className="pyramid-loader__shadow" />
      </div>
    </div>
  );
}
