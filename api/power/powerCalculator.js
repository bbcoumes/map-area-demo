// returns a value in kWh
// got this calculation from https://www.saurenergy.com/solar-energy-blog/here-is-how-you-can-calculate-the-annual-solar-energy-output-of-a-photovoltaic-system
import retrieveAverageAnnualSolarRadiation from "./api";

export default async function calculateNominalPower({
  lattitude,
  longitude,
  solarPanelArea = 0, //m2
  solarPanelYield = 0.156, // in %, default 15.6,
  performanceRatio = 0.75, // default .75,
}) {
  const { data } = await retrieveAverageAnnualSolarRadiation({
    lattitude,
    longitude,
  });
  if (data && data.properties && data.properties.parameter) {
    const values = data.properties.parameter.ALLSKY_SFC_SW_DWN;
    const averageAnnualSolarRadiation = getAverageSolarRadiationAtGeographicLocation(
      values
    );

    return calculateNominalPowerValue({
      solarPanelArea,
      solarPanelYield,
      performanceRatio,
      averageAnnualSolarRadiation,
    });
  }
  return 0;
}

export function calculateNominalPowerValue({
  solarPanelArea = 0,
  solarPanelYield = 0,
  performanceRatio = 0,
  averageAnnualSolarRadiation = 0,
}) {
  return (
    solarPanelArea *
    solarPanelYield *
    performanceRatio *
    averageAnnualSolarRadiation
  );
}

function getAverageSolarRadiationAtGeographicLocation(
  averageSolarRadiationsAtGeographicLocationPerMonth
) {
  const keys = Object.keys(averageSolarRadiationsAtGeographicLocationPerMonth);
  if (keys.length === 0) {
    return 0;
  }
  const sumOfAllMonthlyAverages = keys.reduce(
    (sum, currentKey) =>
      sum + averageSolarRadiationsAtGeographicLocationPerMonth[currentKey],
    0
  );
  if (sumOfAllMonthlyAverages > 0) {
    return sumOfAllMonthlyAverages / keys.length;
  }
  return 0;
}
