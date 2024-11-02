export interface ExistingSpotsHeaderProps {
  extraColumns: string[];
}

export const ExistingSpotsHeader = ({ extraColumns }: ExistingSpotsHeaderProps) => {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Latitude</th>
        <th>Longitude</th>
        {extraColumns.map((extraColumn) => (
          <th key={extraColumn}>{extraColumn}</th>
        ))}
      </tr>
    </thead>
  );
};
