import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toast/toast";
import { sendFeedback } from "../service/api.service";

interface FeedbackPopupProps {
  onClose: () => void;
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendFeedback = async () => {
    if (!message.trim()) {
      showErrorToast("Please enter feedback before sending.");
      return;
    }

    setSending(true);

    try {
      const res = await sendFeedback({ feedback: message });

      if (res.success) {
        showSuccessToast("Feedback sent successfully!");
        onClose();
      } else {
        showErrorToast("Failed to send feedback. Try again later.");
      }
    } catch (err) {
      console.error("Feedback send error:", err);
      showErrorToast("Error sending feedback. Check server logs.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <h4>Feedback</h4>

        <textarea
          className="form-control mb-20"
          placeholder="Enter your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />

        <div className="popup-actions">
          <button
            className="btn btn-primary"
            onClick={handleSendFeedback}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Feedback"}
          </button>

          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
