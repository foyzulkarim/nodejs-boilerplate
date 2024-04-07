import { repositories } from 'src/_mock/repositories';

import Feed from './feed-cards'; // Assuming Feed is the component you want to create a story for

export default {
  title: 'gitstream/components/Feed',
  component: Feed,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: { items: repositories },
};
