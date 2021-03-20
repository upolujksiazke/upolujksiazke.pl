import {plainToClass} from 'class-transformer';
import * as R from 'ramda';

import {ID} from '@shared/types';
import {
  convertMinutesToSeconds,
  convertHoursToSeconds,
} from '@shared/helpers';

import {BookEntity} from '@server/modules/book';
import {BooksRepo} from '@api/repo';
import {BasicAPIPagination} from '@api/shared/types';

import {RedisMemoize} from '../../helpers';
import {MeasureCallDuration} from '../../helpers/MeasureCallDuration';
import {
  BookCardSerializer,
  BookFullInfoSerializer,
} from '../../serializers';

import {ServerAPIClientChild} from '../ServerAPIClientChild';

export class BooksServerRepo extends ServerAPIClientChild implements BooksRepo {
  /**
   * Picks newest books
   *
   * @param {BasicAPIPagination} filters
   * @returns
   * @memberof RecentBooksServerRepo
   */
  @MeasureCallDuration('findRecentBooks')
  @RedisMemoize(
    ({limit, offset}) => ({
      key: `recent-books-${offset}-${limit}`,
      expire: convertMinutesToSeconds(35),
    }),
  )
  async findRecentBooks(
    {
      offset = 0,
      limit = 6,
    }: BasicAPIPagination = {},
  ) {
    const {services: {bookService}} = this;
    const latestBooksIds = R.pluck(
      'id',
      await BookEntity
        .createQueryBuilder('book')
        .select(['id'])
        .offset(offset)
        .limit(limit)
        .orderBy('book.createdAt', 'DESC')
        .getRawMany(),
    );

    return plainToClass(
      BookCardSerializer,
      await (
        bookService
          .createCardsQuery()
          .whereInIds(latestBooksIds)
          .orderBy('book.createdAt', 'DESC')
          .getMany()
      ),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * Finds one book
   *
   * @param {ID} id
   * @returns
   * @memberof BooksServerRepo
   */
  @MeasureCallDuration((id: ID) => `findOne(id: ${id})`)
  @RedisMemoize(
    (id: ID) => ({
      key: `book-${id}`,
      expire: convertHoursToSeconds(0.5),
    }),
  )
  async findOne(id: ID) {
    const {bookService} = this.api.services;
    const book = await bookService.findFullCard(+id);

    return plainToClass(
      BookFullInfoSerializer,
      book,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
