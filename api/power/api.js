import axios from "axios";

// api only has montly data from 1981 to 2020, just retreiving 2020 data by default
export default function retrieveAverageAnnualSolarRadiation({
  lattitude,
  longitude,
  startYear = 2020,
  endYear = 2020,
}) {
  const url = createUrl({ lattitude, longitude, startYear, endYear });
  return axios.get(url);
}

function createUrl({ lattitude, longitude, startYear, endYear }) {
  return `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${longitude}&latitude=${lattitude}&format=JSON&start=${startYear}&end=${endYear}`;
}

function calculateAverageAnnualSolarRadiation(data) {}
