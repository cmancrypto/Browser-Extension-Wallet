import { Asset } from '@/types';
import { SlideTray, Button } from '@/ui-kit';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';

interface AssetScrollTileProps {
  asset: Asset;
}

const send = () => {
  console.log('Send function triggered');
};

const receive = () => {
  console.log('Receive function triggered');
};

export const AssetScrollTile = ({ asset }: AssetScrollTileProps) => {
  const title = asset.symbol || 'Unknown Asset';
  const subTitle = 'Symphony';
  const value = `${asset.amount} ${asset.symbol}`;

  return (
    <SlideTray
      triggerComponent={
        <div>
          <ScrollTile title={title} subtitle={subTitle} value={value} icon={<LogoIcon />} />
        </div>
      }
      title={title}
      showBottomBorder
    >
      <div>
        <p>
          <strong>Symbol:</strong> {asset.symbol}
        </p>
        <p>
          <strong>Amount:</strong> {asset.amount}
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
    </SlideTray>
  );
};
