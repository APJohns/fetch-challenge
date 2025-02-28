import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { SearchOptions } from '../types';
import './Pagination.css';

interface Props {
  next: string;
  prev: string;
  params?: SearchOptions;
}

export default function Pagination(props: Props) {
  const [nextFrom, setNextFrom] = useState<number>();
  const [nextPageSize, setNextPageSize] = useState<number>();
  const [prevFrom, setPrevFrom] = useState<number>();
  const [prevPageSize, setPrevPageSize] = useState<number>();

  useEffect(() => {
    if (props.next) {
      const params = new URLSearchParams(props.next.split('?')[1]);
      setNextFrom(Number(params.get('from')));
      setNextPageSize(Number(params.get('size')));
    } else {
      setNextFrom(undefined);
      setNextPageSize(undefined);
    }
    if (props.prev) {
      const params = new URLSearchParams(props.prev.split('?')[1]);
      setPrevFrom(Number(params.get('from')));
      setPrevPageSize(Number(params.get('size')));
    } else {
      setPrevFrom(undefined);
      setPrevPageSize(undefined);
    }
  }, [props.next, props.prev]);

  return (
    <div className="pagination">
      {prevFrom !== undefined && (
        <Link
          to="/adopt"
          search={{
            ...props.params,
            from: prevFrom,
            size: prevPageSize,
          }}
          className="inline-icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Prev page
        </Link>
      )}
      {nextFrom !== undefined && (
        <Link
          to="/adopt"
          search={{
            ...props.params,
            from: nextFrom,
            size: nextPageSize,
          }}
          className="inline-icon next-page"
        >
          Next page
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      )}
    </div>
  );
}
