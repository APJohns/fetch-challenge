import { PropsWithChildren } from 'react';
import './CardGroup.css';

export default function CardGroup(props: PropsWithChildren) {
  return <ol className="card-group">{props.children}</ol>;
}
