import { calculateNominalPowerValue } from "../api/power/powerCalculator";

describe("powerCalculator", () => {
  describe("calculateNominalPowerValue", () => {
    it("should return 0 if any of the parameters are not populated", () => {
      expect(calculateNominalPowerValue({})).toBe(0);
    });

    it("should return correct value for parameters provided", () => {
      expect(
        calculateNominalPowerValue({
          solarPanelArea: 4,
          solarPanelYield: 4,
          performanceRatio: 4,
          averageAnnualSolarRadiation: 4,
          q,
        })
      ).toBe(4 * 4 * 4 * 4);
    });
  });
});
