import { MAX_PAGE_SIZE } from './constants';

// The API returns plain arrays without totals. To know whether another page
// exists we request one extra row and trim it off.
export function sliceWithNext(rows, pageSize) {
  return { items: rows.slice(0, pageSize), hasNext: rows.length > pageSize };
}

// Collects every page of a skip/limit endpoint.
export async function fetchAllPages(fetchPage) {
  const all = [];
  for (let skip = 0; ; skip += MAX_PAGE_SIZE) {
    const rows = await fetchPage({ skip, limit: MAX_PAGE_SIZE });
    all.push(...rows);
    if (rows.length < MAX_PAGE_SIZE) return all;
  }
}
