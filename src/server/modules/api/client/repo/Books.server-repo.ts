import {plainToClass} from 'class-transformer';
import {SelectQueryBuilder} from 'typeorm';

import {ID} from '@shared/types';

import {
  convertMinutesToSeconds,
  convertHoursToSeconds,
} from '@shared/helpers';

import {BookEntity, BookService} from '@server/modules/book';
import {BooksRepo, SingleBookSearchAttrs} from '@api/repo';
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
    const books = await (
      bookService
        .createCardsQuery(
          BookService.BOOK_CARD_FIELDS,
          (qb: SelectQueryBuilder<BookEntity>) => (
            qb
              .subQuery()
              .from(BookEntity, 'book')
              .select('*')
              .offset(offset)
              .limit(limit)
              .orderBy('book.createdAt', 'DESC')
          ),
        )
        .orderBy('book.createdAt', 'DESC')
        .getMany()
    );

    return plainToClass(
      BookCardSerializer,
      books,
      {
        excludeExtraneousValues: true,
      },
    );
  }

  /**
   * Finds one book
   *
   * @param {ID} id
   * @param {Object} attrs
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
  async findOne(
    id: ID,
    {
      reviewsCount,
    }: SingleBookSearchAttrs = {},
  ) {
    const {bookService} = this.api.services;
    const book = await bookService.findFullCard(
      {
        id: +id,
        reviewsCount,
      },
    );

    return plainToClass(
      BookFullInfoSerializer,
      book,
      {
        excludeExtraneousValues: true,
      },
    );
  }
}