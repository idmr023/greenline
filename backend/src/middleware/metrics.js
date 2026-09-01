const metrics = {
  startedAt: Date.now(),
  requests: { total: 0, byMethod: {}, byStatus: {} },
  inFlight: 0,
  totalResponseTimeMs: 0,
  maxResponseTimeMs: 0,
};

export function metricsMiddleware(req, res, next) {
  metrics.inFlight++;
  metrics.requests.total++;
  const method = req.method;
  metrics.requests.byMethod[method] = (metrics.requests.byMethod[method] || 0) + 1;

  const start = process.hrtime();
  res.on('finish', () => {
    const status = String(res.statusCode);
    metrics.requests.byStatus[status] = (metrics.requests.byStatus[status] || 0) + 1;
    const [s, ns] = process.hrtime(start);
    const ms = s * 1000 + ns / 1e6;
    metrics.totalResponseTimeMs += ms;
    if (ms > metrics.maxResponseTimeMs) metrics.maxResponseTimeMs = ms;
    metrics.inFlight--;
  });
  next();
}

export function getMetrics() {
  const mem = process.memoryUsage();
  const avgMs = metrics.requests.total
    ? metrics.totalResponseTimeMs / metrics.requests.total
    : 0;

  return {
    uptimeSec: Math.round(process.uptime()),
    pid: process.pid,
    startedAt: new Date(metrics.startedAt).toISOString(),
    requests: {
      total: metrics.requests.total,
      inFlight: metrics.inFlight,
      byMethod: metrics.requests.byMethod,
      byStatus: metrics.requests.byStatus,
      avgResponseTimeMs: Math.round(avgMs * 100) / 100,
      maxResponseTimeMs: Math.round(metrics.maxResponseTimeMs * 100) / 100,
    },
    memory: {
      rssMB: +(mem.rss / 1024 / 1024).toFixed(1),
      heapTotalMB: +(mem.heapTotal / 1024 / 1024).toFixed(1),
      heapUsedMB: +(mem.heapUsed / 1024 / 1024).toFixed(1),
      heapLimitMB: 400,
    },
  };
}
