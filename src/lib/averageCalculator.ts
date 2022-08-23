import { ApolloClient, InMemoryCache, gql, from } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';

interface GivPowerSnapshot {
  cumulativeGivPowerAmount: string;
  givPowerAmount: string;
  timestamp: string;
}

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
  if (!lastSnapShot) return BigNumber.from(0);

  return BigNumber.from(lastSnapShot.cumulativeGivPowerAmount).add(
    BigNumber.from(lastSnapShot.givPowerAmount).mul(timestamp - Number(lastSnapShot.timestamp)),
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

  return endCumulativePower
    .sub(startCumulativePower)
    .div(toTimestamp - fromTimestamp)
    .toString();
};
