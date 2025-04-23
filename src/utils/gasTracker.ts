/**
* @title Real-time Gas Fee Tracker
* @author Tony Nagy - Solidity / AWS Developer
* @dev Utility functions to retrieve gas data from providers
*/

import { JsonRpcProvider } from 'ethers';
import { formatUnits } from 'ethers';
import { networks } from '../config/networks';

interface GasData {
  network: string;
  gasPriceGwei: string;
  estimatedGasFee: string;
  usdEquivalent: string;
  nativeToken: string;
  responseTimeMs: number;
}

export async function getGasDataForNetworks(
  selectedNetworkKeys: string[]
): Promise<GasData[]> {
  const results: GasData[] = [];

  for (const key of selectedNetworkKeys) {
    const net = networks.find((n) => n.key === key);
    if (!net) continue;

    const provider = new JsonRpcProvider(net.rpcUrl);
    const start = Date.now();

    let gasPrice;
    try {
      gasPrice = await provider.send('eth_gasPrice', []);
    } catch (err) {
      console.error(`Failed to fetch gas price for ${key}`, err);
      continue;
    }

    const end = Date.now();

    const gasPriceGwei = parseFloat(formatUnits(gasPrice, 'gwei'));
    const estimatedGasFee = gasPriceGwei * 21000;
    const estimatedGasFeeEth = estimatedGasFee / 1e9;
    const usdEquivalent = (estimatedGasFeeEth * net.usdPricePerToken).toFixed(4);    

    results.push({
      network: net.name,
      gasPriceGwei: gasPriceGwei.toFixed(2),
      estimatedGasFee: estimatedGasFee.toFixed(4),
      usdEquivalent,
      nativeToken: net.nativeToken,
      responseTimeMs: end - start,
    });
  }

  return results;
}
