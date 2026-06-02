import { useEffect, useState } from "react";
import logo from "./assets/logo.jpg";
import BatchForm from "./components/BatchForm";
import BatchList from "./components/BatchList";
import { batchService } from "./services/batchService";

function App() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
const activeCount = batches.filter((batch) => {
  return new Date(batch.expire_datetime) > new Date();
}).length;

const expiredCount = batches.filter((batch) => {
  return new Date(batch.expire_datetime) <= new Date();
}).length;
  const loadData = async () => {
    const data = await batchService.getAll();
    setBatches(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addBatch = async (batch) => {
    await batchService.create(batch);
    loadData();
  };

  const deleteBatch = async (id) => {
    await batchService.delete(id);
    loadData();
  };

  const filteredBatches = batches.filter((batch) =>
    batch.cake_name?.toLowerCase().includes(search.toLowerCase())
  );

  const total = batches.length;

  return (
    <div className="container">
      <img
        src={logo}
        alt="logo"
        className="logo-fixed"
      />

      <h1 className="title">
        🎂 Quản Lý Hạn Sử Dụng Bánh
      </h1>

      <div className="dashboard">
        <div className="stat-card">
          <h3>Tổng lô bánh</h3>
          <h2>{total}</h2>
        </div>
      </div>

      <BatchForm onAdd={addBatch} />

      <input
        className="search-box"
        type="text"
        placeholder="🔍 Tìm theo tên bánh..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <BatchList
        batches={filteredBatches}
        onDelete={deleteBatch}
      />
    </div>
  );
}

export default App;