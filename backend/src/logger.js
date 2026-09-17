const winston = require('winston');

const transports = [
  new winston.transports.Console(),
];

const esUrl =
  process.env.ELASTICSEARCH_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://elasticsearch:9200' : null);

if (esUrl) {
  try {
    const { ElasticsearchTransport } = require('winston-elasticsearch');
    const esTransport = new ElasticsearchTransport({
      level: 'info',
      clientOpts: { node: esUrl },
      index: 'thetiptop-logs',
    });
    transports.push(esTransport);
    esTransport.on('error', (error) => console.error('❌ Erreur ES Transport:', error));
  } catch (erreur) {
    console.error('❌ Elasticsearch indisponible, logs console uniquement:', erreur.message);
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

logger.on('error', (error) => console.error('❌ Erreur Winston:', error));

module.exports = logger;