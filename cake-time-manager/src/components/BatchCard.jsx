function BatchCard({ batch, onDelete }) {
  const now = new Date();
  const expire = new Date(batch.expire_datetime);

  const diff = expire.getTime() - now.getTime();

  let statusColor = "green";

  if (diff <= 0) {
    statusColor = "red";
  } else if (diff < 24 * 60 * 60 * 1000) {
    statusColor = "orange";
  }

  const hoursLeft = Math.floor(
    diff / (1000 * 60 * 60)
  );

  return (
    <div className={`batch-card ${statusColor}`}>
      <div className="header">
        <h3>{batch.cake_name}</h3>
        <span>{batch.batch_code}</span>
      </div>

      <div className="info">
        <p>📦 Ngày nhận: {batch.production_date}</p>

        <p>
          ✂️ Ngày cắt:{" "}
          {new Date(batch.cut_datetime)
            .toLocaleString("vi-VN")}
        </p>
        <p>
          🍰 Số lượng:
          {" "}
          <strong>
            {batch.quantity}
          </strong>
        </p>
        <p>
          ⏰ Hạn sử dụng:{" "}
          {new Date(batch.expire_datetime)
            .toLocaleString("vi-VN")}
        </p>

        <p>
          ⌛ Còn lại:{" "}
          {diff > 0
            ? `${hoursLeft} giờ`
            : "Đã hết hạn"}
        </p>

        <p>
          👤 Nhân viên cắt:{" "}
          {batch.employee_name || "Chưa nhập"}
        </p>

        <p>
          📝 Ghi chú:{" "}
          {batch.note || "Không có"}
        </p>
      </div>

      <button
        onClick={() => onDelete(batch.id)}
      >
        Xóa
      </button>
    </div>
  );
}

export default BatchCard;