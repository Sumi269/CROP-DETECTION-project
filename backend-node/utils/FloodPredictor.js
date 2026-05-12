function predictFloodRisk(temp, humidity, rain) {

  let score = 0;

  if (rain > 20) score += 3;
  else if (rain > 10) score += 2;

  if (humidity > 85) score += 2;
  if (temp > 35) score += 1;

  if (score >= 4) return "HIGH";
  if (score >= 2) return "MEDIUM";
  return "LOW";
}

module.exports = { predictFloodRisk };