document.getElementById("nameInput").addEventListener("input", function() {
    document.getElementById("namePreview").innerText = this.value;
});

function exportPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    doc.text(document.getElementById("namePreview").innerText, 10, 10);
    doc.save("resume.pdf");
}

function exportWord() {
    const doc = new docx.Document();
    doc.addSection({
        children: [new docx.Paragraph(document.getElementById("namePreview").innerText)],
    });

    docx.Packer.toBlob(doc).then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "resume.docx";
        link.click();
    });
}
