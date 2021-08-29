import React from 'react';
import c from 'classnames';
import * as R from 'ramda';

import avatarPlaceholderUrl from '@assets/img/avatar-placeholder.png';
import {formatDate} from '@shared/helpers/format';

import {useI18n} from '@client/i18n';
import {useUA} from '@client/modules/ua';

import {BookReviewRecord} from '@api/types';
import {RatingsRow} from '@client/containers/controls/RatingsRow';
import {TitledFavicon} from '@client/components/ui/TitledFavicon';
import {
  ExpandableDescriptionBox,
  UndecoratedLink,
  CleanList,
  Picture,
  ExpandableDescriptionBoxProps,
} from '@client/components/ui';

import {BookThumbCard} from '../../book/cards/BookThumbCard';
import {WideBookCard} from '../../book/cards/WideBookCard';
import {BookReviewReactions} from '../controls/BookReviewReactions';

export type BookReviewProps = {
  review: BookReviewRecord,
  showBookCard?: boolean,
  moreButtonRenderFn?: ExpandableDescriptionBoxProps['moreButtonRenderFn'],
  totalRatingStars?: number,
  maxCharacterCount?: number,
  showReactionsTitles?: boolean,
};

export const BookReview = (
  {
    review,
    showBookCard,
    moreButtonRenderFn,
    maxCharacterCount,
    showReactionsTitles = true,
    totalRatingStars = 10,
  }: BookReviewProps,
) => {
  const t = useI18n();
  const ua = useUA();
  const {
    reviewer, description,
    rating, publishDate,
    url, website, book,
    quote,
  } = review;

  if (!description)
    return null;

  maxCharacterCount ??= ua.mobile ? 400 : 500;

  if (!moreButtonRenderFn && quote && url) {
    moreButtonRenderFn = () => (
      <UndecoratedLink
        href={review.url}
        target='_blank'
        rel='nofollow noreferrer'
        className='c-promo-tag-link is-text-no-wrap ml-2'
        undecorated={false}
        withChevron
      >
        {t('book.reviews.read_full_review')}
      </UndecoratedLink>
    );
  }

  const bookCardVisible = showBookCard && book;
  return (
    <li
      id={`review-${review.id}`}
      className={c(
        'c-book-review',
        bookCardVisible && 'has-book-card',
      )}
    >
      {bookCardVisible && (
        ua.mobile
          ? (
            <WideBookCard
              item={book}
              className='c-book-review__book'
              withDescription={false}
              totalRatingStars={7}
            />
          )
          : (
            <BookThumbCard
              item={book}
              className='c-book-review__book'
            />
          )
      )}

      <div className='c-book-review__content'>
        <div className='c-book-review__toolbar'>
          <Picture
            className='c-book-review__user-avatar'
            src={(
              reviewer.avatar?.smallThumb?.file || avatarPlaceholderUrl
            )}
            alt='Avatar'
          />

          <CleanList
            className='c-book-review__user-info'
            block
            {...(
              ua.mobile
                ? {
                  inline: false,
                }
                : {
                  separated: true,
                  inline: true,
                  spaced: 4,
                }
            )}
          >
            <li>
              <span className='c-book-review__user-nick is-text-bold'>
                {reviewer.name}
              </span>
            </li>

            {publishDate && (
              <li className='is-text-light-muted'>
                {formatDate(publishDate)}
              </li>
            )}
          </CleanList>

          {!R.isNil(rating) && (
            <div className='c-book-review__user-rating c-flex-row ml-auto'>
              {`${t('shared.titles.rating')}:`}
              <RatingsRow
                className='ml-2'
                value={rating / 10}
                totalStars={totalRatingStars}
                textOnly={ua.mobile}
                showTextValue
              />
            </div>
          )}
        </div>

        <ExpandableDescriptionBox
          className='c-book-review__text'
          maxCharactersCount={maxCharacterCount}
          padding='small'
          quote={!!website}
          text={description}
          moreButtonRenderFn={moreButtonRenderFn}
          filled
          html
        />

        {website && (
          <div className='c-book-review__footer'>
            <BookReviewReactions
              reviewId={review.id}
              stats={review.stats}
              showTitles={showReactionsTitles}
            />

            <span className='c-book-review__more c-flex-row'>
              {!ua.mobile && `${t('review.read_more_at')}:`}
              <TitledFavicon
                tag='a'
                className='ml-2'
                href={url}
                src={website.logo.smallThumb?.file}
                title={website.hostname}
                target='_blank'
                rel='noopener noreferrer'
              />
            </span>
          </div>
        )}
      </div>
    </li>
  );
};

BookReview.displayName = 'BookReview';
