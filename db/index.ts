import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://neondb_owner:ydTixbZF7c2E@ep-holy-sunset-a1os0afh.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema });
