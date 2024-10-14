import { LogoIcon } from '@/assets/icons';

// TODO: make dialog component for tile to simplify
// TODO: dialog needs selectable variant.  new component?
interface ScrollTileProps {
  title: string;
  subtitle: string;
  value: string;
  icon?: React.ReactNode;
  status?: 'error' | 'warn' | 'good';
}

export const ScrollTile = ({ title, subtitle, value, icon, status = 'good' }: ScrollTileProps) => {
  // TODO: move to utils
  let textColor = 'text-white';
  if (status === 'warn') {
    textColor = 'text-warning';
  } else if (status === 'error') {
    textColor = 'text-error';
  }

  return (
    <div className="mx-4 py-2 min-h-[52px] flex items-center not-last:border-b not-last:border-neutral-4 cursor-pointer">
      <div className="rounded-full h-9 w-9 bg-neutral-2 p-2 flex items-center justify-center">
        {icon || <LogoIcon />}
      </div>
      <div className="flex flex-col ml-3">
        <h6 className={`text-base ${textColor} text-left`}>{title}</h6>
        <p className="text-xs text-neutral-1 text-left">{subtitle}</p>
      </div>
      <div className="flex-1" />
      <div className="text-white text-h6">{value}</div>
    </div>
  );
};
