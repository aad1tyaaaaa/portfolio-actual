/*
 * Astronaut — designed by Aaditya Jaiswar
 * LinkedIn  https://www.linkedin.com/in/aadityaaaaa
 * GitHub    https://github.com/aad1tyaaaaa
 * Dribbble  https://dribbble.com/aadityaaaaa-jaiswar
 * Email     aadityaaaaa.jaiswar@gmail.com
 * WhatsApp  https://wa.me/917710024884
 */
import './Astronaut.css';

// 4 identical star layers fall on staggered delays so the sky never empties
const Stars = ({ layer }) => (
  <div className={`star-box star-box${layer}`}>
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} className={`star star-position${i + 1}`} />
    ))}
  </div>
);

export default function Astronaut() {
  return (
    <div className="astronaut-space" aria-hidden="true">
      {[1, 2, 3, 4].map(layer => <Stars key={layer} layer={layer} />)}
      <div className="astronaut">
        <div className="head" />
        <div className="arm arm-left" />
        <div className="arm arm-right" />
        <div className="body">
          <div className="panel" />
        </div>
        <div className="leg leg-left" />
        <div className="leg leg-right" />
        <div className="schoolbag" />
      </div>
    </div>
  );
}
