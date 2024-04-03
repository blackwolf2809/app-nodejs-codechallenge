import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeResponse {
  @ApiProperty({
    description: 'Name',
    type: 'string',
  })
  name: string;
}

export class TransactionStatusResponse {
  @ApiProperty({
    description: 'Name',
    type: 'string',
  })
  name: string;
}

export class GetTransactionResponse {
  public constructor(partial: Partial<GetTransactionResponse>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty({
    description: 'Transaction type detail',
    type: () => TransactionTypeResponse,
  })
  transactionType: TransactionTypeResponse;

  @ApiProperty({
    description: 'Transaction status detail',
    type: () => TransactionStatusResponse,
  })
  transactionStatus: TransactionStatusResponse;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}

