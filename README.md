# Mongoose and Elasticsearch geospatial searches


### Run the dockers

```
$> fig up
```


### Load & index data 

```
$> node loader.js --empty --messages 100 && node indexer.js --truncate
```

### Check data in Kibana

Open http://localhost:8080/ in a browser to see Elasticsearch data in Kibana. Use `messages` index and add a simple table.

### Search with Mongoose

There is a simple script to search data from a CLI: 

```
$> node search.js
```

### Search in POSTMAN

Send a POST request to `http://localhost:9200/messages/message/_search` with data from any `query*.json` files included 

