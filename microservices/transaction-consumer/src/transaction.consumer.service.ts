import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class TransactionConsumerService {
  static readonly APPROVED_STATUS = 2;
  static readonly REJECTED_STATUS = 3;
  private kafka: Kafka;
  private consumer: Consumer;

  constructor(private readonly httpService: HttpService) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
    });

    this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });
  }

  async connect() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'transactions.updated' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transaction = JSON.parse(message.value.toString());
        const {transactionExternalId ,newStatus}= transaction;
        await this.updateStatusTransaction(transactionExternalId,newStatus);
      },
    });
  }

  private async updateStatusTransaction(transactionExternalId:string, newStatus: number) {
    const graphQlHost = process.env.GRAPHQL_HOST;
    const apiUrl = `http://${graphQlHost}:3003/graphql`;
    const mutation = `
      mutation {
        updateTransactionStatus(transactionExternalId: "${transactionExternalId}", newStatus: ${newStatus}) {
          transactionExternalId
        }
      }
    `;

    await this.httpService.post(apiUrl, { query: mutation }).toPromise();
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
