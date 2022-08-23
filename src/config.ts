interface Environment {
  title: string;
  subgraphUrl: string;
}

interface Config {
  environments: {
    [key: string]: Environment;
  };
}

const config: Config = {
  environments: {
    testEnv6: {
      title: 'GIVpower Test env',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/aminlatifi/givpower-deployment-six',
    },
  },
};

export default config;
