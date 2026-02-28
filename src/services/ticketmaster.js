const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

function getApiKey() {
  const key = import.meta.env.VITE_TICKETMASTER_API_KEY;
  if (!key) {
    throw new Error(
      "Missing VITE_TICKETMASTER_API_KEY. Add it to your .env (local) and Vercel env vars."
    );
  }
  return key;
}

function toQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  return qs.toString();
}

export async function searchEvents({ city, keyword, segment, page = 0, size = 20 }) {
  const apikey = getApiKey();

  const q = toQuery({
    apikey,
    city,
    keyword,
    segmentName: segment, // Ticketmaster uses segmentName
    page,
    size,
    sort: "date,asc",
  });

  const url = `${BASE_URL}/events.json?${q}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Ticketmaster search failed (${res.status}).`);
  }

  const data = await res.json();
  const events = data?._embedded?.events ?? [];
  const pageInfo = data?.page ?? { number: 0, totalPages: 0, totalElements: 0 };
  return { events, pageInfo };
}

export async function getEventById(id) {
  const apikey = getApiKey();
  const url = `${BASE_URL}/events/${id}.json?apikey=${apikey}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Ticketmaster event lookup failed (${res.status}).`);
  }

  return res.json();
}
