import { useEffect, useState } from "react";
import logo from "./assets/logo.jpg";
import BatchForm from "./components/BatchForm";
import BatchList from "./components/BatchList";
import { batchService } from "./services/batchService";
import { supabase } from "./lib/supabase";

function App() {
  const [batches, setBatches] = useState([]);
  const [search, setSearch] = useState("");
  const [cakeFilter, setCakeFilter] = useState("Tất cả");
  const [receivedFilter, setReceivedFilter] = useState("");
  const [cutFilter, setCutFilter] = useState("");
  const [editingBatch, setEditingBatch] = useState(null);
  const [scheduleImage, setScheduleImage] = useState("");
const [showSchedule, setShowSchedule] = useState(true);
const [rotation, setRotation] = useState(0);
const [showImageModal, setShowImageModal] = useState(false);
  const loadData = async () => {
    const data = await batchService.getAll();
    setBatches(data);
  };

  const loadScheduleImage = async () => {
    const { data, error } = await supabase
      .from("weekly_schedule")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data?.image_url) {
      setScheduleImage(data.image_url);
    }
  };

  useEffect(() => {
    loadData();
    loadScheduleImage();
  }, []);

  const addBatch = async (batch) => {
    await batchService.create(batch);
    loadData();
  };

  const updateBatch = async (id, batch) => {
    await batchService.update(id, batch);
    setEditingBatch(null);
    loadData();
  };

  const deleteBatch = async (id) => {
    await batchService.delete(id);
    loadData();
  };

  const uploadScheduleImage = async (file) => {
    try {
      const fileName = `schedule-${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("schedule_images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true,
          });

      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("schedule_images")
        .getPublicUrl(fileName);

      const imageUrl = data.publicUrl;

      const { error: dbError } =
        await supabase
          .from("weekly_schedule")
          .update({
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", 1);

      if (dbError) {
        alert(dbError.message);
        return;
      }

      setScheduleImage(imageUrl);
      alert("Đã cập nhật lịch làm!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi upload ảnh.");
    }
  };

  const now = new Date();

  const warningCount = batches.filter((b) => {
    const diff = new Date(b.expire_datetime) - now;

    return (
      diff > 0 &&
      diff <= 24 * 60 * 60 * 1000
    );
  }).length;

  const expiredCount = batches.filter(
    (b) => new Date(b.expire_datetime) <= now
  ).length;

  const cakeTypeCount = new Set(
    batches
      .map((b) => b.cake_name)
      .filter(Boolean)
  ).size;

  const cakeTypes = [
    "Tất cả",
    ...new Set(
      batches
        .map((b) => b.cake_name)
        .filter(Boolean)
    ),
  ];

  const cakeSummary = {};

  batches.forEach((batch) => {
    cakeSummary[batch.cake_name] =
      (cakeSummary[batch.cake_name] || 0) +
      (batch.quantity || 0);
  });

  const filteredBatches = batches.filter((batch) => {
    const matchSearch =
      batch.cake_name
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchCake =
      cakeFilter === "Tất cả" ||
      batch.cake_name === cakeFilter;

    const matchReceived =
      !receivedFilter ||
      batch.production_date === receivedFilter;

    const cutDate =
      batch.cut_datetime?.split("T")[0];

    const matchCut =
      !cutFilter ||
      cutDate === cutFilter;

    return (
      matchSearch &&
      matchCake &&
      matchReceived &&
      matchCut
    );
  });

  return (
    <div className="container">
      <img
        src={logo}
        alt="logo"
        className="logo-fixed"
      />

<div className="stat-card">
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
    }}
    onClick={() =>
      setShowSchedule(!showSchedule)
    }
  >
    <h3>📅 Lịch làm tuần này</h3>

    <span
      style={{
        fontSize: "24px",
        transition: "0.3s",
        transform: showSchedule
          ? "rotate(180deg)"
          : "rotate(0deg)",
      }}
    >
      ▼
    </span>
  </div>

  <div
    style={{
      maxHeight: showSchedule
        ? "1000px"
        : "0px",
      overflow: "hidden",
      transition:
        "max-height 0.4s ease",
    }}
  >
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file =
          e.target.files?.[0];

        if (file) {
          uploadScheduleImage(file);
        }
      }}
      style={{
        marginTop: "10px",
      }}
    />
<button
  onClick={() =>
    setRotation((prev) => (prev + 90) % 360)
  }
  style={{
    marginTop: "10px",
    padding: "8px 12px",
  }}
>
  🔄 Xoay ảnh
</button>
 {scheduleImage && (
  <div
    style={{
      textAlign: "center",
      marginTop: "10px",
    }}
  >
    <img
      src={scheduleImage}
      alt="Lịch làm"
      onClick={() => setShowImageModal(true)}
      style={{
        width: "300px",
        maxWidth: "100%",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    />

    <p
      style={{
        fontSize: "12px",
        color: "#666",
      }}
    >
      Nhấn vào ảnh để phóng to
    </p>
  </div>
)}
  </div>
</div>

      <div className="dashboard">
        <div className="stat-card">
          <h3>📦 Tổng lô</h3>
          <h2>{batches.length}</h2>
        </div>

        <div className="stat-card">
          <h3>🎂 Loại bánh</h3>
          <h2>{cakeTypeCount}</h2>
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

      <div className="stat-card">
        <h3>📊 Tồn kho theo loại</h3>

        {Object.entries(cakeSummary).map(
          ([cake, qty]) => (
            <p key={cake}>
              {cake}: <strong>{qty}</strong>
            </p>
          )
        )}
      </div>

      <BatchForm
        onAdd={addBatch}
        editingBatch={editingBatch}
        onUpdate={updateBatch}
      />

      <div
        style={{
          display: "grid",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <label>Loại bánh</label>

        <select
          value={cakeFilter}
          onChange={(e) =>
            setCakeFilter(e.target.value)
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

        <label>Ngày nhận bánh</label>

        <input
          type="date"
          value={receivedFilter}
          onChange={(e) =>
            setReceivedFilter(e.target.value)
          }
        />

        <label>Ngày cắt bánh</label>

        <input
          type="date"
          value={cutFilter}
          onChange={(e) =>
            setCutFilter(e.target.value)
          }
        />

        <input
          className="search-box"
          type="text"
          placeholder="🔍 Tìm theo tên bánh..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <button
          onClick={() => {
            setSearch("");
            setCakeFilter("Tất cả");
            setReceivedFilter("");
            setCutFilter("");
          }}
        >
          🔄 Xóa bộ lọc
        </button>
      </div>

      <BatchList
        batches={filteredBatches}
        onDelete={deleteBatch}
        onEdit={setEditingBatch}
      />
{
  showImageModal && (
    <div
      onClick={() => setShowImageModal(false)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thanh công cụ */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px",
          gap: "10px",
        }}
      >
        <button
          onClick={() =>
            setRotation((prev) => (prev + 90) % 360)
          }
        >
          🔄 Xoay
        </button>

        <button
          onClick={() => setShowImageModal(false)}
        >
          ✖ Đóng
        </button>
      </div>

      {/* Ảnh */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <img
          src={scheduleImage}
          alt="Lịch làm"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `rotate(${rotation}deg)`,
            transition: "transform .3s",
          }}
        />
      </div>
    </div>
  )
}
    </div>
  );
}

export default App; 