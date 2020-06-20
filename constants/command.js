const PENDING = "pending";
// const PROCESSING = "processing";
const CANCELED = "canceled";
// const DELIVERING = "delivering";
const COMPLETED = "completed";

exports.PENDING = PENDING;
// exports.PROCESSING = PROCESSING;
exports.CANCELED = CANCELED;
// exports.DELIVERING = DELIVERING;
exports.COMPLETED = COMPLETED;

exports.COMMAND_STATUSES = [
  PENDING,
  // PROCESSING,
  CANCELED,
  // DELIVERING,
  COMPLETED,
];

const RENT = "rent";
const BUY = "buy";
const BOTH = "both";

exports.COMMAND_TYPES = [RENT, BUY, BOTH];
