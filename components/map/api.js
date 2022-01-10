import axios from "axios";
export default async function retrieveAverageAnnualSolarRadiation({
  lattitude,
  longitude,
  solarPanelArea,
}) {
  try {
    const result = await axios.get(
      `/api/nominalSolarPower?lattitude=${lattitude}&longitude=${longitude}&solarPanelArea=${solarPanelArea}`
    );
    return result.data.nominalSolarPower;
  } catch (e) {
    console.error({ e });
    return 0;
  }
}
