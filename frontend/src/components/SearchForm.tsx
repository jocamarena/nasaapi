import { useState, FormEvent } from 'react';

type DateMode = 'single' | 'range' | 'today';

interface SearchFormProps {
  onSearch: (params: { date?: string; start_date?: string; end_date?: string }) => void;
  error?: string | null;
}

const MIN_DATE = '1995-06-16';

export const SearchForm = ({ onSearch, error: serverError }: SearchFormProps) => {
  const [dateMode, setDateMode] = useState<DateMode>('today');
  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const isDateInFuture = (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return selectedDate > todayDate;
  };

  const isDateBeforeMin = (dateString: string): boolean => {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const minDate = new Date(MIN_DATE);
    return selectedDate < minDate;
  };

  const getMonthsDifference = (startDateString: string, endDateString: string): number => {
    const start = new Date(startDateString);
    const end = new Date(endDateString);

    const yearDiff = end.getFullYear() - start.getFullYear();
    const monthDiff = end.getMonth() - start.getMonth();
    const dayDiff = end.getDate() - start.getDate();

    let totalMonths = yearDiff * 12 + monthDiff;

    if (dayDiff < 0) {
      totalMonths--;
    }

    return totalMonths;
  };

  const isDateRangeTooLarge = (startDateString: string, endDateString: string): boolean => {
    if (!startDateString || !endDateString) return false;
    const monthsDiff = getMonthsDifference(startDateString, endDateString);
    return monthsDiff > 6;
  };

  const validateDateRange = () => {
    if (!startDate || !endDate) {
      return;
    }

    setError(null);

    if (startDate > endDate) {
      showError('Start date cannot be after end date.');
      return;
    }

    if (isDateRangeTooLarge(startDate, endDate)) {
      showError('Date range cannot be more than 6 months. Please select a shorter date range.');
      return;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (dateMode === 'single') {
      if (isDateBeforeMin(date)) {
        showError('Date cannot be before June 16, 1995.');
        return;
      }
      if (isDateInFuture(date)) {
        showError('Date cannot be in the future. Please select today or an earlier date.');
        return;
      }
      onSearch({ date });
    } else if (dateMode === 'range') {
      if (!startDate || !endDate) {
        showError('Both start date and end date are required for date range search.');
        return;
      }
      if (isDateBeforeMin(startDate)) {
        showError('Start date cannot be before June 16, 1995.');
        return;
      }
      if (isDateBeforeMin(endDate)) {
        showError('End date cannot be before June 16, 1995.');
        return;
      }
      if (isDateInFuture(startDate)) {
        showError('Start date cannot be in the future. Please select today or an earlier date.');
        return;
      }
      if (isDateInFuture(endDate)) {
        showError('End date cannot be in the future. Please select today or an earlier date.');
        return;
      }
      if (startDate > endDate) {
        showError('Start date cannot be after end date.');
        return;
      }
      if (isDateRangeTooLarge(startDate, endDate)) {
        showError('Date range cannot be more than 6 months. Please select a shorter date range.');
        return;
      }
      onSearch({ start_date: startDate, end_date: endDate });
    } else if (dateMode === 'today') {
      onSearch({});
    }
  };

  const handleDateModeChange = (mode: DateMode) => {
    setDateMode(mode);
    setError(null);
    if (mode !== 'single') setDate('');
    if (mode !== 'range') {
      setStartDate('');
      setEndDate('');
    }
  };

  return (
    <div className="search-form">
      <h2>Search APOD</h2>
      {(error || serverError) && (
        <div className="error-message show">{error || serverError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-toggle">
          <label>
            <input
              type="radio"
              name="dateMode"
              value="single"
              checked={dateMode === 'single'}
              onChange={() => handleDateModeChange('single')}
            />
            Single Date
          </label>
          <label>
            <input
              type="radio"
              name="dateMode"
              value="range"
              checked={dateMode === 'range'}
              onChange={() => handleDateModeChange('range')}
            />
            Date Range
          </label>
          <label>
            <input
              type="radio"
              name="dateMode"
              value="today"
              checked={dateMode === 'today'}
              onChange={() => handleDateModeChange('today')}
            />
            Today
          </label>
        </div>

        {dateMode === 'single' && (
          <div className="form-group">
            <label htmlFor="date">Date (yyyy-MM-dd)</label>
            <input
              type="date"
              id="date"
              name="date"
              min={MIN_DATE}
              max={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}

        {dateMode === 'range' && (
          <div className="form-group">
            <div className="date-range-inputs">
              <div>
                <label htmlFor="start_date">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  min={MIN_DATE}
                  max={today}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setTimeout(validateDateRange, 0);
                  }}
                />
              </div>
              <div>
                <label htmlFor="end_date">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  min={MIN_DATE}
                  max={today}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setTimeout(validateDateRange, 0);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="form-group">
          <button type="submit">Search</button>
        </div>
      </form>
    </div>
  );
};
