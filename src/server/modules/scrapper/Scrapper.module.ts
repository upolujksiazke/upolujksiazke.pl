import {Module} from '@nestjs/common';
import {MikroOrmModule} from '@mikro-orm/nestjs';

import {BookEntity} from '../book/Book.entity';
import {BookReviewEntity} from '../book-review/BookReview.entity';

import {
  ScrapperCronService,
  ScrapperService,
} from './service';

import {
  ScrapperMetadataEntity,
  ScrapperWebsiteEntity,
} from './entity';

@Module(
  {
    imports: [
      MikroOrmModule.forFeature(
        [
          BookEntity,
          BookReviewEntity,
          ScrapperWebsiteEntity,
          ScrapperMetadataEntity,
        ],
      ),
    ],
    controllers: [],
    providers: [
      ScrapperService,
      ScrapperCronService,
    ],
  },
)
export class ScrapperModule {}
