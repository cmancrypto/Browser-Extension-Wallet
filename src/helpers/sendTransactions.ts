import { queryRpcNode } from './queryNodes';
import { SendObject } from '@/types';

export const sendTransaction = async (fromAddress: string, sendObject: SendObject) => {
  const endpoint = '/cosmos.bank.v1beta1.MsgSend';
  const messages = [
    {
      typeUrl: endpoint,
      value: {
        fromAddress,
        toAddress: sendObject.recipientAddress,
        amount: [{ denom: sendObject.denom, amount: sendObject.amount }],
      },
    },
  ];

  try {
    const response = await queryRpcNode({
      endpoint,
      messages,
      feeDenom: sendObject.denom,
    });

    console.log('Successfully sent:', response);
  } catch (error) {
    console.error('Error during send:', error);
  }
};

// TODO: suppose sends of multiple different currencies
export const multiSendTransaction = async (fromAddress: string, sendObjects: SendObject[]) => {
  const endpoint = '/cosmos.bank.v1beta1.MsgSend';

  const messages = sendObjects.map(sendObject => ({
    typeUrl: endpoint,
    value: {
      fromAddress,
      toAddress: sendObject.recipientAddress,
      amount: [{ denom: sendObject.denom, amount: sendObject.amount }],
    },
  }));

  try {
    const unstakeResponse = await queryRpcNode({
      endpoint,
      messages,
      feeDenom: sendObjects[0].denom,
    });

    console.log('Successfully sent to all recipients:', unstakeResponse);
  } catch (error) {
    // TODO: show error to user
    console.error('Error during sending:', error);
  }
};
