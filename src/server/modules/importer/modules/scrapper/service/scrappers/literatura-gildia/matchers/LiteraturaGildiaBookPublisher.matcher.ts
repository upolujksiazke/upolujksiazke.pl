import {Logger} from '@nestjs/common';
import chalk from 'chalk';
import * as R from 'ramda';

import {normalizeParsedText} from '@server/common/helpers';
import {underscoreParameterize} from '@shared/helpers/parameterize';
import {parseAsyncURLIfOK} from '@server/common/helpers/fetchAsyncHTML';
import {concatUrls} from '@shared/helpers/concatUrls';

import {CreateBookPublisherDto} from '@server/modules/book/modules/publisher/dto/BookPublisher.dto';

import {ScrapperMatcher, ScrapperMatcherResult} from '../../../shared/ScrapperMatcher';
import {BookShopScrappersGroupConfig} from '../../BookShopScrappersGroup';

export class LiteraturaGildiaBookPublisherMatcher extends ScrapperMatcher<CreateBookPublisherDto> {
  private readonly logger = new Logger(LiteraturaGildiaBookPublisherMatcher.name);

  constructor(
    private readonly config: BookShopScrappersGroupConfig,
  ) {
    super();
  }

  async matchRecord(
    scrapperInfo: CreateBookPublisherDto,
    attrs?: {
      path: string,
    },
  ): Promise<ScrapperMatcherResult<CreateBookPublisherDto>> {
    const {config, logger} = this;
    const {name, description, address, email} = scrapperInfo;

    const url = concatUrls(
      config.homepageURL,
      attrs?.path ?? `wydawnictwa/${underscoreParameterize(name)}`,
    );

    logger.log(`Direct fetching publisher from ${chalk.bold(url)}!`);

    const {$} = await parseAsyncURLIfOK(url);
    const $content = $('#yui-main .widetext');
    const segments = $content.find('p').toArray().map((item) => $(item).text());
    const [
      descriptionSegments,
      propsSegments,
    ] = (
      R
        .splitWhen(
          (line: string) => (
            line.startsWith('ul.')
              || line.includes('Kontakt:')
              || line.includes('Dane teleadresowe')
          ),
          segments,
        )
        .map(
          (items) => items.join('\n'),
        )
    );

    return {
      result: new CreateBookPublisherDto(
        {
          name: name ?? normalizeParsedText($('h1').text()),
          description: description ?? descriptionSegments,
          address: address ?? propsSegments.match(/^\s*ul.\s*(.*)$/m)?.[1],
          email: email ?? propsSegments.match(/^\s*e-mail:\s*(.*)$/m)?.[1].trim(),
        },
      ),
    };
  }
}