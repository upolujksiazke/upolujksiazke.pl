import {Module} from '@nestjs/common';

import {TagModule} from '../tag';
import {BookAuthorModule} from './modules/author/BookAuthor.module';
import {BookReviewerModule} from './modules/reviewer/BookReviewer.module';
import {BookCategoryModule} from './modules/category/BookCategory.module';
import {BookReviewModule} from './modules/review/BookReview.module';
import {BookKindModule} from './modules/kind';
import {BookReleaseModule} from './modules/release';
import {BookPublisherModule} from './modules/publisher';
import {BookAvailabilityModule} from './modules/availability';
import {BookVolumeModule} from './modules/volume';
import {BookPrizeModule} from './modules/prize';
import {BookSeriesModule} from './modules/series';
import {BookStatsModule} from './modules/stats';
import {BookSEOModule} from './modules/seo';

import {
  CardBookSearchService,
  BookService,
  BookTagsService,
  FuzzyBookSearchService,
} from './services';

@Module(
  {
    imports: [
      BookAvailabilityModule,
      BookPublisherModule,
      BookReleaseModule,
      BookAuthorModule,
      BookReviewerModule,
      BookReviewModule,
      BookCategoryModule,
      BookVolumeModule,
      BookKindModule,
      BookPrizeModule,
      BookSeriesModule,
      BookStatsModule,
      BookSEOModule,
      TagModule,
    ],
    providers: [
      BookService,
      BookTagsService,
      FuzzyBookSearchService,
      CardBookSearchService,
    ],
    exports: [
      FuzzyBookSearchService,
      BookService,
      BookTagsService,
      BookAvailabilityModule,
      BookStatsModule,
      BookPublisherModule,
      BookReleaseModule,
      BookAuthorModule,
      BookReviewerModule,
      BookReviewModule,
      BookCategoryModule,
      BookVolumeModule,
      BookKindModule,
      BookPrizeModule,
      BookSeriesModule,
      BookSEOModule,
      CardBookSearchService,
    ],
  },
)
export class BookModule {}
