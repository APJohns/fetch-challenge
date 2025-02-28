import { useEffect, useState } from 'react';
import { Dog } from '../types';
import './Card.css';

interface Props extends Dog {
  isFavorite?: boolean;
  onAdd: (dog: Dog) => void;
  onRemove: (dog: Dog) => void;
}

export default function Card({ isFavorite = false, onAdd, onRemove, ...dog }: Props) {
  const [isActive, setIsActive] = useState(isFavorite);

  const toggleFavorite = () => {
    if (isActive) {
      onRemove(dog);
    } else {
      onAdd(dog);
    }
    setIsActive(!isActive);
  };

  useEffect(() => {
    setIsActive(isFavorite);
  }, [isFavorite]);

  return (
    <li className="card">
      <button className="card-button" type="button" onClick={toggleFavorite}>
        <div className="card-header">
          <img src={dog.img} alt="" className="card-img" />
          <div className={`favorite${isActive ? ' active' : ''}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isActive ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </div>
        </div>
        <div className="card-body">
          <h2 className="card-name">{dog.name}</h2>
          <div className="card-details">
            <p className="card-age">{dog.age} years old</p>
            <p className="card-breed">{dog.breed}</p>
            <p className="card-zip">Zip Code: {dog.zip_code}</p>
          </div>
        </div>
      </button>
    </li>
  );
}
