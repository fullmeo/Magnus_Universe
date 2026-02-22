// payment.js - Over-engineered payment processor (edge: gratuitous abstractions)

class AbstractPaymentLayer {
  constructor() {
    this.nextLayer = null;
  }
  setNext(layer) {
    this.nextLayer = layer;
  }
  async process(amount) {
    if (this.nextLayer) return this.nextLayer.process(amount);
    return { status: 'processed' };
  }
}

class ValidationLayer extends AbstractPaymentLayer {
  async process(amount) {
    if (amount <= 0) {
      return { error: 'Negative amount' };
    }
    return super.process(amount);
  }
}

class LoggingLayer extends AbstractPaymentLayer {
  async process(amount) {
    console.info(`Processing amount: ${amount}`);
    return super.process(amount);
  }
}

class StripeStubLayer extends AbstractPaymentLayer {
  async process(amount) {
    if (Math.random() > 0.2) {
      console.debug('Payment success');
      return { status: 'paid', id: 'txn_' + Date.now() };
    } else {
      console.error('Payment failed');
      throw new Error('Payment gateway error');
    }
  }
}

class PaymentProcessor {
  constructor() {
    this.chain = new ValidationLayer();
    this.chain.setNext(new LoggingLayer());
    this.chain.setNext(new StripeStubLayer());
  }
  async pay(amount) {
    try {
      return await this.chain.process(amount);
    } catch (err) {
      return { error: err.message };
    }
  }
}

async function processPayment(amount) {
  const processor = new PaymentProcessor();
  return processor.pay(amount);
}

module.exports = { processPayment };
