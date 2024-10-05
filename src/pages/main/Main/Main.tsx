import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { AssetScroller, BalanceCard } from '@/components';
import { walletStateAtom, delegationAtom, paginationAtom, validatorInfoAtom } from '@/atoms';
import { useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { fetchDelegations, fetchValidatorInfo } from '@/helpers/fetchStakedAssets';
import { GREATER_EXPONENT_DEFAULT, LOCAL_ASSET_REGISTRY } from '@/constants';

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
          setDelegationState(delegations);
          setPaginationState(pagination);
        })
        .catch(error => console.error('Error fetching delegations:', error));
    }
  }, [activeIndex, walletState.address]);

  // Fetch validator information when delegations have been set
  useEffect(() => {
    if (delegationState.length > 0) {
      const validatorPromises = delegationState.map(delegation =>
        fetchValidatorInfo(delegation.delegation.validator_address),
      );

      Promise.all(validatorPromises)
        .then(validators => setValidatorInfo(validators))
        .catch(error => console.error('Error fetching validator information:', error));
    }
  }, [delegationState]);

  // Calculate total staked MLD balance (assuming 'note' is the denom for MLD)
  const exponent = LOCAL_ASSET_REGISTRY.note.exponent || GREATER_EXPONENT_DEFAULT;
  // TODO: remove hardcoding, change per chain
  const totalStakedMLD = delegationState
    .filter(delegation => delegation.balance.denom === 'note')
    .reduce((sum, delegation) => {
      // Convert the raw amount to MLD based on the exponent
      const convertedAmount = parseFloat(delegation.balance.amount) / Math.pow(10, exponent);
      return sum + convertedAmount;
    }, 0);

  // TODO: move to utils to format for display
  // Remove trailing zeros by parsing it as a float and converting it back to string
  const totalDisplayMLD = parseFloat(totalStakedMLD.toFixed(exponent)).toString();

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
                balance={`${totalDisplayMLD} MLD`}
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
