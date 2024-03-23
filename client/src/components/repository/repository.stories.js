import Repository from './repository';

const repositoryData = {
  id: 10270250,
  node_id: 'MDEwOlJlcG9zaXRvcnkxMDI3MDI1MA==',
  name: 'react',
  full_name: 'facebook/react',
  private: false,
  html_url: 'https://github.com/facebook/react',
  description: 'The library for web and native user interfaces.',
  fork: false,
  url: 'https://api.github.com/repos/facebook/react',
  languages_url: 'https://api.github.com/repos/facebook/react/languages',
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2024-03-17T02:37:45Z',
  pushed_at: '2024-03-17T01:34:23Z',
  homepage: 'https://react.dev',
  size: 405436,
  stargazers_count: 220201,
  watchers_count: 220201,
  language: 'JavaScript',
  languageData: {
    JavaScript: 4168197,
    HTML: 120786,
    CSS: 64424,
    'C++': 44290,
    TypeScript: 21136,
    CoffeeScript: 17378,
    C: 5227,
    Shell: 2205,
    Python: 259,
    Makefile: 189,
  },
  forks_count: 44998,
  open_issues_count: 1620,
  license: {
    key: 'mit',
    name: 'MIT License',
    spdx_id: 'MIT',
    url: 'https://api.github.com/licenses/mit',
    node_id: 'MDc6TGljZW5zZTEz',
  },
  topics: ['declarative', 'frontend', 'javascript', 'library', 'react', 'ui'],
  subscribers_count: 6634,
  owner: {
    login: 'facebook',
    id: 69631,
    node_id: 'MDEyOk9yZ2FuaXphdGlvbjY5NjMx',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
};

export default {
  title: 'gitstream/components/Repository',
  component: Repository,
};

export const Default = {
  args: { ...repositoryData },
};
