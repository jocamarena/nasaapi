import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchApod } from './api/apod';
import { ApodList } from './components/ApodList';
import { SearchForm } from './components/SearchForm';
import type { ApodQueryParams } from './types/apod';
import './App.css';

function App() {
  const [queryParams, setQueryParams] = useState<ApodQueryParams>({});

  const { data: apods, isLoading, error } = useQuery({
    queryKey: ['apod', queryParams],
    queryFn: () => fetchApod(queryParams),
  });

  const handleSearch = (params: ApodQueryParams) => {
    setQueryParams(params);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>NASA Astronomy Picture of the Day</h1>
        <div className="date">
          {apods && apods.length === 1
            ? apods[0].date
            : apods
            ? `${apods.length} entries`
            : ''}
        </div>
      </div>

      <div className="content">
        <SearchForm
          onSearch={handleSearch}
          error={error ? 'Failed to fetch APOD data' : null}
        />

        {isLoading && <div>Loading...</div>}
        {error && <div className="error-message show">Error: {(error as Error).message}</div>}
        {apods && <ApodList apods={apods} />}
      </div>
    </div>
  );
}

export default App;
