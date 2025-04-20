import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { networks, Network } from './config/networks';
import { getGasDataForNetworks } from './utils/gasTracker';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const queryParams = event.queryStringParameters || {};
  const requestedNetworks = (queryParams.networks?.split(',') || []) as string[];
  const usdAmount = queryParams.usdAmount ? parseFloat(queryParams.usdAmount) : undefined;

  // Add explicit type
  const selected: Network[] = networks.filter((net) =>
    requestedNetworks.includes(net.key)
  );

  if (selected.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No valid networks provided.' }),
    };
  }

  const result = await getGasDataForNetworks(
    selected.map((n) => n.key),
    usdAmount
  );

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
