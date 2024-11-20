export enum ForecastType {
  Hourly = 'Hourly',
  Image = 'Image',
  Short = 'Short',
  Long = 'Long',
}

interface ForecastTypeSelectorProps {
  forecastType: ForecastType;
  setForecastType: (forecastType: ForecastType) => void;
}

export const ForecastTypeSelector = ({
  forecastType,
  setForecastType,
}: ForecastTypeSelectorProps) => {
  return (
    <select
      onChange={(e) => setForecastType(ForecastType[e.target.value as keyof typeof ForecastType])}
      value={forecastType}
    >
      {Object.keys(ForecastType)
        .filter((ft) => isNaN(Number(ft)))
        .map((ft) => (
          <option value={ForecastType[ft as keyof typeof ForecastType]} key={ft}>
            {ft}
          </option>
        ))}
    </select>
  );
};
