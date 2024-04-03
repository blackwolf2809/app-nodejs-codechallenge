import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { TransactionService } from './transaction.service';
import { CreateTransactionInput } from './transaction.input';
import { Transaction } from './transaction.graphql.entity';

@Resolver(of => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(returns => [Transaction])
  async transactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Query(returns => Transaction)
  async transactionByExternalId(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<Transaction> {
    return await this.transactionService.findByExternalId(transactionExternalId);
  }

  @Mutation(returns => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.create(input);
  }

  @Mutation(returns => Transaction)
  async updateTransactionStatus(
    @Args('transactionExternalId') transactionExternalId: string,
    @Args('newStatus') newStatus: number,
  ): Promise<Transaction> {
    return await this.transactionService.updateStatusByExternalId(transactionExternalId, newStatus);
  }
}
