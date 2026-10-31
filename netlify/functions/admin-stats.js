const { connect, getModels } = require('../lib/db');
const { json } = require('../lib/http');
const { isAdmin } = require('../lib/auth');

const TZ = process.env.DASHBOARD_TZ || 'Asia/Kolkata';

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') return json(405, { ok: false, error: 'Method Not Allowed' });
  if (!isAdmin(event)) return json(401, { ok: false, error: 'unauthorized' });

  const days = Math.min(Math.max(parseInt((event.queryStringParameters || {}).days, 10) || 30, 1), 3650);
  const match = { timestamp: { $gte: new Date(Date.now() - days * 86400000) } };

  try {
    await connect();
    const { Visitor, VisitEvent, Message } = getModels();

    const top = (field, n = 8) =>
      VisitEvent.aggregate([
        { $match: match },
        { $group: { _id: { $ifNull: ['$' + field, 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: n },
      ]);

    const [byType, uniq, daily, sources, devices, browsers, countries, lifetime, cameBack, recent, msgTotal, msgNew] =
      await Promise.all([
        VisitEvent.aggregate([{ $match: match }, { $group: { _id: '$isNewVisitor', count: { $sum: 1 } } }]),
        VisitEvent.aggregate([{ $match: match }, { $group: { _id: '$visitorId' } }, { $count: 'n' }]),
        VisitEvent.aggregate([
          { $match: match },
          { $group: { _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp', timezone: TZ } }, n: '$isNewVisitor' }, count: { $sum: 1 } } },
        ]),
        top('source'), top('device'), top('browser'), top('country'),
        Visitor.countDocuments(),
        Visitor.countDocuments({ visitCount: { $gt: 1 } }),
        Visitor.find().sort({ lastVisit: -1 }).limit(15)
          .select('visitorId firstVisit lastVisit visitCount device browser os country lastSource').lean(),
        Message.countDocuments(),
        Message.countDocuments({ status: 'new' }),
      ]);

    let newV = 0;
    let ret = 0;
    byType.forEach((r) => (r._id ? (newV = r.count) : (ret = r.count)));

    // Daily series with gaps filled in
    const map = {};
    daily.forEach((r) => {
      const d = r._id.d;
      map[d] = map[d] || { date: d, newVisitors: 0, returning: 0 };
      if (r._id.n) map[d].newVisitors = r.count; else map[d].returning = r.count;
    });
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
    const keys = Object.keys(map).sort();
    const series = [];
    if (keys.length) {
      for (let t = Date.parse(keys[0] + 'T00:00:00Z'), end = Date.parse(todayStr + 'T00:00:00Z'); t <= end; t += 86400000) {
        const d = new Date(t).toISOString().slice(0, 10);
        series.push(map[d] || { date: d, newVisitors: 0, returning: 0 });
      }
    }
    const today = map[todayStr] ? map[todayStr].newVisitors + map[todayStr].returning : 0;
    const rows = (a) => a.map((r) => ({ name: r._id, count: r.count }));

    return json(200, {
      ok: true,
      days,
      kpis: {
        totalVisits: newV + ret,
        uniqueVisitors: uniq[0] ? uniq[0].n : 0,
        newVisitors: newV,
        returningVisits: ret,
        today,
        allTimeVisitors: lifetime,
        cameBackAllTime: cameBack,
        messagesTotal: msgTotal,
        messagesUnread: msgNew,
      },
      daily: series,
      sources: rows(sources),
      devices: rows(devices),
      browsers: rows(browsers),
      countries: rows(countries),
      recent: recent.map((v) => ({ ...v, visitorId: v.visitorId.slice(0, 8), _id: undefined })),
    });
  } catch (err) {
    console.error('admin-stats error:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
};
