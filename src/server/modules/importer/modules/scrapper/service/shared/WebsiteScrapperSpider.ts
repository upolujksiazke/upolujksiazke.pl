import {
  CrawlerLink, SpiderCrawler,
  SpiderCrawlerConfig, SpiderLinksMapperAttrs,
} from '../../../spider/crawlers';

import {ScrapperMetadataQueueDriver} from '../../../spider/drivers/DbQueue.driver';
import {ScrapperMetadataKind} from '../../entity/ScrapperMetadata.entity';
import {WebsiteInfoScrapperService} from '../WebsiteInfoScrapper.service';
import {ScrapperGroupChild} from './WebsiteScrappersGroup';

export enum ScrapperPriority {
  PAGINATION = 5,
  NEXT_PAGINATION_PAGE = 6,
}

export interface URLPathMatcher {
  /**
   * Returns kind of type based on path - it is used primarly in spider
   *
   * @abstract
   * @param {string} path
   * @returns {ScrapperMetadataKind}
   * @memberof WebsiteScrappersGroup
   */
  matchResourceKindByPath(path: string): ScrapperMetadataKind;
}

export type WebsiteSpiderScrapperRunConfig = {
  crawlerConfig?: Partial<SpiderCrawlerConfig>,
  websiteInfoService: WebsiteInfoScrapperService,
  dbQueueDriver: ScrapperMetadataQueueDriver,
};

/**
 * Abstract interface for website spider
 *
 * @export
 * @abstract
 * @class WebsiteScrapperSpider
 * @extends {ScrapperGroupChild}
 * @implements {URLPathMatcher}
 */
export abstract class WebsiteScrapperSpider extends ScrapperGroupChild implements URLPathMatcher {
  public static readonly RESOURCE_PRIORITY: Record<ScrapperMetadataKind, number> = {
    [ScrapperMetadataKind.BOOK]: 7,
    [ScrapperMetadataKind.BOOK_REVIEW]: 3,
    [ScrapperMetadataKind.BOOK_AUTHOR]: 2,
    [ScrapperMetadataKind.BOOK_PUBLISHER]: 2,
    [ScrapperMetadataKind.URL]: 0,
  };

  /**
   * @inheritdoc
   */
  abstract matchResourceKindByPath(path: string): ScrapperMetadataKind;

  /**
   * Calculates how attractive to spider is path
   *
   * @param {string} path
   * @memberof WebsiteScrapperSpider
   */
  getPathPriority(path: string): number {
    const kind = this.matchResourceKindByPath(path);

    return WebsiteScrapperSpider.RESOURCE_PRIORITY[kind] ?? 0;
  }

  /**
   * Maps links array, it is not used here but maybe in other websites so
   * It is used primarly for bad written websites when we need to generate some links
   *
   * @param {SpiderLinksMapperAttrs} {links}
   * @returns {CrawlerLink[]}
   * @memberof WebsiteScrapperSpider
   */
  postMapLinks({links}: SpiderLinksMapperAttrs): CrawlerLink[] {
    return links;
  }

  /**
   * Start spider
   *
   * @param {WebsiteSpiderScrapperRunConfig} attrs
   * @returns
   * @memberof ScrapperSpider
   */
  async run$(
    {
      crawlerConfig,
      websiteInfoService,
      dbQueueDriver,
    }: WebsiteSpiderScrapperRunConfig,
  ) {
    const {group} = this;
    const website = await websiteInfoService.findOrCreateWebsiteEntity(group.websiteInfoScrapper);
    const crawler = new SpiderCrawler(
      {
        storeOnlyPaths: true,
        shouldBe: {
          analyzed: ({queueItem}) => queueItem.priority > 0,
        },
        queueDriver: dbQueueDriver.createIndexedQueue(
          {
            website,
          },
        ),
        postMapLinks: this.postMapLinks.bind(this),
        preMapLink: (path) => new CrawlerLink(
          path,
          this.getPathPriority(path),
        ),
        ...crawlerConfig,
      },
    );

    return crawler.run$(
      {
        defaultUrl: website.url,
      },
    );
  }
}
