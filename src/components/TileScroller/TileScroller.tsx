import { ScrollArea } from '@/ui-kit';
import { Asset, DelegationResponse, ValidatorInfo } from '@/types';
import { useAtomValue } from 'jotai';
import { walletStateAtom, delegationAtom, validatorInfoAtom } from '@/atoms';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';

export const TileScroller = ({ activeIndex, rewards }: { activeIndex: number; rewards: any[] }) => {
  const walletState = useAtomValue(walletStateAtom);
  const delegations = useAtomValue(delegationAtom);
  const validators = useAtomValue(validatorInfoAtom);

  // Find rewards for a specific validator
  const getValidatorRewards = (validatorAddress: string) => {
    console.log('address is', validatorAddress);
    console.log('address', validatorAddress);
    const validatorReward = rewards.find(reward => reward.validator === validatorAddress);
    console.log('rewards', rewards);
    console.log('validator reward', validatorReward);
    if (
      validatorReward &&
      Array.isArray(validatorReward.rewards) &&
      validatorReward.rewards.length > 0
    ) {
      const totalReward = validatorReward.rewards.reduce((sum: number, rewardItem: any) => {
        return sum + parseFloat(rewardItem.amount);
      }, 0);

      // TODO: format to greater unit rather than lesser unit
      const denom = validatorReward.rewards[0]?.denom?.toUpperCase() || 'UNKNOWN';
      return `${totalReward.toFixed(6)} ${denom}`;
    }
    return '0';
  };

  return (
    <ScrollArea
      className="flex-grow w-full overflow-y-auto mt-3"
      type="always"
      scrollbarProps={{
        className: 'max-h-[93%]',
      }}
    >
      {activeIndex === 0 &&
        walletState?.assets?.map((asset: Asset) => (
          <ScrollTile
            key={asset.denom}
            title={asset.symbol || ''}
            subtitle={'Symphony'}
            value={asset.amount}
            icon={<LogoIcon />}
            type="asset"
            info={asset}
          />
        ))}

      {activeIndex === 1 &&
        delegations?.map((delegationResponse: DelegationResponse) => {
          const validatorAddress = delegationResponse?.delegation?.validator_address;
          const validator = validators.find(
            (validator: ValidatorInfo) => validator.operator_address === validatorAddress,
          );

          const rewardAmount = getValidatorRewards(validatorAddress);
          console.log('reward amount', rewardAmount);

          return (
            <ScrollTile
              key={validatorAddress}
              title={validator?.description?.moniker || 'Unknown Validator'}
              subtitle={`Staked: ${delegationResponse.balance.amount} | Rewards: ${rewardAmount}`}
              value={delegationResponse.balance.amount}
              type="validator"
              info={validator || null}
            />
          );
        })}
      <div className="h-4" />
    </ScrollArea>
  );
};
