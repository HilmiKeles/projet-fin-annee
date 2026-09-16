const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const esTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
  },
  index: 'thetiptop-logs',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Logs dans la console Docker (toujours utile pour docker logs)
    new winston.transports.Console(),
    // Logs envoyés vers Elasticsearch
    esTransport,
  ],
});

// Afficher les erreurs du transport Elasticsearch (sinon elles sont silencieuses)
logger.on('error', (error) => console.error('❌ Erreur Winston:', error));
esTransport.on('error', (error) => console.error('❌ Erreur ES Transport:', error));

module.exports = logger;