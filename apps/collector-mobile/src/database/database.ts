import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'kabadiwala-connect.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export type LocalLot = {
  id: string;
  reference: string;
  materialId: string;
  materialName: string;
  materialIcon: string;
  weightKg: number;
  estimatedLow: number;
  estimatedHigh: number;
  notes: string;
  photoUri: string | null;
  status: 'AVAILABLE' | 'PENDING_SYNC' | 'SOLD';
  collectionDate: string;
  location: string;
  synced: number;
};

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export async function initializeDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS lots (
      id TEXT PRIMARY KEY NOT NULL,
      reference TEXT NOT NULL UNIQUE,
      material_id TEXT NOT NULL,
      material_name TEXT NOT NULL,
      material_icon TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      estimated_low REAL NOT NULL,
      estimated_high REAL NOT NULL,
      notes TEXT DEFAULT '',
      photo_uri TEXT,
      status TEXT NOT NULL DEFAULT 'PENDING_SYNC',
      collection_date TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT 'Location unavailable',
      synced INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_lots_created_at
    ON lots(created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_lots_status
    ON lots(status);
  `);
}

export async function createLot(
  lot: LocalLot,
) {
  const db = await getDatabase();

  await db.runAsync(
    `
      INSERT INTO lots (
        id,
        reference,
        material_id,
        material_name,
        material_icon,
        weight_kg,
        estimated_low,
        estimated_high,
        notes,
        photo_uri,
        status,
        collection_date,
        location,
        synced,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      lot.id,
      lot.reference,
      lot.materialId,
      lot.materialName,
      lot.materialIcon,
      lot.weightKg,
      lot.estimatedLow,
      lot.estimatedHigh,
      lot.notes,
      lot.photoUri,
      lot.status,
      lot.collectionDate,
      lot.location,
      lot.synced,
      new Date().toISOString(),
    ],
  );
}

export async function getLots(): Promise<LocalLot[]> {
  const db = await getDatabase();

  return db.getAllAsync<LocalLot>(
    `
      SELECT
        id,
        reference,
        material_id AS materialId,
        material_name AS materialName,
        material_icon AS materialIcon,
        weight_kg AS weightKg,
        estimated_low AS estimatedLow,
        estimated_high AS estimatedHigh,
        notes,
        photo_uri AS photoUri,
        status,
        collection_date AS collectionDate,
        location,
        synced
      FROM lots
      ORDER BY created_at DESC
    `,
  );
}

export async function getLotById(
  id: string,
): Promise<LocalLot | null> {
  const db = await getDatabase();

  return db.getFirstAsync<LocalLot>(
    `
      SELECT
        id,
        reference,
        material_id AS materialId,
        material_name AS materialName,
        material_icon AS materialIcon,
        weight_kg AS weightKg,
        estimated_low AS estimatedLow,
        estimated_high AS estimatedHigh,
        notes,
        photo_uri AS photoUri,
        status,
        collection_date AS collectionDate,
        location,
        synced
      FROM lots
      WHERE id = ?
      LIMIT 1
    `,
    id,
  );
}