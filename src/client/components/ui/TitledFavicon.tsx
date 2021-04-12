import React from 'react';
import c from 'classnames';

import noImagePlaceholderUrl from '@assets/img/no-image-placeholder.png';
import {Favicon} from './Favicon';

type TitledFaviconProps = JSX.IntrinsicElements['span'] & {
  src: string,
  title?: string,
  tag?: any,
  href?: string,
  rel?: string,
};

export const TitledFavicon = (
  {
    src, title, children, className,
    tag: Tag = 'span',
    ...props
  }: TitledFaviconProps,
) => (
  <Tag
    className={c(
      'c-flex-row is-text-semibold',
      Tag === 'a' && (
        'is-undecorated-link has-hover-underline has-double-link-chevron'
      ),
      className,
    )}
    {...props}
  >
    <Favicon
      className='mr-2'
      src={src || noImagePlaceholderUrl}
      title={title}
      alt='Logo'
    />
    {children || title}
  </Tag>
);

TitledFavicon.displayName = 'TitledFavicon';