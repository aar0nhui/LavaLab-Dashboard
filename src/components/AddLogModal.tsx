import React, { useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { FIELDS } from "../data/fields";
import { useAuth } from "../lib/auth";

export default function AddLogModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { profile } = useAuth();
  
  const [employeeName, setEmployeeName] = useState(profile?.role === "employee" ? profile.full_name : "");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [field, setField] = useState("FIELD A");
  const [timeStart, setTimeStart] = useState("8:00 AM");
  const [timeEnd, setTimeEnd] = useState("12:00 PM");
  const [summary, setSummary] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !activity || !date || !field || !timeStart || !timeEnd) {
      setError("Please fill in all required fields.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      let audioPath = null;
      if (audioFile) {
        const fileExt = audioFile.name.split(".").pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from("recordings").upload(filePath, audioFile);
        if (uploadError) throw uploadError;
        audioPath = filePath;
      }

      const selectedField = FIELDS[field];
      const lat = selectedField ? selectedField.center.lat : 0;
      const lng = selectedField ? selectedField.center.lng : 0;

      const parsedTags = tagsInput
        .split(",")
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const { error: insertError } = await supabase.from("logs").insert({
        id: "log-" + Math.random().toString(36).substr(2, 9),
        employee_name: employeeName,
        activity,
        date,
        field,
        time_start: timeStart,
        time_end: timeEnd,
        lat,
        lng,
        summary,
        tags: parsedTags,
        audio_path: audioPath,
        read: false
      });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add log.");
      setUploading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "28px", borderRadius: "16px", width: "100%", maxWidth: "500px", fontFamily: "var(--font-body)", maxHeight: "90vh", overflowY: "auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", margin: "0 0 20px 0" }}>Add Activity Log</h2>
        
        {error && <div style={{ color: "red", fontSize: "0.85rem", marginBottom: "16px" }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Employee Name</label>
            <input 
              type="text" 
              value={employeeName} 
              onChange={e => setEmployeeName(e.target.value)}
              disabled={profile?.role === "employee"}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5", background: profile?.role === "employee" ? "#f9f9f9" : "#fff" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Activity</label>
            <input 
              type="text" 
              placeholder="e.g. Spraying, Planting..."
              value={activity} 
              onChange={e => setActivity(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Field</label>
              <select 
                value={field} 
                onChange={e => setField(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5", background: "#fff" }}
              >
                {Object.keys(FIELDS).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Start Time</label>
              <input 
                type="text" 
                placeholder="e.g. 8:00 AM"
                value={timeStart} 
                onChange={e => setTimeStart(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>End Time</label>
              <input 
                type="text" 
                placeholder="e.g. 12:00 PM"
                value={timeEnd} 
                onChange={e => setTimeEnd(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Summary (Optional)</label>
            <textarea 
              value={summary} 
              onChange={e => setSummary(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Tags (Comma-separated)</label>
            <input 
              type="text"
              placeholder="e.g. equipment, repair, fertilizer"
              value={tagsInput} 
              onChange={e => setTagsInput(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e5e5e5" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, marginBottom: "6px" }}>Audio File (Optional)</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files?.[0] || null)}
              style={{ width: "100%", fontSize: "0.8rem" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
            <button 
              type="button" 
              onClick={onClose}
              disabled={uploading}
              style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #e5e5e5", background: "#fff", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 500 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={uploading}
              style={{ padding: "10px 16px", borderRadius: "8px", border: "none", background: "#111", color: "#fff", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 500 }}
            >
              {uploading ? "Saving..." : "Save Log"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
