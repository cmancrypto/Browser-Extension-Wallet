import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { AssetScroller, BalanceCard } from '@/components';
import { useAtomValue } from 'jotai';
import { walletStateAtom } from '@/atoms';
import { useState } from 'react';

export const Main = () => {
  const walletState = useAtomValue(walletStateAtom);
  const totalSlides = 2;
  const [activeIndex, setActiveIndex] = useState(0);

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
        <h3 className="text-h4 text-white font-bold px-4 text-left">Assets</h3>
        {walletState.address ? (
          <AssetScroller />
        ) : (
          <p className="text-base text-neutral-1 px-4">No available assets</p>
        )}
      </div>
    </div>
  );
};
