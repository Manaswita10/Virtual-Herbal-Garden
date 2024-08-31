
import '/pages/styles/SouthAmerica.css'; // Assuming you have a CSS file for styling

export function SouthAmerica() {
  return (
    <div className="cards-container">
      {[1, 2, 3, 4].map((index) => (
        <div className="card-container" key={index}>
          <div className="card-body">
            <div className="card-item text-xl font-bold text-neutral-600 dark:text-white">
              Card Title {index}
            </div>
            <div className="card-item text-neutral-500 text-sm mt-2 dark:text-neutral-300">
              This is card number {index}. Hover to see the 3D effect.
            </div>
            <div className="card-item-button">
              <button className="card-button">Click Here</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SouthAmerica;
