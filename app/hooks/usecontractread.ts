import { Contract } from 'ethers';
import { useQuery } from 'react-query'
import { usePrivy, useWallets } from '@privy-io/react-auth';

interface IUsePrepareContractReadOptions  {
  address: string;
  abi: any;
  functionName: string;
  args: any[];
  enabled?: boolean;
  onSuccess?: (result: any) => void;
}

export const useContractRead = (options: IUsePrepareContractReadOptions) => {
  const { address, abi, functionName, args = [], enabled = true, onSuccess } = options;

  const { user } = usePrivy();
  const { wallets } = useWallets();

  return useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: enabled && !!user && !!wallets.length,
    queryKey: [address, functionName, args],
    queryFn: async () => {
      // await signMessage('hello world');

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
        provider as any,
      );

      const fn = contract[functionName];

      const res = await fn(...args);

      return res;
    },
    onSuccess,
  });
};