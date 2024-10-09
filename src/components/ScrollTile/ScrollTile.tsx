import { LogoIcon } from '@/assets/icons';
import { ValidatorInfo, Asset } from '@/types';
import { SlideTray } from '@/ui-kit';

interface ScrollTileProps {
  title: string;
  subtitle: string;
  value: string;
  icon?: React.ReactNode;
  type: 'validator' | 'asset';
  info: ValidatorInfo | Asset | null;
}

export const ScrollTile = ({ title, subtitle, value, icon, type }: ScrollTileProps) => {
  return (
    <SlideTray
      triggerComponent={
        <div className="mx-4 py-2 min-h-[52px] flex items-center not-last:border-b not-last:border-neutral-4 cursor-pointer">
          <div className="rounded-full h-9 w-9 bg-neutral-2 p-2 flex items-center justify-center">
            {icon || <LogoIcon />}
          </div>
          <div className="flex flex-col ml-3">
            <h6 className="text-base text-white text-left">{title}</h6>
            <p className="text-xs text-neutral-1 text-left">{subtitle}</p>
          </div>
          <div className="flex-1" />
          <div className="text-white text-h6">{value}</div>
        </div>
      }
      title={type === 'validator' ? 'Validator Information' : 'Asset Information'}
    >
      <div>
        {type === 'validator' && (
          <div>
            <p>
              <strong>Moniker:</strong> {title}
            </p>
            <p>
              <strong>Operator Address:</strong> {subtitle}
            </p>
            <p>
              <strong>Commission:</strong> {value}
            </p>
          </div>
        )}
        {type === 'asset' && (
          <div>
            <p>
              <strong>Symbol:</strong> {title}
            </p>
            <p>
              <strong>Amount:</strong> {subtitle}
            </p>
          </div>
        )}
      </div>
    </SlideTray>
  );
};
