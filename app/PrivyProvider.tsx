'use client'

import { PrivyProvider } from '@privy-io/react-auth'

export default function Provider({
  children
}) {
    return (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: [ 'wallet', 'twitter',"email"],
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
            
            logo: 'https://nftstorage.link/ipfs/bafkreiclz4ni5sqyqiq6tlqfd4onjubisfdbbpyzyawm6h4grqqivyybfe',
          },
          embeddedWallets: {
            createOnLogin: 'all-users',
            noPromptOnSignature: false
          }
        }}>
           {children}
      </PrivyProvider>
    )
}