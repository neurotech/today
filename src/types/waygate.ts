// id INTEGER PRIMARY KEY AUTOINCREMENT,
// item TEXT NOT NULL,
// title TEXT NOT NULL,
// favicon_data BLOB,
// favicon_type TEXT,
// createdAt TEXT NOT NULL DEFAULT (datetime('now'))

export type WaygateItemResponse = {
  id: number;
  item: string;
  title: string;
  favicon: string | null;
  createdAt: string;
};
