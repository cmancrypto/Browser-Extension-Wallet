import { ScrollArea } from '@/ui-kit';
import { Asset, DelegationResponse, ValidatorInfo } from '@/types';
import { useAtomValue } from 'jotai';
import { walletStateAtom, delegationAtom, validatorInfoAtom } from '@/atoms';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';

export const AssetScroller = ({
  activeIndex,
  rewards,
}: {
  activeIndex: number;
  rewards: any[];
}) => {
  const walletState = useAtomValue(walletStateAtom);
  const delegations = useAtomValue(delegationAtom);
  const validators = useAtomValue(validatorInfoAtom);

  // Find rewards for a specific validator
  const getValidatorRewards = (validatorAddress: string) => {
    const validatorReward = rewards.find(reward => reward.validator_address === validatorAddress);
    if (validatorReward && validatorReward.reward.length > 0) {
      const totalReward = validatorReward.reward.reduce((sum: number, rewardItem: any) => {
        return sum + parseFloat(rewardItem.amount);
      }, 0);
      return `${totalReward.toFixed(6)} ${validatorReward.reward[0].denom.toUpperCase()}`;
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
          />
        ))}

      {activeIndex === 1 &&
        delegations?.map((delegationResponse: DelegationResponse) => {
          const validatorAddress = delegationResponse?.delegation?.validator_address;
          const validator = validators.find(
            (validator: ValidatorInfo) => validator.operator_address === validatorAddress,
          );

          const rewardAmount = getValidatorRewards(validatorAddress);

          if (!validator) {
            return (
              <ScrollTile
                key={validatorAddress || 'unknown-validator'}
                title={'Unknown Validator'}
                subtitle={`Staked: ${delegationResponse.balance.amount} | Rewards: ${rewardAmount}`}
                value={delegationResponse.balance.amount}
              />
            );
          }

          return (
            <ScrollTile
              key={validatorAddress}
              title={validator?.description?.moniker || 'Unknown Validator'}
              subtitle={`Staked: ${delegationResponse.balance.amount} | Rewards: ${rewardAmount}`}
              value={delegationResponse.balance.amount}
            />
          );
        })}

      <div className="h-4" />
    </ScrollArea>
  );
};
