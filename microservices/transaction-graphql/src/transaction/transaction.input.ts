import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsIn, IsUUID, isEnum } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsUUID()
  transactionExternalId: string;

  @Field()
  @IsUUID()
  accountExternalIdDebit: string;

  @Field()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsIn([1,2]) // I'm not sure about the meaning and values of this field. Let's guess it just for the sake of the demo though. 1: yape, 2: plin
  @Field(type => Int)
  transferTypeId: number;

  @Field(type => Float)
  value: number;

  @IsIn([1,2,3]) // 1: pending, 2: approved, 3: rejected
  @Field(type => Int)
  status: number;
}
