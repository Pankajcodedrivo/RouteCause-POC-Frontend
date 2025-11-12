import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toast/toast";
import { sendEmail } from "../service/api.service";

interface EmailPopupProps {
  onClose: () => void;
  data: any; // you can type this as ResultData if needed
}

const EmailPopup: React.FC<EmailPopupProps> = ({ onClose, data }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendEmail = async () => {
    if (!email) {
      showErrorToast("Please enter an email address.");
      return;
    }
    if (!validateEmail(email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      const res = await sendEmail({ email, data });
      if (res.success) {
        showSuccessToast("Email sent successfully!");
        onClose();
      } else {
        showErrorToast("Failed to send email. Try again later.");
      }
    } catch (err) {
      console.error("Email send error:", err);
      showErrorToast("Error sending email. Check server logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Send Report via Email</h4>
        <input
          type="email"
          className="form-control mb-20"
          placeholder="Enter recipient email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="popup-actions">
          <button
            className="btn btn-primary"
            onClick={handleSendEmail}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;