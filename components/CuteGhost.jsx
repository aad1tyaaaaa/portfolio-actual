/*
 * CuteGhost — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './CuteGhost.css';

export default function CuteGhost() {
  return (
    <div className="cute-ghost" aria-hidden="true">
      <div className="cg-ghost">
        <div className="cg-body">
          <div className="cg-eyes">
            <span />
            <span />
          </div>
          <div className="cg-mouth" />
          <div className="cg-tail">
            <span />
            <span />
            <span />
          </div>
          <div className="cg-arm cg-arm-left" />
          <div className="cg-arm cg-arm-right" />
        </div>
        <div className="cg-shadow" />
      </div>
      <div className="cg-track">
        <div className="cg-line" />
      </div>
    </div>
  );
}
