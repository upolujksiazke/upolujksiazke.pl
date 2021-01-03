import * as R from 'ramda';
import {BookScrapperInfo} from '../../Book.scrapper';

/**
{
  RecordReference: 'pl-eisbn-1667470',
  NotificationType: '03',
  RecordSourceType: '01',
  RecordSourceName: 'Piotr Borowiak',
  ProductIdentifier: { ProductIDType: '15', IDValue: '9788394289607' },
  /: {
    ProductComposition: '00',
    ProductForm: 'BC',
    ProductFormFeature: { ProductFormFeatureType: '02', ProductFormFeatureValue: 'WHI' },
    PrimaryContentType: '10',
    ProductContentType: '18',
    TitleDetail: { TitleType: '01', TitleElement: [Object] },
    Contributor: {
      SequenceNumber: '1',
      ContributorRole: 'A01',
      PersonNameInverted: 'Piotr Borowiak'
    },
    EditionType: 'NED',
    EditionNumber: '1',
    Language: { LanguageRole: '01', LanguageCode: 'pol' },
    Extent: { ExtentType: '11', ExtentValue: '103', ExtentUnit: '03' },
    Subject: { SubjectSchemeIdentifier: 'A3', SubjectCode: '08' }
  },
  CollateralDetail: {
    TextContent: {
      TextType: '03',
      ContentAudience: '00',
      Text: 'Modlitewnik to efekt wnikliwych obserwacji tłumionych p'
    },
    SupportingResource: {
      ResourceContentType: '01',
      ContentAudience: '00',
      ResourceMode: '03',
      ResourceVersion: [Object]
    }
  },
  PublishingDetail: {
    Imprint: { ImprintName: 'Piotr Borowiak' },
    Publisher: { PublishingRole: '01', PublisherName: 'Piotr Borowiak' },
    CityOfPublication: 'Gliwice',
    CountryOfPublication: 'PL',
    PublishingDate: { PublishingDateRole: '09', Date: '20151211' }
  },
  ProductSupply: {
    SupplyDetail: {
      Supplier: [Object],
      ProductAvailability: '99',
      UnpricedItemType: '02'
    }
  },
  '$': { datestamp: '20170906' }
}
 */

const reverseContributorName: (str: string) => string = R.compose(
  R.join(' '),
  R.reverse as any,
  R.split(', ') as any,
) as any;

export type OnixBookFormat = {
  ProductIdentifier: {
    ProductIDType: string,
    IDValue: string,
  },
  DescriptiveDetail: {
    TitleDetail: {
      TitleType: string,
      TitleElement: {
        TitleElementLevel: string,
        TitleText: string,
      },
    },
    Contributor: {
      SequenceNumber: number,
      ContributorRole: string,
      PersonNameInverted: string,
    },
  },
};

export function convertOnixToBookxMetadata(onix: OnixBookFormat): BookScrapperInfo {
  const {DescriptiveDetail} = onix;
  const {Contributor, TitleDetail} = DescriptiveDetail;
  if (!Contributor?.PersonNameInverted || !TitleDetail)
    return null;

  const result: BookScrapperInfo = {
    isbn: onix.ProductIdentifier.IDValue,
    title: TitleDetail.TitleElement.TitleText,
    tags: [],
    categories: [],
    authors: [
      {
        name: reverseContributorName(Contributor.PersonNameInverted),
      },
    ],
  };

  if (result.title === 'Świętoszek') {
    console.info(result, JSON.stringify(onix as any));
    throw new Error;
  }
  return result;
}