import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

// TODO: move API Model Properties to DTO in documentation
@Entity()
export class User extends BaseEntity {
  @ApiModelProperty({ type: 'number', nullable: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  phone: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  smsCode: string;

  @ApiModelProperty({ type: 'string', nullable: true, format: 'date-time' })
  @Column({ nullable: true })
  lastCode: Date;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  email: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  password: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  resetCode: string;

  @ApiModelProperty({ type: 'string', nullable: true, format: 'date-time' })
  @Column({ nullable: true })
  resetCodeExpirationDate: Date;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  firstName: string;

  @ApiModelProperty({ type: 'string', nullable: true })
  @Column({ nullable: true })
  lastName: string;

  @ApiModelProperty({
    type: 'string',
    nullable: true,
    format: 'date-time',
    description: 'ISO string',
  })
  @Column({ nullable: true })
  birthday: Date;
}
