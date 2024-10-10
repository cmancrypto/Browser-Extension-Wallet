import { LogoIcon } from '@/assets/icons';
import { ValidatorInfo, Asset } from '@/types';
import { SlideTray, Button } from '@/ui-kit';

// TODO: move slide tray out of this component to simplify
// TODO: make dialog component for tile to simplify
// TODO: dialog needs selectable variant.  new component?
interface ScrollTileProps {
  title: string;
  subtitle: string;
  value: string;
  icon?: React.ReactNode;
  type: 'validator' | 'asset';
  info: ValidatorInfo | Asset | null;
}

const stake = () => {
  console.log('Stake function triggered');
};

const unstake = () => {
  console.log('Unstake function triggered');
};

const send = () => {
  console.log('Send function triggered');
};

const receive = () => {
  console.log('Receive function triggered');
};

export const ScrollTile = ({ title, subtitle, value, icon, type, info }: ScrollTileProps) => {
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
        {type === 'validator' && info && (
          <div>
            <p>
              <strong>Moniker:</strong> {title}
            </p>
            <p>
              <strong>Staked Amount:</strong> {subtitle}
            </p>
            <Button className="w-full mb-2" onClick={unstake}>
              Collect Rewards
            </Button>
            <div className="grid grid-cols-2 w-full gap-x-4 px-2">
              <Button className="w-full mb-2" onClick={stake}>
                Stake
              </Button>
              <Button className="w-full" onClick={unstake}>
                Unstake
              </Button>
            </div>
          </div>
        )}
        {type === 'asset' && info && (
          <div>
            <p>
              <strong>Symbol:</strong> {title}
            </p>
            <p>
              <strong>Amount:</strong> {value}
            </p>
            <div className="grid grid-cols-2 w-full gap-x-4 px-2">
              <Button className="w-full mb-2" onClick={receive}>
                Receive
              </Button>
              <Button className="w-full" onClick={send}>
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </SlideTray>
  );
};
