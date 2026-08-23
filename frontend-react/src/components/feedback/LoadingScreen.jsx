import { Spinner } from '../ui';

export function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="loading-screen">
      <Spinner size="lg" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default LoadingScreen;
