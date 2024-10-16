import { queryRpcNode } from './queryNodes';
import { DelegationResponse } from '@/types';

export const buildClaimMessage = ({
  endpoint,
  delegatorAddress,
  validatorAddress,
  amount,
  denom,
  delegations,
}: {
  endpoint: string;
  delegatorAddress?: string;
  validatorAddress?: string | string[];
  amount?: string;
  denom?: string;
  delegations?: DelegationResponse[];
}): any => {
  return delegations
    ? delegations.map(delegation => ({
        typeUrl: endpoint,
        value: {
          delegatorAddress: delegation.delegation.delegator_address,
          validatorAddress: delegation.delegation.validator_address,
          amount: {
            denom: delegation.balance.denom,
            amount: (parseFloat(delegation.balance.amount) - 5000).toFixed(0), // Subtracting 5000 for gas fee
          },
        },
      }))
    : [
        {
          typeUrl: endpoint,
          value: {
            delegatorAddress: delegatorAddress,
            validatorAddress: validatorAddress,
            ...(amount && denom ? { amount: { denom, amount } } : {}),
          },
        },
      ];
};

// TODO: remove magic number fees in favor of single source of truth
// Function to claim rewards from a designated validator
export const claimRewardsFromValidator = async (
  delegatorAddress: string,
  validatorAddress: string,
) => {
  const endpoint = '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward';
  const messages = buildClaimMessage({
    endpoint,
    delegatorAddress,
    validatorAddress,
  });

  try {
    const response = await queryRpcNode({
      endpoint,
      messages,
    });

    console.log('Rewards claimed successfully:', response);
  } catch (error) {
    console.error('Error claiming rewards from the validator:', error);
  }
};

// TODO: test all functions below this line
// Function to claim rewards and then restake them to a designated validator
export const claimAndRestake = async (delegation: DelegationResponse) => {
  const delegatorAddress = delegation.delegation.delegator_address;
  const validatorAddress = delegation.delegation.validator_address;
  const endpoint = '/cosmos.staking.v1beta1.MsgDelegate';

  const messages = buildClaimMessage({
    endpoint,
    delegations: [delegation],
  });

  try {
    await claimRewardsFromValidator(delegatorAddress, validatorAddress);

    const response = await queryRpcNode({
      endpoint,
      messages,
    });

    console.log('Rewards restaked successfully:', response);
  } catch (error) {
    console.error('Error during claim and restake:', error);
  }
};

// Function to claim rewards from all validators
export const claimRewardsFromAllValidators = async (
  delegatorAddress: string,
  validatorAddress: string[],
) => {
  const endpoint = '/cosmos.staking.v1beta1.MsgDelegate';

  const messages = buildClaimMessage({
    endpoint,
    delegatorAddress,
    validatorAddress,
  });

  try {
    const response = await queryRpcNode({
      endpoint: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      messages,
    });

    console.log('Rewards claimed successfully from all validators:', response);
  } catch (error) {
    console.error('Error claiming rewards from all validators:', error);
  }
};

// Function to claim rewards from all validators and restake to designated validators
export const claimAndRestakeAll = async (delegations: DelegationResponse[]) => {
  const endpoint = '/cosmos.staking.v1beta1.MsgDelegate';
  const delegatorAddress = delegations[0]?.delegation.delegator_address;
  const validatorAddresses = delegations.map(d => d.delegation.validator_address);

  const messages = buildClaimMessage({
    endpoint,
    delegations,
  });

  try {
    await claimRewardsFromAllValidators(delegatorAddress, validatorAddresses);

    console.log('Restaking rewards to all validators...');
    const restakeResponse = await queryRpcNode({
      endpoint,
      messages,
    });

    if (restakeResponse.code !== 0) {
      throw new Error(`Failed to restake rewards: ${restakeResponse.rawLog}`);
    }

    console.log('Rewards restaked successfully to all validators:', restakeResponse);
  } catch (error) {
    console.error('Error during claim and restake all:', error);
  }
};

export const stakeToValidator = async (
  amount: string,
  denom: string,
  walletAddress: string,
  validatorAddress: string,
) => {
  const endpoint = '/cosmos.staking.v1beta1.MsgDelegate';
  const messages = buildClaimMessage({
    endpoint,
    delegatorAddress: walletAddress,
    validatorAddress,
    amount,
    denom,
  });

  try {
    try {
      const response = await queryRpcNode({
        endpoint: '/cosmos.staking.v1beta1.MsgDelegate',
        messages,
      });

      console.log('Successfully staked:', response);
    } catch (error) {
      console.error('Failed to stake:', error);
    }
  } catch (error) {
    console.error('Error during staking:', error);
  }
};

// TODO: if maximum amount is unstaked, also withdraw rewards
export const unstakeFromValidator = async (amount: string, delegation: DelegationResponse) => {
  const endpoint = '/cosmos.staking.v1beta1.MsgUndelegate';
  const delegatorAddress = delegation.delegation.delegator_address;
  const validatorAddress = delegation.delegation.validator_address;
  const denom = delegation.balance.denom;

  const messages = buildClaimMessage({
    endpoint,
    delegatorAddress,
    validatorAddress,
    amount,
    denom,
  });

  try {
    const response = await queryRpcNode({
      endpoint: '/cosmos.staking.v1beta1.MsgUndelegate',
      messages,
    });

    console.log('Successfully unstaked:', response);
  } catch (error) {
    console.error('Error during unstaking:', error);
  }
};

export const unstakeFromAllValidators = async (delegations: DelegationResponse[]) => {
  const endpoint = '/cosmos.staking.v1beta1.MsgUndelegate';

  const messages = buildClaimMessage({
    endpoint,
    delegations,
  });

  try {
    const unstakeResponse = await queryRpcNode({
      endpoint,
      messages,
    });
    console.log('Successfully unstaked:', unstakeResponse);
  } catch (error) {
    console.error('Error during unstaking:', error);
  }
};
