const CHENNAI_BOUNDS = { north: 13.23, south: 12.82, east: 80.34, west: 79.97 };

function isInChennai({ lat, lng }) {
  return (
    lat >= CHENNAI_BOUNDS.south &&
    lat <= CHENNAI_BOUNDS.north &&
    lng >= CHENNAI_BOUNDS.west &&
    lng <= CHENNAI_BOUNDS.east
  );
}

module.exports = { isInChennai, CHENNAI_BOUNDS };
