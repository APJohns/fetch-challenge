import { ComponentPropsWithRef } from 'react';
import { Dog } from '../types';
import './Dialog.css';
import DogDetails from './DogDetails';

interface Props extends ComponentPropsWithRef<'dialog'> {
  dog?: Dog;
  onClose?: () => void;
}

export default function Dialog({ dog, ref, onClose }: Props) {
  return (
    <dialog ref={ref} className="dialog">
      {dog && (
        <>
          <div className="dialog-header">
            <h2>Meet your new best friend!</h2>
            <button type="button" className="button-icon close-button" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
          <div className="dialog-body">
            <img src={dog.img} alt={`Picture of ${dog.name}`} className="img" />
            <h3 className="name">{dog.name}</h3>
            <DogDetails age={dog.age} breed={dog.breed} zip_code={dog.zip_code} />
          </div>
        </>
      )}
    </dialog>
  );
}
