const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress;

  // Log request
  console.log(`🔵 ${method} ${url} - ${ip}`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    
    // Color coding for status
    let statusColor = '';
    if (status >= 200 && status < 300) {
      statusColor = '🟢'; // Green for success
    } else if (status >= 300 && status < 400) {
      statusColor = '🟡'; // Yellow for redirects
    } else if (status >= 400 && status < 500) {
      statusColor = '🟠'; // Orange for client errors
    } else if (status >= 500) {
      statusColor = '🔴'; // Red for server errors
    }

    console.log(`${statusColor} ${method} ${url} - ${status} - ${duration}ms`);
    
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = requestLogger;