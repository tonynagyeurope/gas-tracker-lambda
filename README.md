# Gas Tracker Lambda

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## Author
Tony Nagy - Solidity & AWS Developer
https://tonynagy.io

## Description
Gas Tracker Lambda is an AWS Lambda function written in TypeScript that fetches real-time gas fee data across multiple blockchain networks (e.g., Ethereum, Polygon, Arbitrum). It is exposed via Amazon API Gateway with an API key for authorized access.

## Key Features
- **Multi-chain support**: Fetch current gas prices from Ethereum, Polygon, and Arbitrum networks
- **Cost estimation**: Calculate estimated transaction fees in native token units and USD
- **Configurable RPC providers**: Use Alchemy RPC endpoints via environment variables
- **Low-latency**, lightweight Lambda function (128 MB, 10 s timeout)
- **Infrastructure-as-Code**: CloudFormation template for deployment

## Technology Stack
- **Runtime:** Node.js 20.x on AWS Lambda
- **Language:** TypeScript (compiled to CommonJS)
- **Blockchain SDK:** Ethers.js
- **Configuration:** dotenv
- **Infrastructure:** AWS CloudFormation & API Gateway

## Prerequisites
- **Node.js** (>=14) and **npm** or **Yarn**
- **AWS CLI** configured with sufficient permissions
- **AWS Account** with IAM permissions to deploy CloudFormation stacks and manage Lambda & API Gateway
- **Alchemy** account for RPC endpoints

## Environment Variables
Create a `.env` file in the project root (ignored by Git) with the following keys:
```ini
ALCHEMY_ETHEREUM_RPC=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
ALCHEMY_POLYGON_RPC=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_ARBITRUM_RPC=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
ALCHEMY_BASE_RPC=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

## Installation & Build
1. Clone the repository:
   ```bash
   git clone https://github.com/tonynagyeurope/gas-tracker-lambda.git
   cd gas-tracker-lambda
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Build TypeScript sources:
   ```bash
   npm run build
   ```

## Deployment
Deploy the Lambda and API Gateway via CloudFormation:
```bash
aws cloudformation deploy \
  --template-file cloudformation.yaml \
  --stack-name GasTrackerStack \
  --parameter-overrides \
      AlchemyEthereumRpc=$ALCHEMY_ETHEREUM_RPC \
      AlchemyPolygonRpc=$ALCHEMY_POLYGON_RPC \
      AlchemyArbitrumRpc=$ALCHEMY_ARBITRUM_RPC \
      AlchemyBaseRpc=$ALCHEMY_BASE_RPC \
  --capabilities CAPABILITY_NAMED_IAM
```
After deployment, note the API Gateway **Invoke URL** and **API Key** from the stack outputs.

## Usage
Send HTTP GET requests to the `/gas` endpoint with an API key header. Optionally filter by networks via query parameter:
- **Endpoint:** `https://{api-id}.execute-api.{region}.amazonaws.com/prod/gas`
- **Query Parameter:** `networks` (comma-separated list of network keys: `ethereum`, `polygon`, `arbitrum`)
- **Header:** `x-api-key: YOUR_API_KEY`

### Example Request
```bash
curl -X GET 'https://abcd1234.execute-api.eu-central-1.amazonaws.com/prod/gas?networks=ethereum,polygon' \
     -H 'x-api-key: YOUR_API_KEY' \
     -H 'Accept: application/json'
```

### Example Response
```json
{
  "gasData": [
    {
      "network": "Ethereum Mainnet",
      "gasPriceGwei": "45.23",
      "estimatedGasFee": "0.0023",
      "usdEquivalent": "3.45",
      "nativeToken": "ETH",
      "responseTimeMs": 120
    },
    {
      "network": "Polygon Mainnet",
      "gasPriceGwei": "1.15",
      "estimatedGasFee": "0.0001",
      "usdEquivalent": "0.00",
      "nativeToken": "MATIC",
      "responseTimeMs": 85
    }
  ]
}
```

## Infrastructure
The `cloudformation.yaml` template defines:
- **Lambda function** (`dist/handlers/gasTracker.handler`) with 128 MB RAM and 10 s timeout
- **API Gateway** REST API (stage `prod`)
- **API Key** and **Usage Plan** for throttling and monitoring

## Contributing
Contributions are welcome. Please open issues or pull requests against this repository.

## License
ISC License. See [package.json](./package.json) for details.


