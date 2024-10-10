import { ScrollArea } from '@/ui-kit';
import { ValidatorInfo } from '@/types';
import { useAtomValue } from 'jotai';
import {
  walletStateAtom,
  delegationAtom,
  validatorInfoAtom,
  rewardsAtom,
  validatorDisplaySelectionAtom,
} from '@/atoms';
import { LogoIcon } from '@/assets/icons';
import { ScrollTile } from '../ScrollTile';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY } from '@/constants';
import { convertToGreaterUnit, fetchAllValidators } from '@/helpers';
import { useEffect, useState } from 'react';

export const TileScroller = ({ activeIndex }: { activeIndex: number }) => {
  const validatorToggle = useAtomValue(validatorDisplaySelectionAtom);
  const walletState = useAtomValue(walletStateAtom);
  const delegations = useAtomValue(delegationAtom);
  const currentValidators = useAtomValue(validatorInfoAtom);
  const rewards = useAtomValue(rewardsAtom);
  const [allValidators, setAllValidators] = useState<ValidatorInfo[]>([]);

  // TODO: call for all validators and all staked validators, then just show full set or subset
  // TODO: ensure this shows all 100 validators on "all" selection
  // TODO: show some indicator of uptime (such as coloring symphony icon depending) (on all screen)
  // TODO: show some indicator of APY (on all screen)
  // Fetch all validators if needed
  useEffect(() => {
    if (validatorToggle === 'all' && allValidators.length === 0) {
      fetchAllValidators().then(({ validators }) => setAllValidators(validators));
    }
  }, [validatorToggle]);

  // Determine which list of validators to show
  const validatorsToShow = validatorToggle === 'all' ? allValidators : currentValidators;

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
      ) : activeIndex === 1 && validatorToggle === 'current' && delegations.length > 0 ? (
        // Show delegations for current validators
        delegations.map(delegationResponse => {
          const validatorAddress = delegationResponse.delegation.validator_address;
          const validator = currentValidators.find(
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
      ) : activeIndex === 1 && validatorToggle === 'all' && validatorsToShow.length > 0 ? (
        // Show all validators if the toggle is set to 'all'
        validatorsToShow.map(validator => {
          const validatorAddress = validator.operator_address;
          const rewardAmount = getValidatorRewards(validatorAddress);

          return (
            <ScrollTile
              key={validatorAddress}
              title={validator?.description?.moniker || 'Unknown Validator'}
              subtitle={`N/A`}
              value={rewardAmount}
              type="validator"
              info={validator}
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
