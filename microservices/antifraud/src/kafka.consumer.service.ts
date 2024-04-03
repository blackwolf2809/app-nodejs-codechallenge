import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService {
  static readonly APPROVED_STATUS = 2;
  static readonly REJECTED_STATUS = 3;
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor(private readonly httpService: HttpService) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });
    
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'transactions.created' });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transaction = JSON.parse(message.value.toString());
        const validation = await this.validateTransaction(transaction);
        const {transactionExternalId ,newStatus}= validation;
        await this.sendNewStatusMessage(transactionExternalId,newStatus);
      },
    });
  }

  private async validateTransaction(transaction: any) {
    // Retrieving value amount from the database using the graphql microservice

    const {transactionExternalId} = transaction;
    const transactionValue = await this.getValueFromTransaction(transactionExternalId);
    const value = transactionValue || 0;
    let newStatus = KafkaConsumerService.APPROVED_STATUS;
    if (value > 1000 || value === 0) {
      newStatus = KafkaConsumerService.REJECTED_STATUS;
    }

    return {transactionExternalId ,newStatus};
  }

  private async getValueFromTransaction(transactionExternalId:string) {
    const graphQlHost = process.env.GRAPHQL_HOST;
    const apiUrl = `http://${graphQlHost}:3003/graphql`;
    const query = `
      query GetTransactionByExternalId($transactionExternalId: String!) {
        transactionByExternalId(transactionExternalId: $transactionExternalId) {
          transactionExternalId
          value
        }
      }
    `;

    const variables = {
      transactionExternalId
    };

    const dataTransaction = await this.httpService.post(apiUrl, { query, variables }).toPromise();
    const transaction = dataTransaction.data.data.transactionByExternalId;
    return transaction.value;
  }

  private async sendNewStatusMessage(transactionExternalId, newStatus){
    await this.sendMessage('transactions.updated', {
      transactionExternalId,
      newStatus
    });
  }

  async disconnect() {
    await this.consumer.disconnect();
    await this.producer.disconnect();
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
