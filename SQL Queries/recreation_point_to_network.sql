CREATE TABLE "algonquin_point_to_routes" AS
SELECT i.ogf_id, i.type, i.name, ST_MakeLine(ST_Transform(i.geom, 4326), ST_ClosestPoint(ST_Transform(r.geom,4326), ST_Transform(i.geom, 4326))) AS geom
FROM (
	SELECT ogf_id, 'campsiteRoute' AS type, name, geom 
	FROM "Rec_point" 
	WHERE subtype = 'Designated Camping Site' 
	UNION ALL 
	SELECT ogf_id, 'accessPointRoute' AS type, NULL AS name, geom 
	FROM "Algonquin Park Access Points") AS i
INNER JOIN (
    SELECT ogf_id, ST_Collect(geom) AS geom
    FROM "algonquin_routes_intermediate"
	GROUP BY geom
) AS r ON  -- Write a portion of a postGIS query that joins on the closest point of r to each point in i
;
