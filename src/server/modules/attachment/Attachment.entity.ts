import * as path from 'path';
import * as fs from 'fs';

import {Expose} from 'class-transformer';
import {AfterRemove, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

import {SERVER_ENV} from '@server/constants/env';
import {DatedRecordEntity} from '../database/DatedRecord.entity';

@Entity('attachments')
export class AttachmentEntity extends DatedRecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(
    {
      type: 'varchar',
      length: 140,
    },
  )
  mimetype: string;

  @Column('bigint')
  size: number;

  @Column('text')
  file: string;

  @Column('text')
  name: string;

  @Column('boolean', {default: false})
  nsfw: boolean;

  @Column('float', {nullable: true})
  ratio: number;

  @Column('text', {nullable: true})
  originalUrl: string;

  @Expose()
  get url(): string {
    return `${SERVER_ENV.cdn.publicUrl}/${this.file}`;
  }

  @AfterRemove()
  removeFile() {
    fs.unlinkSync(
      path.join(SERVER_ENV.cdn.localPath, this.file),
    );
  }
}
