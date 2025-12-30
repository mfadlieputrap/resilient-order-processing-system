import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, EachMessagePayload, Kafka, Producer } from 'kafkajs';
import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka = new Kafka(kafkaConfig);
  private producer: Producer = this.kafka.producer();
  private consumers: Consumer[] = [];

  async onModuleInit() {
    await this.connectProducerWithRetry();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await Promise.all(this.consumers.map((c) => c.disconnect()));
  }

  private async connectProducerWithRetry() {
    while (true) {
      try {
        await this.producer.connect();
        console.log('✅ Kafka producer connected');
        break;
      } catch (e) {
        console.log('⏳ Waiting Kafka broker...', (e as Error).message);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }

  async emit<T>(topic: string, payload: T, key?: string) {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(payload),
            key: key ?? undefined,
          },
        ],
      });
    } catch (e) {
      console.error(`Kafka emit error [${topic}]`, (e as Error).message);
    }
  }

  async subscriber(
    groupId: string,
    topic: string,
    handler: (payload: EachMessagePayload) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({ groupId });

    let connected = false;

    while (!connected) {
      try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        connected = true;
        console.log(`✅ Consumer ${groupId} subscribed to ${topic}`);
      } catch (e) {
        console.log(
          `⏳ Kafka not ready, retry ${groupId}...`,
          (e as Error).message,
        );
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await handler(payload);
        } catch (err) {
          console.error(
            `❌ Error processing message on ${topic}`,
            (err as Error).message,
          );
        }
      },
    });

    this.consumers.push(consumer);
  }

  async subscribeMany(
    groupId: string,
    topics: string[],
    handler: (payload: EachMessagePayload) => Promise<void>,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    let connected = false;

    while (!connected) {
      try {
        await consumer.connect();
        // Langsung subscribe ke array topics
        await consumer.subscribe({ topics, fromBeginning: false });
        connected = true;
        console.log(
          `✅ Consumer ${groupId} subscribed to: [${topics.join(', ')}]`,
        );
      } catch (e) {
        console.log(
          `⏳ Kafka not ready, retry ${groupId}...`,
          (e as Error).message,
        );
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    await consumer.run({
      eachMessage: async (payload) => {
        try {
          await handler(payload);
        } catch (err) {
          // Ambil nama topik langsung dari payload supaya log akurat
          console.error(
            `❌ Error processing message on topic: ${payload.topic}`,
            (err as Error).message,
          );
        }
      },
    });

    this.consumers.push(consumer);
  }
}
