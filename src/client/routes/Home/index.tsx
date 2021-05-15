import React from 'react';

import {objPropsToPromise} from '@shared/helpers';

import {AsyncRoute} from '@client/components/utils/asyncRouteUtils';
import {
  BookCardRecord,
  CategoryBooksGroup,
} from '@api/types';

import {Container} from '@client/components/ui';
import {Layout, LayoutViewData} from '@client/containers/layout';

import {RootCategoriesSection} from '@client/containers/kinds/category';
import {
  RecentBooksSection,
  CategoriesGroupsBooksSection,
} from '@client/containers/kinds/book';

import {LazyHydrate} from '@client/components/ui/LazyHydrate';
import {HOME_PATH} from '../Links';

type HomeRouteProps = {
  layoutData: LayoutViewData,
  recentBooks: BookCardRecord[],
  popularCategoriesBooks: CategoryBooksGroup[],
};

export const HomeRoute: AsyncRoute = (
  {
    layoutData: {
      rootPopularCategories,
      ...layoutData
    },
    recentBooks,
    popularCategoriesBooks,
  }: HomeRouteProps,
) => (
  <Layout {...layoutData}>
    <LazyHydrate>
      <Container className='c-sections-list'>
        <RootCategoriesSection items={rootPopularCategories} />
        <CategoriesGroupsBooksSection items={popularCategoriesBooks} />
        <RecentBooksSection items={recentBooks} />
      </Container>
    </LazyHydrate>
  </Layout>
);

HomeRoute.route = {
  path: HOME_PATH,
  exact: true,
};

HomeRoute.getInitialProps = (attrs) => {
  const {api: {repo}} = attrs;

  return objPropsToPromise(
    {
      layoutData: Layout.getInitialProps(attrs),
      recentBooks: repo.books.findRecentBooks(
        {
          limit: 7,
        },
      ),
      popularCategoriesBooks: repo.recentBooks.findCategoriesPopularBooks(
        {
          itemsPerGroup: 14,
          limit: 6,
          root: true,
        },
      ),
    },
  );
};
