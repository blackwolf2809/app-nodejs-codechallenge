import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
export class CreateTransactionRequest {
  public constructor(partial: Partial<CreateTransactionRequest>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  transferTypeId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  value: number;
}
