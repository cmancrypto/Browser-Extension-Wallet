import { ScrollArea } from '@/ui-kit';
import { ValidatorInfo } from '@/types';
import { useAtomValue } from 'jotai';
import { walletStateAtom, delegationAtom, validatorInfoAtom, rewardsAtom } from '@/atoms';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY } from '@/constants';
import { convertToGreaterUnit } from '@/helpers';

export const TileScroller = ({ activeIndex }: { activeIndex: number }) => {
  const walletState = useAtomValue(walletStateAtom);
  const delegations = useAtomValue(delegationAtom);
  const validators = useAtomValue(validatorInfoAtom);
  const rewards = useAtomValue(rewardsAtom);

  // Find rewards for a specific validator
  const getValidatorRewards = (validatorAddress: string) => {
    const validatorReward = rewards.find(reward => reward.validator === validatorAddress);
    if (
      validatorReward &&
      Array.isArray(validatorReward.rewards) &&
      validatorReward.rewards.length > 0
    ) {
      const totalReward = validatorReward.rewards.reduce((sum: number, rewardItem: any) => {
        return sum + parseFloat(rewardItem.amount);
      }, 0);

      // TODO: check for registry symbol where symbol equals denom
      // const denom = validatorReward.rewards[0]?.denom || 'UNKNOWN';
      const formattedReward = `${convertToGreaterUnit(totalReward, GREATER_EXPONENT_DEFAULT).toFixed(GREATER_EXPONENT_DEFAULT)} ${LOCAL_ASSET_REGISTRY.note.symbol}`;
      return formattedReward;
    }
    return '0';
  };

  return (
    <ScrollArea
      className="flex-grow w-full overflow-y-auto"
      type="always"
      scrollbarProps={{
        className: 'max-h-[93%]',
      }}
    >
      {activeIndex === 0 && walletState?.assets?.length > 0 ? (
        walletState.assets.map(asset => (
          <ScrollTile
            key={asset.denom}
            title={asset.symbol || ''}
            // TODO: use chain name as provided by registry match to denom
            subtitle={'Symphony'}
            value={`${asset.amount} ${asset.symbol}`}
            icon={<LogoIcon />}
            type="asset"
            info={asset}
          />
        ))
      ) : activeIndex === 1 && delegations?.length > 0 ? (
        delegations.map(delegationResponse => {
          const validatorAddress = delegationResponse.delegation.validator_address;
          const validator = validators.find(
            (v: ValidatorInfo) => v.operator_address === validatorAddress,
          );
          const rewardAmount = getValidatorRewards(validatorAddress);

          return (
            <ScrollTile
              key={validatorAddress}
              title={validator?.description?.moniker || 'Unknown Validator'}
              subtitle={`${convertToGreaterUnit(parseFloat(delegationResponse.balance.amount), GREATER_EXPONENT_DEFAULT)} ${LOCAL_ASSET_REGISTRY.note.symbol}`}
              value={rewardAmount}
              type="validator"
              info={validator || null}
            />
          );
        })
      ) : (
        <p className="text-base text-neutral-1 px-4">None found</p>
      )}
      <div className="h-4" />
    </ScrollArea>
  );
};
