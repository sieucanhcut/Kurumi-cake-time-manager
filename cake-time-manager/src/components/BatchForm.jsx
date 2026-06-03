import { useState } from "react";

function BatchForm({ onAdd }) {
  const [cakeName, setCakeName] = useState("");
  const [receivedDate, setReceivedDate] = useState("");
  const [cutDateTime, setCutDateTime] = useState("");
  const [shelfLifeHours, setShelfLifeHours] = useState(48);
  const [employeeName, setEmployeeName] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const cakeOptions = [
    "Tiramisu",
    "Lime Spirulina",
    "Opera Cake",
    "Bounty Bar",
    "Chocolate Cheese Cake",
    "Passion Mango Cheese Cake",
    "Snicker",
    "Bánh Chuối",
    "Biscoff",
    "Dubai Chocolate",
  ];

  const formatForDB = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATE
    if (!cakeName || !receivedDate || !cutDateTime) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (shelfLifeHours <= 0) {
      alert("Hạn sử dụng phải lớn hơn 0!");
      return;
    }

    const cutDate = new Date(cutDateTime);

    const expireDate = new Date(
      cutDate.getTime() + Number(shelfLifeHours) * 60 * 60 * 1000
    );

    // ✅ batch code đẹp hơn
    const batchCode = `${cakeName
      .replace(/\s/g, "")
      .substring(0, 4)
      .toUpperCase()}-${Date.now().toString().slice(-6)}`;

    console.log("Cut:", formatForDB(cutDate));
    console.log("Expire:", formatForDB(expireDate));

    await onAdd({
      batch_code: batchCode,
      cake_name: cakeName,
      production_date: receivedDate,
      cut_datetime: formatForDB(cutDate),
      shelf_life_hours: Number(shelfLifeHours),
      expire_datetime: formatForDB(expireDate),
      employee_name: employeeName,
      note,
      status: "active",
      quantity: Number(quantity),
    });

    // reset form
    setCakeName("");
    setReceivedDate("");
    setCutDateTime("");
    setShelfLifeHours(48);
    setEmployeeName("");
    setNote("");
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={{ color: "#0f172a" }}>➕ Thêm lô bánh</h2>

      <label style={styles.label}> Loại bánh</label>
      <select
        style={styles.input}
        value={cakeName}
        onChange={(e) => setCakeName(e.target.value)}
        required
      >
        <option value="">-- Chọn loại bánh --</option>
        {cakeOptions.map((cake) => (
          <option key={cake} value={cake}>
            {cake}
          </option>
        ))}
      </select>

      <label style={styles.label}> Ngày nhận bánh</label>
      <input
        style={styles.input}
        type="date"
        value={receivedDate}
        onChange={(e) => setReceivedDate(e.target.value)}
        required
      />

      <label style={styles.label}> Ngày giờ cắt bánh</label>
      <input
        style={styles.input}
        type="datetime-local"
        value={cutDateTime}
        onChange={(e) => setCutDateTime(e.target.value)}
        required
      />
      <label> Số lượng bánh</label>

      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) =>
          setQuantity(e.target.value)
        }
        required
      />
      <label style={styles.label}> Hạn sử dụng (giờ)</label>
      <input
        style={styles.input}
        type="number"
        min="1"
        value={shelfLifeHours}
        onChange={(e) => setShelfLifeHours(Number(e.target.value))}
        required
      />

      <label style={styles.label}> Nhân viên cắt</label>
      <input
        style={styles.input}
        type="text"
        placeholder="Tên nhân viên"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
      />

      <label style={styles.label}> Ghi chú</label>
      <textarea
        style={styles.input}
        placeholder="Ghi chú..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button type="submit" style={styles.button}>
         Lưu
      </button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: 450,
    margin: "20px auto",
    padding: 20,
    background: "white",
    borderRadius: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  label: {
    display: "block",
    marginTop: 12,
    fontWeight: "bold",
    color: "#0f172a",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    marginTop: 18,
    width: "100%",
    padding: 12,
    background: "#3dd6b6",
    border: "none",
    color: "white",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default BatchForm;