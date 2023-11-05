import { Contract } from 'ethers';
import { useMutation } from 'react-query'
import { UnsignedTransactionRequest, usePrivy, useWallets } from '@privy-io/react-auth';

interface IUsePrepareContractWriteOptions {
  address: string;
  abi: any;
  functionName: string;
  args?: any[];
  onTxWait?: (tx: { hash: string; }) => void;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}

export const useContractWrite = (options: IUsePrepareContractWriteOptions) => {
  const { address, abi, functionName, args = [], onTxWait, onSuccess, onError } = options;

  const { user, sendTransaction } = usePrivy();
  const { wallets } = useWallets();

  const { mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: async (dynamicArgs?: any[] | undefined) => {
      const embeddedWallet = wallets.find((wallet) => wallet.address === user!.wallet?.address);

      if (!embeddedWallet) {
        return;
      }

      const provider = await embeddedWallet.getEthersProvider();

      if (embeddedWallet.walletClientType === 'privy') {
        await provider.send(
          'wallet_switchEthereumChain',
          ['0x66EED'],
        )
      }

      const contract = new Contract(
        address,
        abi,
        provider.getSigner() as any,
      );

      const gasLimit = await contract.estimateGas[functionName](...(dynamicArgs ? dynamicArgs : args));

      if (embeddedWallet.walletClientType === 'privy') {
        const txUnsigned = await contract.populateTransaction[functionName](...(dynamicArgs ? dynamicArgs : args)) as UnsignedTransactionRequest;
        const res = await sendTransaction({
          ...txUnsigned,
          chainId: parseInt('0x66EED', 16),
          gasLimit: gasLimit.toNumber(),
        });

        return res;
      } else {
        const tx = await contract[functionName](...(dynamicArgs ? dynamicArgs : args), { gasLimit });

        onTxWait?.(tx);

        const res = await tx.wait();

        return res;
      }
    },
    onSuccess,
    onError,
  });

  return {
    write: mutate,
    writeAsync: mutateAsync,
    ...rest,
  };
};