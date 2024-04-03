import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionInput } from './transaction.input';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async findByExternalId(transactionExternalId: string): Promise<Transaction> {
    return this.transactionRepository.findOneBy({transactionExternalId});
  }  

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const transaction = this.transactionRepository.create(input);
    return this.transactionRepository.save(transaction);
  }

  async updateStatusByExternalId(transactionExternalId: string, newStatus: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { transactionExternalId } });

    if (!transaction) {
      throw new Error(`Transaction with external ID ${transactionExternalId} not found`);
    }

    transaction.status = newStatus;

    return await this.transactionRepository.save(transaction);
  }

}
