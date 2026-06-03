import BatchCard from "./BatchCard";

function BatchList({
  batches,
  onDelete,
  onEdit
}) {
  return (
    <div className="batch-grid">
      {batches.map((batch) => (
        <BatchCard
          key={batch.id}
          batch={batch}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default BatchList;