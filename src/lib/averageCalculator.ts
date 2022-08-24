import { ApolloClient, InMemoryCache, gql, from } from '@apollo/client';
import BigNumber from 'bignumber.js';

interface GivPowerSnapshot {
  cumulativeGivPowerAmount: string;
  givPowerAmount: string;
  timestamp: string;
}

const toBN = (n: string | number) => new BigNumber(n);

const givpowerSnapshotQuery = `
  query($walletAddress: String, $fromTimestamp: Int, $toTimestamp: Int) {
    beforeStart: userGivPowerSnapshots(first: 1, where: {user:$walletAddress, timestamp_lte: $fromTimestamp}, orderBy: timestamp, orderDirection: desc) {
      givPowerAmount
      cumulativeGivPowerAmount
      timestamp
      user{id}
    }
    beforeEnd: userGivPowerSnapshots(first: 1, where: {user:$walletAddress, timestamp_lte: $toTimestamp}, orderBy: timestamp, orderDirection: desc) {
      givPowerAmount
      cumulativeGivPowerAmount
      timestamp
       user{id}

    }
  }
`;

const getCumulativeGower = (timestamp: number, [lastSnapShot]: GivPowerSnapshot[]): BigNumber => {
  if (!lastSnapShot) return toBN(0);

  return toBN(lastSnapShot.cumulativeGivPowerAmount).plus(
    toBN(lastSnapShot.givPowerAmount).times(timestamp - Number(lastSnapShot.timestamp)),
  );
};

export const calculateAverage = async (
  subgrahUrl: string,
  walletAddress: string,
  fromTimestamp: number,
  toTimestamp: number,
): Promise<string> => {
  const client = new ApolloClient({
    uri: subgrahUrl,
    cache: new InMemoryCache(),
  });
  let result;

  try {
    result = await client.query({
      query: gql(givpowerSnapshotQuery),
      variables: {
        walletAddress: walletAddress.toLowerCase(),
        fromTimestamp,
        toTimestamp,
      },
    });
  } catch (e) {
    return JSON.stringify(e, null, 2);
  }

  const beforeStart: GivPowerSnapshot[] = result.data.beforeStart;
  const beforeEnd: GivPowerSnapshot[] = result.data.beforeEnd;

  if (fromTimestamp > toTimestamp) return '0';
  if (fromTimestamp === toTimestamp) {
    return beforeEnd.length > 0 ? beforeEnd[0].givPowerAmount : '0';
  }

  const startCumulativePower = getCumulativeGower(fromTimestamp, beforeStart);
  const endCumulativePower = getCumulativeGower(toTimestamp, beforeEnd);

  const averageGivPower = endCumulativePower
    .minus(startCumulativePower)
    .div(toTimestamp - fromTimestamp);

  return `
    average GIVpower:
        eth: ${averageGivPower
          .div(10 ** 18)
          .decimalPlaces(18, BigNumber.ROUND_DOWN)
          .toFormat({
            groupSize: 3,
            groupSeparator: ',',
            decimalSeparator: '.',
          })}
        wei: ${averageGivPower.toFixed(0)}
    
  `;
};
