import winston from 'winston';

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(), // adds a timestamp property
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
