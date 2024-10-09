import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { BalanceCard, TileScroller } from '@/components';
import { walletStateAtom, delegationAtom, paginationAtom, validatorInfoAtom } from '@/atoms';
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { fetchDelegations, fetchValidatorInfo } from '@/helpers/fetchStakedAssets';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY, CHAIN_NODES } from '@/constants';
import axios from 'axios';
import { ValidatorReward } from '@/types';

export const Main = () => {
  const walletState = useAtomValue(walletStateAtom);
  const [delegationState, setDelegationState] = useAtom(delegationAtom);
  const setPaginationState = useSetAtom(paginationAtom);
  const setValidatorInfo = useSetAtom(validatorInfoAtom);
  const totalSlides = 2;
  const [activeIndex, setActiveIndex] = useState(0);
  // TODO: set rewards to atom for use on asset scroller
  const [rewards, setRewards] = useState<ValidatorReward[]>([]);

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

  // Calculate total staked MLD balance
  const totalStakedMLD = delegationState
    .filter(delegation => delegation.balance.denom === 'note')
    .reduce(
      (sum, delegation) =>
        sum +
        parseFloat(delegation.balance.amount) /
          Math.pow(10, LOCAL_ASSET_REGISTRY.note.exponent || GREATER_EXPONENT_DEFAULT),
      0,
    )
    .toFixed(GREATER_EXPONENT_DEFAULT);

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
                balance="$1504.94"
                currentStep={activeIndex}
                totalSteps={totalSlides}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full px-4 mt-4 flex-shrink-0">
              <BalanceCard
                title="Staked balance"
                balance={`${totalStakedMLD} MLD`}
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
          {activeIndex === 0 ? 'Available' : 'Staked'}
        </h3>
        {walletState.address ? (
          <TileScroller activeIndex={activeIndex} rewards={rewards} />
        ) : (
          <p className="text-base text-neutral-1 px-4">No available assets</p>
        )}
      </div>
    </div>
  );
};
