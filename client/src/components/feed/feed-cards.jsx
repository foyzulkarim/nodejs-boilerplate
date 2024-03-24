import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import RepositoryCard from '../repository/repository-card';

const FeedCards = ({ items }) => (
  <Stack spacing={2}>
    {items.map((item) => (
      <RepositoryCard {...item} />
    ))}
  </Stack>
);

FeedCards.propTypes = {
  items: PropTypes.array.isRequired,
};

export default FeedCards;
