import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { networks } from './config/networks';
import { getGasDataForNetworks } from './utils/gasTracker';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const selectedNetworksParam = event.queryStringParameters?.networks;

    if (!selectedNetworksParam) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required query parameter: networks',
        }),
      };
    }

    const selectedNetworkKeys = selectedNetworksParam.split(',');
    const selected = selectedNetworkKeys
      .map((key) => networks.find((n) => n.key === key))
      .filter((n): n is NonNullable<typeof n> => !!n);

    if (selected.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'No valid networks provided.',
        }),
      };
    }

    const gasData = await getGasDataForNetworks(selected.map((n) => n.key));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ gasData }),
    };
  } catch (err: any) {
    console.error('Error in gasTracker handler:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
