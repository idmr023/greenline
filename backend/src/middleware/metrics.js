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

// Export en formato texto Prometheus (text/plain; version=0.0.4)
// para scraping por Grafana/ops. Sin dependencias, se derivan del mismo
// registro en memoria de getMetrics().
export function getPrometheusMetrics() {
  const m = getMetrics();
  const lines = [];

  const meter = (name, help, type, value) => {
    lines.push(`# HELP ${name} ${help}`);
    lines.push(`# TYPE ${name} ${type}`);
    lines.push(`${name} ${value}`);
  };

  meter('process_uptime_seconds', 'Tiempo de actividad del proceso', 'gauge', m.uptimeSec);
  meter('greenline_requests_total', 'Peticiones HTTP totales', 'counter', m.requests.total);
  meter('greenline_requests_in_flight', 'Peticiones en curso', 'gauge', m.requests.inFlight);
  meter('greenline_requests_avg_response_ms', 'Latencia media por petición', 'gauge', m.requests.avgResponseTimeMs);
  meter('greenline_requests_max_response_ms', 'Latencia máxima por petición', 'gauge', m.requests.maxResponseTimeMs);

  for (const [method, count] of Object.entries(m.requests.byMethod)) {
    lines.push(`greenline_requests_total_by_method{method="${method}"} ${count}`);
  }
  for (const [status, count] of Object.entries(m.requests.byStatus)) {
    lines.push(`greenline_requests_total_by_status{status="${status}"} ${count}`);
  }

  meter('process_memory_rss_bytes', 'Memoria RSS', 'gauge', m.memory.rssMB * 1024 * 1024);
  meter('process_memory_heap_total_bytes', 'Heap total', 'gauge', m.memory.heapTotalMB * 1024 * 1024);
  meter('process_memory_heap_used_bytes', 'Heap usado', 'gauge', m.memory.heapUsedMB * 1024 * 1024);

  return lines.join('\n') + '\n';
}
