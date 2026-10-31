/*
 * OrbitSphere — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './OrbitSphere.css';

// 9 tinted rings, each made of 9 discs fanned around Y; the whole cage tumbles in 3D
const COLORS = ['#f008', '#f0f8', '#ff08', '#0f08', '#0ff8', '#00f8', '#dc1ddf88', '#ffa50088', '#e5b2ca88'];

export default function OrbitSphere() {
  return (
    <div className="orbit-sphere" aria-hidden="true">
      <div className="os-loader">
        {COLORS.map((bg, rot) => (
          <div key={rot} className="os-ring" style={{ '--rot': rot, '--bg': bg }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="os-disc" style={{ '--rot-y': i + 1 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
