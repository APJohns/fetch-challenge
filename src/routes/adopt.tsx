import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { Dog, SearchOptions } from '../types';
import CardGroup from '../components/CardGroup';
import Card from '../components/Card';
import Pagination from '../components/Pagination';
import Favorites from '../components/Favorites';
import Dialog from '../components/Dialog';
import './adopt.css';

export const Route = createFileRoute('/adopt')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SearchOptions => {
    return {
      from: Number(search?.from) || undefined,
      size: Number(search?.from) || undefined,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: '/adopt' });
  const params = Route.useSearch();

  const [breeds, setBreeds] = useState<string[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog>();

  const [sortBy, setSortBy] = useState(params.sort?.split(':')[0] || 'breed');
  const [sortOrder, setSortOrder] = useState(params.sort?.split(':')[1] || 'asc');

  const [next, setNext] = useState('');
  const [prev, setPrev] = useState('');
  const [count, setCount] = useState();

  const matchDialogRef = useRef<HTMLDialogElement>(null);

  const sortOptions = [
    {
      label: 'Breed',
      value: 'breed',
    },
    {
      label: 'Age',
      value: 'age',
    },
  ];

  const getDogsFromIDs = useCallback(async (ids: string[]) => {
    const res = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    });
    return await res.json();
  }, []);

  const searchDogs = useCallback(
    async (filters: SearchOptions) => {
      const options = { ...filters };
      Object.keys(options).forEach((key) => {
        const k = key as keyof typeof options;
        if (options[k] === undefined) {
          delete options[k];
        }
      });
      const res = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${new URLSearchParams(options as Record<string, string>).toString()}`,
        {
          credentials: 'include',
        }
      );
      if (res.status === 401) {
        navigate({ to: '/' });
      }
      const dogIDs = await res.json();
      const dogs = await getDogsFromIDs(dogIDs.resultIds);
      setDogs(dogs);
      setPrev(dogIDs.prev);
      setNext(dogIDs.next);
      setCount(dogIDs.total);
    },
    [getDogsFromIDs]
  );

  const updateParams = (options: SearchOptions) => {
    navigate({
      search: {
        ...params,
        ...options,
      },
    });
  };

  const toggleSortOrder = () => {
    const newSort = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSort);
    updateParams({ sort: `${sortBy}:${newSort}` });
  };

  const updateSortBy = (value: string) => {
    setSortBy(value);
    if (value) {
      updateParams({ sort: `${value}:${sortOrder}`, from: undefined, size: undefined });
    } else {
      updateParams({ sort: undefined });
    }
  };

  const addToFavorites = (dog: Dog) => {
    setFavorites([...favorites, dog]);
  };

  const removeFromFavorites = (dog: Dog) => {
    setFavorites(favorites.filter((fav) => fav.id !== dog.id));
  };

  const findMatch = async () => {
    const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Array.from(favorites, (f) => f.id)),
      credentials: 'include',
    });
    const matchID = await res.json();
    setMatch(favorites.find((f) => f.id === matchID.match));
    matchDialogRef.current?.showModal();
  };

  useEffect(() => {
    const getBreeds = async () => {
      const res = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
        credentials: 'include',
      });
      if (res.status === 401) {
        navigate({ to: '/' });
      }
      const breeds = await res.json();
      setBreeds(breeds);
    };
    if (breeds.length === 0) {
      getBreeds();
    }
  }, [breeds.length, dogs.length, navigate]);

  useEffect(() => {
    searchDogs(params);
  }, [params, searchDogs]);

  return (
    <div className="app-body">
      <header className="header">
        <h1 className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            {/* <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--> */}
            <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5l0 1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3l0-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
          </svg>{' '}
          Fetch a Dog
        </h1>
        <Link to="/">Logout</Link>
      </header>
      <main>
        <Favorites dogs={favorites} onRemove={removeFromFavorites} onMatch={findMatch} />
        <Dialog ref={matchDialogRef} dog={match} onClose={() => matchDialogRef.current?.close()} />
        <h2>Search</h2>
        <div className="filters">
          <label>
            <div>Breed</div>
            <Select
              className="filter"
              options={breeds.map((breed) => ({
                label: breed,
                value: breed,
              }))}
              // mode="multiple"
              placeholder="Select a breed"
              showSearch
              allowClear
              defaultValue={params.breeds}
              onChange={(value) =>
                value
                  ? updateParams({ breeds: value, from: undefined, size: undefined })
                  : updateParams({ breeds: undefined })
              }
            />
          </label>
          <div className="sort">
            <label>
              <div>Sort by</div>
              <Select className="filter" options={sortOptions} value={sortBy} onChange={updateSortBy} />
            </label>
            <button type="button" className="button-icon" onClick={toggleSortOrder}>
              {sortOrder === 'desc' ? (
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
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12"
                  />
                </svg>
              ) : (
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
                    d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="results-count">{count} results</p>
        </div>
        <CardGroup>
          {dogs.map((dog) => (
            <Card
              key={dog.id}
              isFavorite={Array.from(favorites, (f) => f.id).includes(dog.id)}
              {...dog}
              onAdd={addToFavorites}
              onRemove={removeFromFavorites}
            />
          ))}
        </CardGroup>
        <Pagination prev={prev} next={next} params={params} />
      </main>
    </div>
  );
}
