import { NavLink } from 'react-router-dom';
import { ReceiveDialog } from '@/components';
import { ROUTES } from '@/constants';
import { Button } from '@/ui-kit';

interface BalanceCardProps {
  title: string;
  balance: string;
  currentStep: number;
  totalSteps: number;
}

// Stub functions for "Unstake All" and "Claim All"
const unstakeAll = () => {
  console.log('Unstake All function triggered');
};

const claimAll = () => {
  console.log('Claim All function triggered');
};

export const BalanceCard = ({ title, balance, currentStep, totalSteps }: BalanceCardProps) => {
  return (
    <div className="p-4 h-44 border rounded-xl border-neutral-4 flex flex-col items-center relative">
      <div className="text-center mb-7">
        <p className="text-base text-neutral-1">{title}</p>
        <h1 className="text-h2 text-white font-bold">{balance}</h1>
      </div>
      <div className="grid grid-cols-2 w-full gap-x-4 px-2">
        {currentStep === 0 && (
          <>
            <ReceiveDialog />
            <Button className="w-full" asChild>
              <NavLink to={ROUTES.APP.SEND}>Send</NavLink>
            </Button>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Button className="w-full" onClick={unstakeAll}>
              Unstake All
            </Button>
            <Button className="w-full" onClick={claimAll}>
              Claim All
            </Button>
          </>
        )}
      </div>

      {/* Step Indicator */}
      <div className="absolute bottom-2 flex space-x-2">
        {[...Array(totalSteps)].map((_, index) => (
          <span
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-blue' : 'bg-neutral-4'}`}
          />
        ))}
      </div>
    </div>
  );
};
