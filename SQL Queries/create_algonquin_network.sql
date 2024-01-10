-- Step 1. combine portage routes, canoe routes, and lake mesh

DROP TABLE IF EXISTS "algonquin_routes_intermediate";
CREATE TABLE "algonquin_routes_intermediate" AS
SELECT
	ogf_id,
	name,
	type,
	ST_Multi(geom) AS geom
FROM (
	SELECT ogf_id, name, ST_Transform(geom, 4326) AS geom, 'canoeRoute' AS type 
	FROM "Algonquin Park Trails - Segmented"
	WHERE name = 'Canoe Route'
	UNION ALL
	SELECT ogf_id, name, ST_Transform(geom, 4326) AS geom, 'portageRoute' AS type 
	FROM "Algonquin Park Trails - Segmented"
	WHERE name != 'Canoe Route'
	UNION ALL
	SELECT ogf_id, official_n AS name, ST_Transform(st_approximatemedialaxis, 4326) AS geom, 'LakeRoute' AS type
	FROM "lake_mesh"
) AS "algonquin_routes";

DO $$ 
BEGIN
  RAISE NOTICE 'Created Algonquin Routes';
END $$;

-- Step 2. make lines from campsites and access points to the combined routes
DROP TABLE IF EXISTS "algonquin_point_to_routes";
CREATE TABLE "algonquin_point_to_routes" AS
SELECT 
    i.ogf_id, 
    i.type, 
    i.name, 
    ST_MakeLine(ST_Transform(i.geom, 4326), ST_ClosestPoint(ST_Transform(r.geom, 4326), ST_Transform(i.geom, 4326))) AS geom
FROM 
    (
        SELECT "OGF_ID" AS ogf_id, 'campsiteRoute' AS type, "NAME" AS name, geom 
        FROM "Rec_point" 
        WHERE "SUBTYPE" = 'Designated Camping Site' 
        UNION ALL 
        SELECT ogf_id, 'accessPointRoute' AS type, NULL AS name, geom 
        FROM "Algonquin Park Access Points"
    ) AS i
LEFT JOIN LATERAL (
    SELECT ogf_id, ST_ClosestPoint(ST_Transform(r.geom, 4326), ST_Transform(i.geom, 4326)) AS geom
    FROM "algonquin_routes_intermediate" r  -- Explicitly mention the table alias "r" in the FROM clause
    ORDER BY ST_Distance(ST_Transform(i.geom, 4326), ST_Transform(r.geom, 4326))
    LIMIT 1
) AS r ON true;

DO $$ 
BEGIN
  RAISE NOTICE 'Created Recreation Point Routes';
END $$;


-- Step 3. Combine tables, dump geometries to split multilines into segments.

DROP TABLE IF EXISTS "Algonquin_Network";
CREATE TABLE "Algonquin_Network" AS
WITH arint AS (
	SELECT
		ogf_id,
		name,
		type,
		ST_LineMerge(geom) AS the_geom
	FROM (
		SELECT ogf_id, name, geom, type 
		FROM "algonquin_routes_intermediate"
		UNION ALL
		SELECT ogf_id, name, geom, type 
		FROM "algonquin_point_to_routes"
	) AS "algonquin_routes"
	WHERE geom IS NOT NULL
), 
combined AS (
	SELECT * 
	FROM arint
	WHERE ST_GeometryType(the_geom) != 'ST_MultiLineString'
	UNION ALL
	SELECT ogf_id, name, type, (ST_Dump(the_geom)).geom AS the_geom
	FROM arint
	WHERE ST_GeometryType(the_geom) = 'ST_MultiLineString'
)
SELECT ROW_NUMBER() OVER () AS id, *
FROM combined
WHERE the_geom IS NOT NULL AND NOT ST_IsEmpty(the_geom);


DO $$ 
BEGIN
  RAISE NOTICE 'Created Combined Algonquin Routes Network';
END $$;

-- Step 4. Create pgr_nodeNetwork

DROP TABLE IF EXISTS "Algonquin_Network_noded" CASCADE;
SELECT pgr_nodeNetwork('Algonquin_Network', 0.00001);

-- Step 5. Combine attribute data with noded table
-- Step 6. Calculate Costs
-- NOTE: once Step 5 implemented, the cost calculation can be modified to calculate based on attribute

DO $$ 
BEGIN
  RAISE NOTICE 'Created noded table';
END $$;

ALTER TABLE "Algonquin_Network_noded"
ADD cost NUMERIC GENERATED ALWAYS AS (
	10000*ST_Length(the_geom)
) STORED;

DO $$ 
BEGIN
  RAISE NOTICE 'Calculated costs for noded table';
END $$;

-- Step 7. create pgr_createTopology

SELECT pgr_createTopology('Algonquin_Network_noded', 0.00001, 'the_geom','id','source','target',clean:=TRUE);

-- Step 8. run pgr_analyzeGraph to check output

SELECT pgr_analyzeGraph('Algonquin_Network_noded', 0.00001);

DO $$ 
BEGIN
  RAISE NOTICE 'NETWORK TOPOLOGY CREATED SUCCESSFULLY!';
END $$;