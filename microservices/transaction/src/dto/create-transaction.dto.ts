export class TransactionCreationDto {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export class Transaction {
  public constructor(partial: Partial<Transaction>) {
    Object.assign(this, partial);
  }
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
  status: number;
}

export class TransactionUpdateDto {
  transactionExternalId: string;
  transactionStatus: number;
}
