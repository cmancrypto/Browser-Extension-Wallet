import { Spinner } from '@/assets/icons';

export const Loader = () => (
  <div className="bg-background-dark-grey w-full h-full flex items-center justify-center">
    <Spinner className="w-12 h-12 animate-spin fill-blue" />
  </div>
);
