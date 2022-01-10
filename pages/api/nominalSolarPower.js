import { calculateNominalPower } from "../../api/power";
export default async function handler(req, res) {
  const {
    query: { lattitude, longitude, solarPanelArea },
  } = req;

  try {
    const result = await calculateNominalPower({
      lattitude,
      longitude,
      solarPanelArea,
    });
    res.status(200).json({ nominalSolarPower: result });
  } catch (e) {
    res.status(400);
  }
}
