//bot/utils/logger.js
const fs = require ('fs');
const path = require ('path');
const { format } = require ('date-fns');  // Для формата даты

// Директории для логов
const logsDir = path.join('storage', 'logs');
const errorLogDir = path.join(logsDir, 'errors');
const infoLogDir = path.join(logsDir, 'info');
const secureLogDir = path.join(logsDir, 'secure');
const messageQueueLogDir = path.join(logsDir, 'queue');

// Проверка и создание директорий для логов, если они не существуют
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

if (!fs.existsSync(errorLogDir)) {
  fs.mkdirSync(errorLogDir, { recursive: true });
}

if (!fs.existsSync(infoLogDir)) {
  fs.mkdirSync(infoLogDir, { recursive: true });
}

if (!fs.existsSync(secureLogDir)) {
  fs.mkdirSync(secureLogDir, { recursive: true });
}

if (!fs.existsSync(messageQueueLogDir)) {
  fs.mkdirSync(messageQueueLogDir, { recursive: true });
}
// Генерация имени файла на основе текущей даты (например, errors-2024-12-10.log)
const getLogFileName = () => {
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  return `${currentDate}.log`;
};

// Путь к текущим лог-файлам
const currentErrorLogFile = path.join(errorLogDir, `errors-${getLogFileName()}`);
const currentInfoLogFile = path.join(infoLogDir, `info-${getLogFileName()}`);
const currentSecureLogFile = path.join(secureLogDir, `secure-${getLogFileName()}`);
const currentMessageQueueLogFile = path.join(messageQueueLogDir, `queue-${getLogFileName()}`);

// Запись ошибки в лог ошибок
const logError = (message) => {
  const logEntry = `[ERROR] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentErrorLogFile, logEntry, 'utf8');
  console.log(`[ERROR] [${new Date().toISOString()}]: ${message}\n`)
};

// Запись информации в лог обычных приложений
const logInfo = (message) => {
  const logEntry = `[INFO] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentInfoLogFile, logEntry, 'utf8');
};

// Запись информации в лог предупреждений/безопасности
const logSecure = (message) => {
  const logEntry = `[INFO-ERROR] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentSecureLogFile, logEntry, 'utf8');
};

// Запись информации в лог очереди сообщений
const logQueue = (message) => {
  const logEntry = `[INFO] [${new Date().toISOString()}]: ${message}\n`;
  fs.appendFileSync(currentMessageQueueLogFile, logEntry, 'utf8');
};
// Пока что старые логи нам ещё пригодятся
// // Функция для удаления старых логов (старше 30 дней) для каждой папки
// const deleteOldLogs = (logDir) => {
//   const files = fs.readdirSync(logDir);
//   const currentDate = new Date();

//   files.forEach((file) => {
//     const filePath = path.join(logDir, file);
//     const fileDateString = file.replace('.log', '').split('-').slice(1, 4).join('-');// Извлекаем дату в формате "2025-02-13"
//     const fileDate = new Date(fileDateString); // Преобразуем строку в дату

//     // Если файл старше 30 дней, удаляем его
//     if ((currentDate - fileDate) / (1000 * 60 * 60 * 24) > 30) {
//       fs.unlinkSync(filePath);
//       console.log(`Удален старый лог: ${file}`);
//     }
//   });
// };

// Удаление старых логов для обеих папок
// deleteOldLogs(errorLogDir);
// deleteOldLogs(infoLogDir);
// deleteOldLogs(secureLogDir);
// deleteOldLogs(messageQueueLogDir);

module.exports = { logError, logInfo, logSecure, logQueue};