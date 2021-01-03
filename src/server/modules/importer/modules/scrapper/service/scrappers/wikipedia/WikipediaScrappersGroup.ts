import {ScrapperMetadataKind} from '@server/modules/importer/modules/scrapper/entity';
import {WebsiteInfoScrapper, WebsiteScrappersGroup} from '../../shared';
import {
  WikipediaAPIOptions,
  WikipediaBookMatcher,
} from './WikipediaBook.matcher';

export type WikipediaScrappersGroupConfig = {
  homepageURL: string,
  clientOptions: WikipediaAPIOptions,
};

export class WikipediaScrappersGroup extends WebsiteScrappersGroup {
  constructor({clientOptions, homepageURL}: WikipediaScrappersGroupConfig) {
    super(
      {
        websiteInfoScrapper: new WebsiteInfoScrapper(homepageURL),
        matchers: {
          [ScrapperMetadataKind.BOOK]: new WikipediaBookMatcher(clientOptions),
        },
      },
    );
  }
}