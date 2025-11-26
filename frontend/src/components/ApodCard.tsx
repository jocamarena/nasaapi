import type { ApodResponse } from '../types/apod';

interface ApodCardProps {
  apod: ApodResponse;
}

export const ApodCard = ({ apod }: ApodCardProps) => {
  return (
    <div className="apod-entry">
      <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>{apod.title}</h2>
      <p style={{ color: '#667eea', fontWeight: 600, marginBottom: '1.5rem' }}>{apod.date}</p>

      <div className="media-container">
        {apod.media_type === 'image' ? (
          <img src={apod.url} alt={apod.title} />
        ) : apod.media_type === 'video' ? (
          <iframe src={apod.url} allowFullScreen></iframe>
        ) : null}
      </div>

      <div className="explanation">{apod.explanation}</div>

      <div className="metadata">
        {apod.copyright && (
          <div className="metadata-item">
            <label>Copyright</label>
            <span>{apod.copyright}</span>
          </div>
        )}

        <div className="metadata-item">
          <label>Media Type</label>
          <span>{apod.media_type}</span>
        </div>

        {apod.service_version && (
          <div className="metadata-item">
            <label>Service Version</label>
            <span>{apod.service_version}</span>
          </div>
        )}
      </div>

      <div className="links">
        {apod.hdurl && (
          <a href={apod.hdurl} target="_blank" rel="noopener noreferrer">
            View HD Image
          </a>
        )}
      </div>
    </div>
  );
};
