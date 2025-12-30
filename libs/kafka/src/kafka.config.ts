export const kafkaConfig = {
  clientId: 'marketplace-service',
  brokers: [process.env.KAFKA_BROKERS || 'kafka:9092'],
};
