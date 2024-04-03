import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@ObjectType()
export class Transaction {
  @Field(type => Int)
  id: number;

  @Field()
  @IsUUID()
  transactionExternalId: string;

  @Field()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit: string;

  @Field(type => Int)
  transferTypeId: number;

  @Field(type => Float)
  value: number;

  @Field(type => Int)
  status: number;

  @Field(type => Date)
  createdAt: Date;
}
