FILENAME="germany-latest.osm.pbf"
#rm ./$FILENAME
DBNAME="sonntags_location_data"
dropdb $DBNAME
createdb $DBNAME
psql -d $DBNAME -c 'CREATE EXTENSION postgis; CREATE EXTENSION hstore;'
#wget "https://download.geofabrik.de/europe/germany/$FILENAME"
osm2pgsql --latlong -c -d $DBNAME --slim --style default.style -C 10240 --flat-nodes ./flat-nodes ./$FILENAME
psql -d $DBNAME -c "create table sunday_open as
                select *
                from planet_osm_point where opening_hours LIKE '%Su%' AND opening_hours NOT LIKE '%ff'
                and shop is not null
                and name is not null;"
#workon sonntags
#python ./pg_import.py