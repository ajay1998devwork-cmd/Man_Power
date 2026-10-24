ALTER TABLE "tenants" ADD COLUMN "agency_code" varchar(32);
--> statement-breakpoint
WITH numbered_tenants AS (
  SELECT
    "id",
    'AGY' || to_char("created_at", 'YYYY') || lpad(row_number() OVER (ORDER BY "created_at", "id")::text, 3, '0') AS "agency_code"
  FROM "tenants"
)
UPDATE "tenants" AS tenants
SET "agency_code" = numbered_tenants."agency_code"
FROM numbered_tenants
WHERE tenants."id" = numbered_tenants."id";
--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "agency_code" SET NOT NULL;
--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_agency_code_unique" UNIQUE("agency_code");
