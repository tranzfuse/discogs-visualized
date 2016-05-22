d3.csv('data/discogs-collection-20160521.csv', function(d) {
  return {
    artist: d.Artist,
    catalog_number: d['Catalog#'],
    collection_media_condition: d['Collection Media Condition'],
    collection_notes: d['Collection Notes'],
    collection_sleeve_condition: d['Collection Sleeve Condition'],
    collection_folder: d.CollectionFolder,
    date_added: d['Date Added'],
    format: d.Format,
    label: d.Label,
    rating: d.Rating,
   released: d.Released,
   title: d.Title,
   release_id: d.release_id
  }
}, function(data) {
  var copy = _.cloneDeep(data);
/*
  // handle type conversion in a foreach, if needed
  data.forEach(function(d) {
    d.population = +d.population;
    d["land area"] = +d["land area"];
  });
*/

  // Release count
  var releaseCount = copy.length;
  document.querySelector('.release-count').innerHTML = releaseCount;

  var nestedByYear = d3.nest()
    .key(function(d) {return d.released;})
    .entries(copy);

  var releasesByYear = nestedByYear.map(function(d) {
    return {
      year: d.key,
      releases: d.values
    };
  });
  releasesByYear.sort(function(a, b) {
    return a.year - b.year;
  });

  var nestedByLabel = d3.nest()
    .key(function(d) {return d.label;})
    .entries(copy);

  var releasesByLabel = nestedByLabel.map(function(d) {
    return {
      label: d.key,
      releases: d.values
    };
  });

  //Alphabetize labels
  var alphabetizedReleases = _.cloneDeep(releasesByLabel);
  alphabetizedReleases.sort(function(a, b) {
    return a.label > b.label ? 1 : a.label < b.label ? -1 : 0;
  });
  console.log('Releases by label', alphabetizedReleases);

  var labelsCount = d3.nest()
    .key(function(d) {return d.label;})
    .rollup(function(v){return v.length;})
    .entries(copy);

  document.querySelector('.number-labels').innerHTML = labelsCount.length;

  var maxReleasesLabel = d3.max(releasesByLabel, function(d) {
    return d.releases.length;
  });
  //console.log('Most releases for a label', maxReleasesLabel);

  var labelWithMostReleases = releasesByLabel.filter(function(d) {
    return d.releases.length === maxReleasesLabel;
  }).map(function(d) {
    return d.label;
  }).toString(); // assumes there is only 1 label with max number
  //console.log('Label with most releases', labelWithMostReleases);

  document.querySelector('.most-label').innerHTML = maxReleasesLabel + ', ' +  labelWithMostReleases;

  var releasesByFormat = d3.nest()
    .key(function(d) {return d.format;})
    .entries(copy);
  console.log(releasesByFormat);

  var minYear = d3.min(copy, function(d) {
    return d.released;
  });
  //console.log('Earliest year released', minYear);

  var maxYear = d3.max(copy, function(d) {
    return d.released;
  });
  //console.log('Latest year released', maxYear);

  var zeroYear = copy.filter(function(d) {
    return d.released === minYear;
  });
  //console.log('Releases with 0 as released year', zeroYear);

  var latestYear = copy.filter(function(d) {
    return d.released === maxYear;
  });
  //console.log('Most recent released year', latestYear);
});
