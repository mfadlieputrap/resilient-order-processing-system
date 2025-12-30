const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'kafka-init',
  brokers: ['kafka:29092'],
});

const admin = kafka.admin();

(async () => {
  while (true) {
    try {
      await admin.connect();
      break;
    } catch {
      console.log('Waiting Kafka broker...');
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: 'order.created', numPartitions: 3 },
      { topic: 'product.stock_decreased', numPartitions: 3 },
      { topic: 'product.stock_failed', numPartitions: 3 },
      { topic: 'audit.log', numPartitions: 3 },
      { topic: 'order.status_cancelled', numPartitions: 3 },
      { topic: 'order.status_completed', numPartitions: 3 },
    ],
  });

  console.log('✅ Kafka topics ready');
  await admin.disconnect();
})();
