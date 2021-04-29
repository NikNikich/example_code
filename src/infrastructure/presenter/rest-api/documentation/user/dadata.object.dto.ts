import { Column } from 'typeorm';

export class DadataObjectDto {
  @Column()
  country: string;

  @Column()
  region: string;

  @Column()
  area: string;

  @Column()
  city: string;

  @Column()
  house: string;
}
