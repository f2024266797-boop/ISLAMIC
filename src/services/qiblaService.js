/**
 * Production-grade Qibla Calculation Service
 */
export const qiblaService = {
  /**
   * Calculates the angle to the Kaaba from a given location
   * Returns angle in degrees from North
   */
  calculateQibla: (latitude, longitude) => {
    const KAABA_LAT = 21.422487;
    const KAABA_LON = 39.826206;

    const phiK = (KAABA_LAT * Math.PI) / 180.0;
    const lambdaK = (KAABA_LON * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;

    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );

    return (psi + 360) % 360;
  }
};
