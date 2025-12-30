# High-Availability Order Processing System (Microservices & Event-Driven)

This project demonstrates a robust, scalable, and resilient microservices architecture built with **NestJS** and **Apache Kafka**. It focuses on solving distributed system challenges such as data consistency, fault tolerance, and high-load handling using the **Saga Pattern**.

## 🏗️ Architecture & Tech Stack

- **Framework:** NestJS (Node.js)
- **Message Broker:** Apache Kafka (Event-Driven Backbone)
- **Design Pattern:** Saga Pattern (Choreography-based)
- **Database:** PostgreSQL (Per-service data isolation)
- **Containerization:** Docker & Docker Compose
- **API Gateway:** Centralized routing and authentication

## 🚀 Key Engineering Features

### 1. Event-Driven Reliability (Kafka)
The system utilizes Apache Kafka to decouple the **Order Service** from the **Audit Service**. This ensures that transaction logs are processed asynchronously without adding latency to the main checkout flow.

### 2. Distributed Consistency (Saga Pattern)
Implemented the Saga Pattern to manage stock reduction in the **Product Service** whenever an order is created. This ensures data integrity across services without relying on slow distributed transactions.

### 3. Fault Tolerance & Resilience
During failure testing, the system demonstrated high availability:
- Even when the **Audit Service** was down, the **Order Service** continued to accept requests.
- Kafka acted as a persistent buffer; once the Audit Service recovered, it automatically processed the pending events using **Offset Management**.

## 📊 Performance & Stress Testing Results

The system was rigorously tested using **Apache JMeter** on a resource-constrained environment (2 CPU Cores):

- **Concurrent Users:** 1,000 Threads
- **Stable Throughput:** ~14.0 requests per second
- **Peak Performance:** Handled high-load spikes with CPU utilization reaching **179.59%** without system crash.
- **Reliability:** Proven 0% data loss in the message broker during consumer downtime.

## 🛠️ How to Run

1. Clone the repository
2. Ensure Docker is installed
3. Run the orchestration:

```bash
  docker-compose up --build
```

### 4. Access the API via the Gateway at localhost:3000

Developed as a deep-dive into Event-Driven Microservices Architecture.