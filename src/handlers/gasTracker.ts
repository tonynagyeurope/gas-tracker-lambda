/**
* @title Real-time Gas Fee Tracker
* @author Tony Nagy - Solidity & AWS Developer
* @dev Handler function
*/

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { networks, Network } from '../config/networks';
import { getGasDataForNetworks } from '../utils/gasTracker';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const selectedNetworksParam = event.queryStringParameters?.networks;

    if (!selectedNetworksParam) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required query parameters: networks',
        }),
      };
    }
        
    // Filter valid networks
    const requestedKeys = selectedNetworksParam.split(',');

    const selectedNetworks: Network[] = requestedKeys
      .map((key) => networks.find((net) => net.key === key))
      .filter((net): net is Network => net !== undefined);    

    if (selectedNetworks.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'No valid networks provided.',
        }),
      };
    }

    const gasData = await getGasDataForNetworks(
      selectedNetworks.map((n) => n.key)
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://gas.tonynagy.io', 
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',        
      },
      body: JSON.stringify({ gasData }),
    };
  } catch (err: any) {
    console.error('Error in gasTracker handler:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
