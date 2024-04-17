import React from 'react';
import { NavLink } from 'react-router-dom';

import { Pending, Success } from '@/assets/icons';
import { ROUTES } from '@/constants';
import { cn } from '@/helpers/utils';
import { ScrollArea } from '@/ui-kit';

const EXAMPLE_HISTORY = [
  {
    id: 1,
    date: '16.03.2024',
    transactions: [
      {
        id: 1,
        type: 'Deposit',
        status: 'pending',
        amount: '-0.01 MLD',
      },
      {
        id: 2,
        type: 'Deposit',
        status: 'pending',
        amount: '-0.01 MLD',
      },
    ],
  },
  {
    id: 2,
    date: '14.03.2024',
    transactions: [
      {
        id: 1,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 2,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 3,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 4,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 5,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 6,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 7,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
    ],
  },
  {
    id: 3,
    date: '13.03.2024',
    transactions: [
      {
        id: 1,
        type: 'Deposit',
        status: 'pending',
        amount: '-3 MLD',
      },
      {
        id: 2,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 3,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
      {
        id: 4,
        type: 'Deposit',
        status: 'confirmed',
        amount: '-10 MLD',
      },
      {
        id: 5,
        type: 'Withdraw',
        status: 'confirmed',
        amount: '+100 MLD',
      },
    ],
  },
];

enum TransactionStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
}

enum TransactionType {
  WITHDRAW = 'Withdraw',
  DEPOSIT = 'Deposit',
}

type TransactionIcons = {
  [key in TransactionStatus]: React.JSX.Element;
};

const TRANSACTION_ICON: TransactionIcons = {
  [TransactionStatus.CONFIRMED]: <Success />,
  [TransactionStatus.PENDING]: <Pending />,
};

export const TransactionsHistory: React.FC = () => (
  <div className="h-full pt-5">
    <h1 className="text-h4 text-white text-left px-4 font-bold">Transactions history</h1>
    <ScrollArea
      className="h-[458px] w-full mt-3"
      type="always"
      scrollbarProps={{
        className: 'max-h-[97%]',
      }}
    >
      {EXAMPLE_HISTORY.map(item => (
        <div key={item.id}>
          <h3 className="text-base text-white text-left px-4">{item.date}</h3>
          <div className="pt-1.5 pb-3">
            {item.transactions.map(transaction => (
              <NavLink
                key={transaction.id}
                to={`${ROUTES.APP.TRANSACTIONS_HISTORY}/${transaction.id}`}
                className="mx-4 py-2 min-h-[52px] flex items-center not-last:border-b not-last:border-neutral-4"
              >
                <div className="rounded-full h-9 w-9 bg-neutral-2 p-2 flex items-center justify-center">
                  {TRANSACTION_ICON[transaction.status as TransactionStatus]}
                </div>
                <div className="flex flex-col ml-3 text-left">
                  <h6 className="text-base text-white">{transaction.type}</h6>
                  <p className="text-xs text-neutral-1 capitalize">{transaction.status}</p>
                </div>
                <div className="flex-1" />
                <p
                  className={cn(
                    'text-lg',
                    transaction.status === TransactionStatus.CONFIRMED &&
                      transaction.type === TransactionType.WITHDRAW &&
                      'text-success',
                    transaction.status === TransactionStatus.CONFIRMED &&
                      transaction.type === TransactionType.DEPOSIT &&
                      'text-error',
                    transaction.status === TransactionStatus.PENDING && 'text-warning',
                  )}
                >
                  {transaction.amount}
                </p>
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  </div>
);
