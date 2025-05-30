export interface Network {
  key: string; // e.g., 'ethereum', 'polygon', 'arbitrum'
  name: string;
  rpcUrl: string;
  nativeToken: string;
  nativeDecimals: number;
  usdPricePerToken: number;
}

export const networks: Network[] = [
  {
    key: 'ethereum',
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.ALCHEMY_ETHEREUM_RPC!,
    nativeToken: 'ETH',
    nativeDecimals: 18,
    usdPricePerToken: 2507.55,
  },
  {
    key: 'polygon',
    name: 'Polygon Mainnet',
    rpcUrl: process.env.ALCHEMY_POLYGON_RPC!,
    nativeToken: 'MATIC',
    nativeDecimals: 18,
    usdPricePerToken: 0.24,
  },
  {
    key: 'arbitrum',
    name: 'Arbitrum One',
    rpcUrl: process.env.ALCHEMY_ARBITRUM_RPC!,
    nativeToken: 'ETH',
    nativeDecimals: 18,
    usdPricePerToken: 2507.55,
  },
  {
    key: 'base',
    name: 'Base',
    rpcUrl: process.env.ALCHEMY_BASE_RPC!, 
    nativeToken: 'ETH',
    nativeDecimals: 18,
    usdPricePerToken: 2510,
  }
];

for (const net of networks) {
  if (!net.rpcUrl) {
    console.warn(`Missing RPC URL for network: ${net.name}`);
  }
}  