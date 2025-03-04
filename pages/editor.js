import { useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph } from "docx";

export default function ResumeEditor() {
    const [name, setName] = useState("");

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text(name, 10, 10);
        doc.save("resume.pdf");
    };

    const exportWord = async () => {
        const doc = new Document({
            sections: [{ children: [new Paragraph(name)] }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "resume.docx");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Resume Editor</h1>
            <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px" }}
            />
            <h2>{name || "Your Name"}</h2>
            <button onClick={exportPDF}>Export as PDF</button>
            <button onClick={exportWord}>Export as Word</button>
        </div>
    );
}
