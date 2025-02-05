import type { FC } from 'react';
import { eventThumbClass, thumbWrapClass } from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}
export const EventThumb: FC<IProps> = ({ token }) => {
  const getInitial = (str: string) => {
    return str.slice(0, 1);
  };
  return (
    <span className={thumbWrapClass}>
      <div
        className={eventThumbClass}
        style={{
          backgroundColor: token.properties.avatar?.backgroundColor,
        }}
      >
        {getInitial(token.name)}
      </div>
    </span>
  );
};
