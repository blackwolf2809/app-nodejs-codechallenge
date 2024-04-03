import { Transport } from '@nestjs/microservices';

export const kafkaConfig = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_GROUP_ID,
      brokers: [process.env.KAFKA_BROKER],
    },
    consumer: {
      groupId: process.env.KAFKA_GROUP_ID,
    },
  },
};
