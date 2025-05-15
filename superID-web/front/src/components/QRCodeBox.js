import React from "react";
import QRCode from "qrcode.react";

function QRCodeBox({ value }) {
  return (
    <div style={{ padding: "2rem", border: "1px solid #ccc" }}>
      <QRCode value={value} size={200} />
    </div>
  );
}

export default QRCodeBox;
