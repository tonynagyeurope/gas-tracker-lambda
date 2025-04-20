// src/utils/gasTracker.ts

import { JsonRpcProvider, formatUnits } from 'ethers';
import { networks, Network } from '../config/networks';

export interface GasResult {
  network: string;
  gasPriceGwei: string;
  estimatedGasFee: string;
  nativeToken: string;
  usdEquivalent: string;
}

export async function getGasDataForNetworks(
  selectedNetworks: string[], // ⬅️ csak kulcsok
  usdAmount?: number
): Promise<GasResult[]> {
  const results: GasResult[] = [];

  for (const network of networks as Network[]) {
    if (!selectedNetworks.includes(network.key)) continue;

    const provider = new JsonRpcProvider(network.rpcUrl);

    try {
      // 1. Fetch the current gas price (BigInt in wei)
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? BigInt(0); // fallback to 0 if null

      // 2. Assume standard transfer uses 21,000 gas units
      const estimatedGasUnits = BigInt(21000);
      const estimatedGasFee = gasPrice * estimatedGasUnits;

      // 3. Convert gas price and estimated fee to readable values (Gwei & native)
      const gasPriceGwei = formatUnits(gasPrice, 'gwei');
      const estimatedFeeInNative = formatUnits(estimatedGasFee, network.nativeDecimals);

      // 4. Calculate the USD equivalent of estimated gas
      const usdEquivalent = ((Number(estimatedFeeInNative) * network.usdPricePerToken)).toFixed(6);

      results.push({
        network: network.name,
        gasPriceGwei,
        estimatedGasFee: estimatedFeeInNative,
        nativeToken: network.nativeToken,
        usdEquivalent,
      });
    } catch (error) {
      console.error(`Failed to fetch gas data for ${network.name}:`, error);
    }
  }

  return results;
}
