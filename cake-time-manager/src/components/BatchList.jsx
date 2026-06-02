import BatchCard from "./BatchCard";

function BatchList({
  batches,
  onDelete
}) {
  return (
  <div className="batch-grid">
  {batches.map((batch) => (
    <BatchCard
      key={batch.id}
      batch={batch}
      onDelete={onDelete}
    />
  ))}
</div>
  );
}

export default BatchList;