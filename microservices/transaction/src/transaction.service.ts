import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  TransactionCreationDto,
} from './dto/create-transaction.dto';
import { KafkaService } from './kafka/kafka.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TransactionService {
  static readonly TRANSFER_TYPES_NAMES = {
    1: 'yape',
    2: 'plin'
  };

  static readonly TRANSACTION_STATUS_NAMES = {
    1: 'pending',
    2: 'approved',
    3: 'rejected'
  };
  constructor(private httpService: HttpService, private readonly kafkaService: KafkaService) {}

  async createTransaction(input: TransactionCreationDto): Promise<any> {

    // We create the transaction using the graphql microservice
    const transaction = await this.createTransactionWithExternalApi(input);

    // We send a message the kafka topic 
    await this.sendMessage(transaction);
    return transaction;
  }

  async createTransactionWithExternalApi(input: TransactionCreationDto):Promise<any>{
    const graphQlHost = process.env.GRAPHQL_HOST;
    const apiUrl = `http://${graphQlHost}:3003/graphql`;
    const mutation = `
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          id
          transactionExternalId
          status
          value
        }
      }
    `;

    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      transferTypeId,
      value,
    } = input;
    const variables = {
      input: {
        transactionExternalId: uuidv4(),
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
        status: 1
      }
    };

    const createdTransaction = await this.httpService.post(apiUrl, { query: mutation, variables }).toPromise();
    const transaction = createdTransaction.data.data.createTransaction;
    return transaction;
  }

  async sendMessage(transaction){
    const { transactionExternalId } = transaction;
    console.log("sendMessage transactionExternalId:::: ", transactionExternalId);
    await this.kafkaService.sendMessage('transactions.created', {
      transactionExternalId
    });
  }

  async getTransaction(transactionId:string) {
    const transaction = await this.getTransactionFromExternalService(transactionId);
    if (transaction){
      const {value, transactionExternalId,createdAt, status, transferTypeId}= transaction
      return {
        transactionExternalId,
        transactionType: {
          name: TransactionService.TRANSFER_TYPES_NAMES[transferTypeId]
        },
        transactionStatus: {
          name: TransactionService.TRANSACTION_STATUS_NAMES[status]
        },      
        value,
        createdAt
      }
    } else {
      return {};
    }

  }

  private async getTransactionFromExternalService(transactionExternalId:string) {
    const graphQlHost = process.env.GRAPHQL_HOST;
    const apiUrl = `http://${graphQlHost}:3003/graphql`;
    const query = `
      query GetTransactionByExternalId($transactionExternalId: String!) {
        transactionByExternalId(transactionExternalId: $transactionExternalId) {
          value,
          transactionExternalId,
          createdAt,
          status,
          transferTypeId
        }
      }
    `;

    const variables = {
      transactionExternalId
    };

    const dataTransaction = await this.httpService.post(apiUrl, { query, variables }).toPromise();
    const data = dataTransaction.data.data;
    return data ? data.transactionByExternalId : null;
  }
}
