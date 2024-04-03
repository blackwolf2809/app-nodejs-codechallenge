import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionResponse {
  public constructor(partial: Partial<CreateTransactionResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  transferTypeId: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}
