import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { ValidatorScrollTile } from '../ValidatorScrollTile';
import { validatorInfoAtom, delegationAtom, rewardsAtom, showCurrentValidatorsAtom } from '@/atoms';
import { ValidatorInfo } from '@/types';
import { LOCAL_ASSET_REGISTRY, GREATER_EXPONENT_DEFAULT } from '@/constants';
import { convertToGreaterUnit, fetchValidators } from '@/helpers';

interface ValidatorTilesProps {
  isSelectable?: boolean;
}

const getValidatorRewards = (validatorAddress: string, rewards: any[]): string => {
  const validatorReward = rewards.find(reward => reward.validator === validatorAddress);
  if (
    validatorReward &&
    Array.isArray(validatorReward.rewards) &&
    validatorReward.rewards.length > 0
  ) {
    const totalReward = validatorReward.rewards.reduce(
      (sum: number, rewardItem: any) => sum + parseFloat(rewardItem.amount),
      0,
    );
    return `${convertToGreaterUnit(totalReward, GREATER_EXPONENT_DEFAULT).toFixed(GREATER_EXPONENT_DEFAULT)} ${LOCAL_ASSET_REGISTRY.note.symbol}`;
  }
  return '0';
};

// TODO: move data collection out of this layer?
// TODO: call for all validators and all staked validators, then just show full set or subset
// TODO: ensure this shows all 100 validators on "all" selection
// TODO: show some indicator of uptime (such as coloring symphony icon depending) (on all screen)
// TODO: show some indicator of APY (on all screen)
// TODO: check for registry symbol where symbol equals denom
// const denom = validatorReward.rewards[0]?.denom || 'UNKNOWN';
export const ValidatorTiles: React.FC<ValidatorTilesProps> = ({ isSelectable = false }) => {
  const delegations = useAtomValue(delegationAtom);
  const rewards = useAtomValue(rewardsAtom);
  const showCurrentValidators = useAtomValue(showCurrentValidatorsAtom);
  const currentValidators = useAtomValue(validatorInfoAtom);
  const [allValidators, setAllValidators] = useState<ValidatorInfo[]>([]);

  // Fetch all validators if needed
  useEffect(() => {
    if (!showCurrentValidators && allValidators.length === 0) {
      fetchValidators().then(({ validators }) => setAllValidators(validators));
    }
  }, [showCurrentValidators, allValidators.length]);

  const validatorsToShow = showCurrentValidators ? currentValidators : allValidators;

  if (validatorsToShow.length === 0) {
    return <p className="text-base text-neutral-1 px-4">No validators found</p>;
  }

  return (
    <>
      {validatorsToShow.map(validator => {
        const rewardAmount = getValidatorRewards(validator.operator_address, rewards);
        return (
          <ValidatorScrollTile
            key={validator.operator_address}
            validator={validator}
            reward={rewardAmount}
            delegation={delegations.find(
              d => d.delegation.validator_address === validator.operator_address,
            )}
            isSelectable={isSelectable}
          />
        );
      })}
    </>
  );
};
