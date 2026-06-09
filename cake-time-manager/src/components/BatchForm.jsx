import { useEffect, useState } from "react";

function BatchForm({
  onAdd,
  onUpdate,
  editingBatch,
  setEditingBatch,
}) {
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
    "Caramel chocolate cake",
  ];

  useEffect(() => {
    if (!editingBatch) return;

    setCakeName(
      editingBatch.cake_name || ""
    );

    setReceivedDate(
      editingBatch.production_date || ""
    );

    setCutDateTime(
      editingBatch.cut_datetime?.slice(
        0,
        16
      ) || ""
    );

    setShelfLifeHours(
      editingBatch.shelf_life_hours || 48
    );

    setEmployeeName(
      editingBatch.employee_name || ""
    );

    setNote(
      editingBatch.note || ""
    );

    setQuantity(
      editingBatch.quantity || 1
    );
  }, [editingBatch]);

  const formatForDB = (date) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
      date.getSeconds()
    ).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const resetForm = () => {
    setCakeName("");
    setReceivedDate("");
    setCutDateTime("");
    setShelfLifeHours(48);
    setEmployeeName("");
    setNote("");
    setQuantity(1);
    setEditingBatch?.(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !cakeName ||
      !receivedDate ||
      !cutDateTime
    ) {
      alert(
        "Vui lòng nhập đầy đủ thông tin!"
      );
      return;
    }

    if (shelfLifeHours <= 0) {
      alert(
        "Hạn sử dụng phải lớn hơn 0!"
      );
      return;
    }

    const cutDate =
      new Date(cutDateTime);

    const expireDate = new Date(
      cutDate.getTime() +
        Number(
          shelfLifeHours
        ) *
          60 *
          60 *
          1000
    );

    const payload = {
      cake_name: cakeName,
      production_date:
        receivedDate,
      cut_datetime:
        formatForDB(cutDate),
      shelf_life_hours:
        Number(
          shelfLifeHours
        ),
      expire_datetime:
        formatForDB(
          expireDate
        ),
      employee_name:
        employeeName,
      note,
      quantity:
        Number(quantity),
      status: "active",
    };

    if (editingBatch) {
      await onUpdate(
        editingBatch.id,
        payload
      );

      alert(
        "Đã cập nhật lô bánh!"
      );
    } else {
      const batchCode = `${cakeName
        .replace(/\s/g, "")
        .substring(0, 4)
        .toUpperCase()}-${Date.now()
        .toString()
        .slice(-6)}`;

      await onAdd({
        batch_code:
          batchCode,
        ...payload,
      });

      alert(
        "Đã thêm lô bánh!"
      );
    }

    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={styles.form}
    >
      <h2
        style={{
          color: "#0f172a",
        }}
      >
        {editingBatch
          ? "✏️ Chỉnh sửa lô bánh"
          : "➕ Thêm lô bánh"}
      </h2>

      <label style={styles.label}>
        Loại bánh
      </label>

      <select
        style={styles.input}
        value={cakeName}
        onChange={(e) =>
          setCakeName(
            e.target.value
          )
        }
        required
      >
        <option value="">
          -- Chọn loại bánh --
        </option>

        {cakeOptions.map(
          (cake) => (
            <option
              key={cake}
              value={cake}
            >
              {cake}
            </option>
          )
        )}
      </select>

      <label style={styles.label}>
        Ngày nhận bánh
      </label>

      <input
        style={styles.input}
        type="date"
        value={receivedDate}
        onChange={(e) =>
          setReceivedDate(
            e.target.value
          )
        }
        required
      />

      <label style={styles.label}>
        Ngày giờ cắt bánh
      </label>

      <input
        style={styles.input}
        type="datetime-local"
        value={cutDateTime}
        onChange={(e) =>
          setCutDateTime(
            e.target.value
          )
        }
        required
      />

      <label style={styles.label}>
        Số lượng bánh
      </label>

      <input
        style={styles.input}
        type="number"
        min="1"
        value={quantity}
        onChange={(e) =>
          setQuantity(
            e.target.value
          )
        }
        required
      />

      <label style={styles.label}>
        Hạn sử dụng (giờ)
      </label>

      <input
        style={styles.input}
        type="number"
        min="1"
        value={shelfLifeHours}
        onChange={(e) =>
          setShelfLifeHours(
            Number(
              e.target.value
            )
          )
        }
        required
      />

      <label style={styles.label}>
        Nhân viên cắt
      </label>

      <input
        style={styles.input}
        type="text"
        value={employeeName}
        onChange={(e) =>
          setEmployeeName(
            e.target.value
          )
        }
      />

      <label style={styles.label}>
        Ghi chú
      </label>

      <textarea
        style={styles.input}
        value={note}
        onChange={(e) =>
          setNote(
            e.target.value
          )
        }
      />

      <button
        type="submit"
        style={styles.button}
      >
        {editingBatch
          ? "💾 Cập nhật"
          : "➕ Lưu"}
      </button>

      {editingBatch && (
        <button
          type="button"
          style={{
            ...styles.button,
            background:
              "#64748b",
            marginTop: 10,
          }}
          onClick={
            resetForm
          }
        >
          ❌ Hủy sửa
        </button>
      )}
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
    boxShadow:
      "0 4px 20px rgba(0,0,0,0.08)",
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
    border:
      "1px solid #ccc",
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