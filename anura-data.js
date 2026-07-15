/* ============================================================
   Anura Advertising — shared data layer
   Persists content in the browser's localStorage so the public
   site (index.html) and the admin panel (admin.html) stay in
   sync ON THE SAME BROWSER / DEVICE.

   IMPORTANT (read this before wiring up real hosting):
   This is a client-side-only data store. It is great for demos,
   single-operator use on one computer, or as a starting point —
   but localStorage is private to one browser, so a quote a
   customer submits on their own phone will NOT show up in your
   admin panel unless the admin panel is opened in that same
   browser. For a real multi-device, multi-visitor system, this
   data layer should be swapped for a real backend (e.g. a small
   API + database, or a service like Supabase/Firebase). The
   function names below are written so that swap is a matter of
   changing what's inside each function, not how the rest of the
   site calls them.
   ============================================================ */

const AnuraData = (function () {
  const KEYS = {
    portfolio: 'anura_portfolio',
    testimonials: 'anura_testimonials',
    services: 'anura_services',
    stats: 'anura_stats',
    bookings: 'anura_bookings',
    quotes: 'anura_quotes',
    auth: 'anura_admin_auth',
  };

  const DEFAULTS = {
    portfolio: [
      { id: 'p1', title: 'Tea Bar By Uruwala Tea', category: 'bus', img: 'https://anuraadvertising.lk/uploads/projects/005.jpg' },
      { id: 'p2', title: 'Vino Bus', category: 'bus', img: 'https://anuraadvertising.lk/uploads/projects/vino-1-min.png' },
      { id: 'p3', title: 'Kebab Rider', category: 'vehicle', img: 'https://anuraadvertising.lk/uploads/projects/Kebab%20rider.png' },
      { id: 'p4', title: 'Wasthi Bus', category: 'bus', img: 'https://anuraadvertising.lk/uploads/projects/wasthi-1-min.png' },
      { id: 'p5', title: 'LCB Finance', category: 'truck', img: 'https://anuraadvertising.lk/uploads/projects/lcb-finance-1-min.png' },
      { id: 'p6', title: 'Ceypecto Tank', category: 'outdoor', img: 'https://anuraadvertising.lk/uploads/projects/ceypecto-1-min.png' },
      { id: 'p7', title: 'SDB Bank Kegalla', category: 'vehicle', img: 'https://anuraadvertising.lk/uploads/projects/sdb-1-min.png' },
    ],
    testimonials: [
      { id: 't1', quote: 'Best place to get vehicles branded. They have done a neat job with the vehicle. Could not have asked for a better service.', author: 'Fleet Owner' },
      { id: 't2', quote: 'Customer service given by the employees was spot on. Every staff member was so welcoming and friendly with communication of ideas.', author: 'Corporate Client' },
      { id: 't3', quote: 'We had no idea how to brand our bus, but the team helped us with ideas and gave it a whole new outlook. Truly the best.', author: 'Bus Operator' },
      { id: 't4', quote: 'They took care of our vehicle better than we did. The bus looked better than brand new when they finished.', author: 'Transport Company' },
      { id: 't5', quote: 'We got a name board done by them — the quality was superb, the design and fonts simple and decent. Best place for name boards.', author: 'Retail Owner' },
    ],
    services: [
      { id: 's1', title: 'Bus Branding', desc: 'Transform buses into mobile billboards that capture attention across every route.' },
      { id: 's2', title: 'Truck Branding', desc: 'High-impact truck wraps that deliver your brand message on the open road.' },
      { id: 's3', title: 'Vehicle Branding', desc: 'Professional vehicle wraps and graphics for cars, vans, and fleets.' },
      { id: 's4', title: 'Outdoor Advertising', desc: 'Hoardings, billboards, and signage that dominate the landscape.' },
      { id: 's5', title: 'Indoor Advertising', desc: 'Name boards, interior graphics, and retail display solutions.' },
    ],
    stats: { years: 32, projects: 850, clients: 400, team: 30 },
    bookings: [],
    quotes: [],
    auth: { user: 'admin', pass: 'anura123' },
  };

  function load(key) {
    try {
      const raw = localStorage.getItem(KEYS[key]);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error('AnuraData load error', key, e);
      return null;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(KEYS[key], JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('AnuraData save error', key, e);
      return false;
    }
  }

  function seed() {
    Object.keys(KEYS).forEach((key) => {
      if (load(key) === null) save(key, DEFAULTS[key]);
    });
  }

  function get(key) {
    const v = load(key);
    return v !== null ? v : DEFAULTS[key];
  }

  function set(key, value) {
    return save(key, value);
  }

  function add(key, item) {
    const list = get(key);
    list.push(item);
    save(key, list);
    return item;
  }

  function update(key, id, patch) {
    const list = get(key);
    const idx = list.findIndex((x) => x.id === id || x.ref === id);
    if (idx === -1) return false;
    list[idx] = Object.assign({}, list[idx], patch);
    save(key, list);
    return list[idx];
  }

  function remove(key, id) {
    const list = get(key);
    const next = list.filter((x) => x.id !== id && x.ref !== id);
    save(key, next);
    return next;
  }

  function resetAll() {
    Object.keys(KEYS).forEach((key) => save(key, DEFAULTS[key]));
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  }

  seed();

  return { KEYS, DEFAULTS, get, set, add, update, remove, resetAll, uid, seed };
})();
