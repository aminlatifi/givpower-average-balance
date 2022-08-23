export const calculateAverage = async (
  subgrahUrl: string,
  walletAddress: string,
  fromTimestamp: number,
  toTimestamp: number,
): Promise<string> => {
  return `
    subgraph: ${subgrahUrl}
    wallet: ${walletAddress}
    from: ${fromTimestamp}
    to: ${toTimestamp}
    `;
};
