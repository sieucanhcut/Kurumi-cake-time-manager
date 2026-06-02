import { useEffect, useState } from "react";
import logo from "./assets/logo.jpg";
import BatchForm from "./components/BatchForm";
import BatchList from "./components/BatchList";
import { batchService } from "./services/batchService";

function App() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [cakeFilter, setCakeFilter] =
    useState("Tất cả");

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

  const now = new Date();

  const activeCount = batches.filter(
    (b) =>
      new Date(b.expire_datetime) > now
  ).length;

  const warningCount = batches.filter(
    (b) => {
      const diff =
        new Date(b.expire_datetime) -
        now;

      return (
        diff > 0 &&
        diff <=
          24 * 60 * 60 * 1000
      );
    }
  ).length;

  const expiredCount = batches.filter(
    (b) =>
      new Date(b.expire_datetime) <= now
  ).length;

  const cakeTypes = [
    "Tất cả",
    ...new Set(
      batches
        .map((b) => b.cake_name)
        .filter(Boolean)
    ),
  ];
const totalQuantity =
  batches.reduce(
    (sum, batch) =>
      sum + (batch.quantity || 0),
    0
  );
  const filteredBatches =
    batches.filter((batch) => {
      const matchSearch =
        batch.cake_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchCake =
        cakeFilter === "Tất cả" ||
        batch.cake_name === cakeFilter;

      return (
        matchSearch && matchCake
      );
    });

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
          <h3>📦 Tổng lô</h3>
<h2>{totalQuantity}</h2>        </div>

        <div className="stat-card">
          <h3>🟢 Còn hạn</h3>
          <h2>{activeCount}</h2>
        </div>

        <div className="stat-card warning">
          <h3>🟠 Sắp hết hạn</h3>
          <h2>{warningCount}</h2>
        </div>

        <div className="stat-card danger">
          <h3>🔴 Hết hạn</h3>
          <h2>{expiredCount}</h2>
        </div>
      </div>

      <BatchForm onAdd={addBatch} />

      <select
        value={cakeFilter}
        onChange={(e) =>
          setCakeFilter(
            e.target.value
          )
        }
      >
        {cakeTypes.map((cake) => (
          <option
            key={cake}
            value={cake}
          >
            {cake}
          </option>
        ))}
      </select>

      <input
        className="search-box"
        type="text"
        placeholder="🔍 Tìm theo tên bánh..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <BatchList
        batches={filteredBatches}
        onDelete={deleteBatch}
      />
    </div>
  );
}

export default App;