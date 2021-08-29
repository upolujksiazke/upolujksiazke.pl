import React from 'react';

import {useI18n} from '@client/i18n';

import {BookFullInfoRecord} from '@api/types';
import {Section} from '@client/components/ui';
import {BookPricesTabs} from './BookPricesTabs';

type BookAvailabilitySectionProps = {
  book: BookFullInfoRecord,
  shrink?: boolean,
};

export const BookAvailabilitySection = ({book, shrink}: BookAvailabilitySectionProps) => {
  const t = useI18n('book.availability');
  if (!book.releases)
    return null;

  return (
    <Section
      spaced={3}
      title={
        t('title')
      }
      subsection
      noContentSpacing
    >
      <BookPricesTabs
        book={book}
        shrink={shrink}
      />
    </Section>
  );
};

BookAvailabilitySection.displayName = 'BookAvailabilitySection';
