import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { AssetScroller, BalanceCard } from '@/components';
import { walletStateAtom, delegationAtom, validatorInfoAtom, paginationAtom } from '@/atoms';
import { useState, useEffect } from 'react';
import { fetchDelegations, fetchValidatorInfo } from '@/helpers/fetchStakedAssets';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export const Main = () => {
  const walletState = useAtomValue(walletStateAtom);
  const [delegationState, setDelegationState] = useAtom(delegationAtom);
  const setPaginationState = useSetAtom(paginationAtom);
  const setValidatorInfo = useSetAtom(validatorInfoAtom);

  const totalSlides = 2;
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch delegations when activeIndex is 1 and wallet address exists
  useEffect(() => {
    if (activeIndex === 1 && walletState.address) {
      fetchDelegations(walletState.address)
        .then(({ delegations, pagination }) => {
          console.log('Fetched delegations:', delegations);
          setDelegationState(delegations);
          setPaginationState(pagination);
        })
        .catch(error => console.error('Error fetching delegations:', error));
    }
  }, [activeIndex, walletState.address]);

  // Fetch validator information when delegations have been set
  useEffect(() => {
    console.log('delegation state updated to:', delegationState);
    if (delegationState.length > 0) {
      const validatorPromises = delegationState.map(delegation => {
        // Print the delegation.delegation object to the console
        console.log('main 36, Delegation object:', delegation);
        console.log('main 37, validator address:', delegation.delegation.validator_address);

        // Continue with the fetchValidatorInfo call
        return fetchValidatorInfo(delegation.delegation.validator_address);
      });

      Promise.all(validatorPromises)
        .then(validators => {
          console.log('Fetched validators:', validators);
          setValidatorInfo(validators);
        })
        .catch(error => console.error('Error fetching validator information:', error));
    }
  }, [delegationState]);

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
                balance="1504.94"
                currentStep={activeIndex}
                totalSteps={totalSlides}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full px-4 mt-4 flex-shrink-0">
              <BalanceCard
                title="Staked balance"
                balance="9999.99"
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
          {activeIndex === 0 ? 'Available Assets' : 'Staked Assets'}
        </h3>
        {walletState.address ? (
          <AssetScroller activeIndex={activeIndex} />
        ) : (
          <p className="text-base text-neutral-1 px-4">No available assets</p>
        )}
      </div>
    </div>
  );
};
