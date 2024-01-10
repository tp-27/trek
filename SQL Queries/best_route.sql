SELECT
 min(r.seq) AS seq,
 e.old_id AS oid,
 e.id,
 e.sub_id,
 n.name,
 n.type,
 sum(e.cost) AS distance,
ST_Collect(e.the_geom) AS geom 
 FROM pgr_dijkstra('SELECT id, source, target, cost 
 FROM "Algonquin_Network_noded"',5124,3128,false) AS r,
 "Algonquin_Network_noded" AS e, 
 "Algonquin_Network" AS n
 WHERE r.edge=e.id AND e.old_id=n.id GROUP BY e.old_id,e.id,n.name,n.type
