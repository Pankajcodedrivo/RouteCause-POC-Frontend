import React, { useState } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toast/toast";
import { sendEmail } from "../service/api.service";

interface EmailPopupProps {
  onClose: () => void;
  report_id: string;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ onClose, report_id }) => {
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
      const emailData = {
        recipient_emails: [email],
        subject:  `Root Cause Analysis Report - ${report_id}`,
        message:  `Please find attached the Root Cause Analysis Report.\n\nReport ID: ${report_id}\n\nBest regards,\nAIQE System`,
      };

      const res = await sendEmail(report_id, emailData);
      
      if (res.status==="sent") {
        showSuccessToast("Email sent successfully!");
        onClose();
      } else {
        showErrorToast(res.message || "Failed to send email. Try again later.");
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
        
        <div className="form-group mb-20">
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sending}
          />
        </div>
        

        <div className="popup-actions">
          <button
            className="btn btn-primary"
            onClick={handleSendEmail}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={sending}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPopup;