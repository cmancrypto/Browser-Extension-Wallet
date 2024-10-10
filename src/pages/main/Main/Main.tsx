import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { BalanceCard, TileScroller } from '@/components';
import {
  walletStateAtom,
  delegationAtom,
  paginationAtom,
  validatorInfoAtom,
  rewardsAtom,
} from '@/atoms';
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY, CHAIN_NODES } from '@/constants';
import axios from 'axios';
import { convertToGreaterUnit, fetchDelegations, fetchValidatorInfo } from '@/helpers';

export const Main = () => {
  const walletState = useAtomValue(walletStateAtom);
  const [delegationState, setDelegationState] = useAtom(delegationAtom);
  const setPaginationState = useSetAtom(paginationAtom);
  const setValidatorInfo = useSetAtom(validatorInfoAtom);
  const totalSlides = 2;
  const [activeIndex, setActiveIndex] = useState(0);
  const [rewards, setRewards] = useAtom(rewardsAtom);

  // Fetch delegation and validator info
  const fetchDelegationsAndValidators = async () => {
    if (!walletState.address) return;

    try {
      const { delegations, pagination } = await fetchDelegations(walletState.address);
      setDelegationState(delegations);
      setPaginationState(pagination);

      const validatorPromises = delegations.map(delegation =>
        fetchValidatorInfo(delegation.delegation.validator_address),
      );
      const validators = await Promise.all(validatorPromises);
      setValidatorInfo(validators);

      fetchRewards(walletState.address, delegations);
    } catch (error) {
      console.error('Error fetching delegations or validators:', error);
    }
  };

  // Fetch rewards for each validator
  const fetchRewards = async (walletAddress: string, delegations: any[]) => {
    try {
      const rewardsPromises = delegations.map(async delegation => {
        const apiUrl = `${CHAIN_NODES.symphonytestnet[0].rest}/cosmos/distribution/v1beta1/delegators/${walletAddress}/rewards/${delegation.delegation.validator_address}`;
        const response = await axios.get(apiUrl);
        return {
          validator: delegation.delegation.validator_address,
          rewards: response.data.rewards || [],
        };
      });

      const rewardsData = await Promise.all(rewardsPromises);
      setRewards(rewardsData);
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  // Fetch delegations and validators when activeIndex changes
  useEffect(() => {
    if (activeIndex === 1) {
      fetchDelegationsAndValidators();
    }
  }, [activeIndex, walletState.address]);

  // Calculate total available MLD balance
  const totalAvailableMLD = walletState.assets
    .filter(asset => asset.denom === 'note')
    .reduce((sum, delegation) => sum + parseFloat(delegation.amount), 0)
    .toFixed(GREATER_EXPONENT_DEFAULT);

  // Calculate total staked MLD balance
  const totalStakedMLD = delegationState
    .filter(delegation => delegation.balance.denom === 'note')
    .reduce(
      (sum, delegation) =>
        sum +
        parseFloat(delegation.balance.amount) /
          Math.pow(10, LOCAL_ASSET_REGISTRY.note.exponent || GREATER_EXPONENT_DEFAULT),
      0,
    );
  const convertedTotalStaked = convertToGreaterUnit(
    totalStakedMLD,
    GREATER_EXPONENT_DEFAULT,
  ).toFixed(GREATER_EXPONENT_DEFAULT);

  const totalStakedRewards = rewards.reduce((sum, reward) => {
    const totalReward = reward.rewards.reduce((rSum, r) => rSum + parseFloat(r.amount), 0);
    return sum + totalReward;
  }, 0);
  const convertedTotalRewards = convertToGreaterUnit(
    totalStakedRewards,
    GREATER_EXPONENT_DEFAULT,
  ).toFixed(GREATER_EXPONENT_DEFAULT);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Swiper Component for Balance Cards */}
      <div className="relative h-48 flex-none overflow-hidden">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          loop={false}
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
        >
          <SwiperSlide>
            <div className="w-full px-4 mt-4 flex-shrink-0">
              <BalanceCard
                title="Available balance"
                balance={`${totalAvailableMLD} MLD`}
                currentStep={activeIndex}
                totalSteps={totalSlides}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full px-4 mt-4 flex-shrink-0">
              <BalanceCard
                title="Staked balance"
                balance={`${convertedTotalStaked} MLD`}
                reward={`${convertedTotalRewards} MLD`}
                currentStep={activeIndex}
                totalSteps={totalSlides}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Assets section */}
      <div className="flex-grow pt-4 pb-4 flex flex-col overflow-hidden">
        <h3 className="text-h4 text-white font-bold px-4 text-left">
          {activeIndex === 0 ? 'Holdings' : 'Validators'}
          <div className="flex justify-between text-neutral-1 text-xs font-bold">
            {activeIndex === 1 ? (
              <>
                <span>Delegations</span>
                <span>Rewards</span>
              </>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        </h3>
        {walletState.address ? (
          <TileScroller activeIndex={activeIndex} />
        ) : (
          <p className="text-base text-neutral-1 px-4">No available assets</p>
        )}
      </div>
    </div>
  );
};
