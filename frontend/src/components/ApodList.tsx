import type { ApodResponse } from '../types/apod';
import { ApodCard } from './ApodCard';

interface ApodListProps {
  apods: ApodResponse[];
}

export const ApodList = ({ apods }: ApodListProps) => {
  return (
    <>
      {apods.map((apod, index) => (
        <ApodCard key={`${apod.date}-${index}`} apod={apod} />
      ))}
    </>
  );
};
