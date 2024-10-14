import { useState } from 'react';
import { ValidatorInfo } from '@/types';
import { SlideTray, Button, Input } from '@/ui-kit';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';

interface ValidatorScrollTileProps {
  validator: ValidatorInfo;
  delegatedAmount?: string;
  reward?: string;
}

const stake = (amount: string) => {
  console.log('Stake amount:', amount);
};

const unstake = (amount: string) => {
  console.log(`Unstake ${amount}`);
};

const claimToWallet = () => {
  console.log('Claim rewards to wallet');
};

const claimToRestake = () => {
  console.log('Claim rewards to restake');
};

// TODO: move to utils
const isValidUrl = (url: string): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-zA-Z\\d_]*)?$', // fragment locator
    'i',
  );

  return !!urlPattern.test(url);
};

export const ValidatorScrollTile = ({
  validator,
  delegatedAmount,
  reward,
}: ValidatorScrollTileProps) => {
  const [selectedAction, setSelectedAction] = useState<'stake' | 'unstake' | 'claim' | null>(
    !delegatedAmount ? 'stake' : null,
  );
  const [amount, setAmount] = useState('');

  const title = validator.description.moniker || 'Unknown Validator';
  const subTitle = delegatedAmount || '';
  const value = reward || '0 MLD';
  const commission = `${parseFloat(validator.commission.commission_rates.rate) * 100}%`;

  const unbondingDays = 12; // TODO: After differentiating by chain, pull dynamically from the validator

  let statusLabel = '';
  let statusColor: 'good' | 'warn' | 'error' = 'good';
  if (validator.jailed) {
    statusLabel = 'Jailed';
    statusColor = 'error';
  } else if (validator.status === 'BOND_STATUS_UNBONDING') {
    statusLabel = 'Unbonding';
    statusColor = 'warn';
  } else if (validator.status === 'BOND_STATUS_UNBONDED') {
    statusLabel = 'Inactive';
    statusColor = 'warn';
  } else {
    statusLabel = 'Active';
    statusColor = 'good';
  }

  let textColor = 'text-success';
  // TODO: move to utils
  if (statusColor === 'warn') {
    textColor = 'text-warning';
  } else if (statusColor === 'error') {
    textColor = 'text-error';
  }

  const website = validator.description.website;
  const isWebsiteValid = isValidUrl(website);

  return (
    <SlideTray
      triggerComponent={
        <div>
          <ScrollTile
            title={title}
            subtitle={subTitle}
            value={value}
            icon={<LogoIcon />}
            status={statusColor}
          />
        </div>
      }
      title={title}
      showBottomBorder
      status={statusColor}
    >
      {reward && (
        <>
          <div className="text-center mb-2">
            <div className="truncate text-base font-medium text-neutral-1">Reward: {reward}</div>
            <span className="text-grey-dark text-xs text-base">
              Unstaking requires {unbondingDays} days
            </span>
          </div>
        </>
      )}

      {/* TODO: on button press, animate collapse to 1 line / re-expansion? */}
      {/* Validator Information */}
      <div className="mb-4 min-h-[7.5rem] max-h-[7.5rem] overflow-hidden shadow-md bg-black p-2">
        <p>
          <strong>Status: </strong>
          <span className={textColor}>{statusLabel}</span>
        </p>
        <p>
          <strong>Validator Commission:</strong> {commission}
        </p>
        <p className="truncate">
          <strong>Website:</strong>{' '}
          {isWebsiteValid ? (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {website}
            </a>
          ) : (
            <span>{website}</span>
          )}
        </p>
        <p className="line-clamp-3 max-h-[3.5rem] overflow-hidden">
          <strong>Details:</strong> {validator.description.details}
        </p>
      </div>

      {/* Action Selection */}
      {delegatedAmount && (
        <div className="flex flex-col items-center justify-center grid grid-cols-3 w-full gap-x-4 px-2">
          <Button className="w-full" onClick={() => setSelectedAction('claim')}>
            Claim
          </Button>
          <Button className="w-full" onClick={() => setSelectedAction('stake')}>
            Stake
          </Button>
          <Button className="w-full" onClick={() => setSelectedAction('unstake')}>
            Unstake
          </Button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center h-[4rem]">
        {/* Stake and Unstake Actions */}
        {(selectedAction === 'stake' || selectedAction === 'unstake') && (
          <>
            <div className="flex items-center w-full">
              <div className="flex-grow mr-2">
                <Input
                  variant="primary"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-white mx-2"
                />
              </div>
              <Button
                size="sm"
                className="ml-2 px-2 py-1 rounded-md w-16"
                onClick={() => {
                  selectedAction === 'stake' ? stake(amount) : unstake(amount);
                }}
              >
                {selectedAction === 'stake' ? 'Stake' : 'Unstake'}
              </Button>
            </div>
          </>
        )}

        {/* Claim Action */}
        {selectedAction === 'claim' && (
          <div className="flex flex-col items-center justify-center grid grid-cols-2 gap-4">
            <Button className="w-full" onClick={claimToWallet}>
              Claim to Wallet
            </Button>
            <Button className="w-full" onClick={claimToRestake}>
              Claim to Restake
            </Button>
          </div>
        )}
      </div>
      {(selectedAction === 'stake' || selectedAction === 'unstake') && (
        <>
          <div className="flex justify-between w-full mt-1">
            <Button
              size="xs"
              variant="unselected"
              className="px-2 rounded-md text-xs"
              onClick={() => setAmount('')}
            >
              Clear
            </Button>
            <Button
              size="xs"
              variant="unselected"
              className="px-2 rounded-md text-xs"
              onClick={() => setAmount(subTitle)}
            >
              Max
            </Button>
          </div>
        </>
      )}
    </SlideTray>
  );
};
