export interface ExistingSpotsHeaderProps {
  extraColumns: string[];
}

export const ExistingSpotsHeader = ({ extraColumns }: ExistingSpotsHeaderProps) => {
  return (
    <thead>
      <tr>
        <th className={'StickyTableHeader'}>Name</th>
        <th className={'StickyTableHeader'}>Latitude</th>
        <th className={'StickyTableHeader'}>Longitude</th>
        {extraColumns.map((extraColumn) => (
          <th className={'StickyTableHeader'} key={extraColumn}>
            {extraColumn}
          </th>
        ))}
      </tr>
    </thead>
  );
};
