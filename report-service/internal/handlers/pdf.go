package handlers

import (
	"bytes"
	"fmt"
	"net/http"
	"time"

	"github.com/AGhostp0wn/Sistema-Inteligencia-Amenazas/report-service/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

func GeneratePDFReport(c *gin.Context) {
	var req models.ReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Body inválido: %s", err.Error())})
		return
	}

	pdf := buildPDF(req)

	var buf bytes.Buffer
	if err := pdf.Output(&buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error generando PDF"})
		return
	}

	filename := fmt.Sprintf("threatguard-report-%s.pdf", time.Now().Format("20060102-150405"))
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}

func buildPDF(req models.ReportRequest) *gofpdf.Fpdf {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	// ── Header ──────────────────────────────────────────────
	pdf.SetFillColor(15, 23, 42) // azul oscuro tipo SOC
	pdf.Rect(0, 0, 210, 25, "F")
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Helvetica", "B", 16)
	pdf.CellFormat(0, 15, "ThreatGuard AI — IOC Report", "", 1, "C", false, 0, "")
	pdf.SetFont("Helvetica", "", 9)
	pdf.CellFormat(0, 8, fmt.Sprintf("Generated: %s", time.Now().UTC().Format(time.RFC1123)), "", 1, "C", false, 0, "")

	pdf.Ln(8)

	// ── Sección: resumen ─────────────────────────────────────
	pdf.SetTextColor(0, 0, 0)
	sectionHeader(pdf, "IOC Summary")

	td := req.ThreatData
	infoRow(pdf, "IOC Type", td.IOCType)
	infoRow(pdf, "IOC Value", td.IOCValue)
	infoRow(pdf, "Analyst", req.AnalystName)
	infoRow(pdf, "From Cache", fmt.Sprintf("%v", td.FromCache))

	pdf.Ln(4)

	// ── Risk Score ───────────────────────────────────────────
	sectionHeader(pdf, "Risk Assessment")

	r, g, b := classificationColor(td.Classification)
	pdf.SetFillColor(r, g, b)
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Helvetica", "B", 14)
	pdf.CellFormat(60, 12,
		fmt.Sprintf("Score: %d / 100  [%s]", td.RiskScore, td.Classification),
		"", 1, "C", true, 0, "")

	pdf.SetTextColor(0, 0, 0)
	pdf.Ln(4)

	// ── Fuentes ──────────────────────────────────────────────
	sectionHeader(pdf, "Source Details")
	pdf.SetFont("Helvetica", "", 9)

	for _, source := range td.Sources {
		sourceName, _ := source["source"].(string)
		supported, _ := source["supported"].(bool)

		pdf.SetFont("Helvetica", "B", 10)
		pdf.Cell(0, 7, fmt.Sprintf("▸ %s", sourceName))
		pdf.Ln(6)
		pdf.SetFont("Helvetica", "", 9)

		if !supported {
			pdf.Cell(10, 6, "")
			pdf.Cell(0, 6, "Not supported for this IOC type")
			pdf.Ln(6)
			continue
		}

		for k, v := range source {
			if k == "source" || k == "supported" || k == "raw" {
				continue
			}
			pdf.Cell(10, 6, "")
			pdf.Cell(50, 6, fmt.Sprintf("%s:", k))
			pdf.Cell(0, 6, fmt.Sprintf("%v", v))
			pdf.Ln(6)
		}
		pdf.Ln(2)
	}

	// ── Notas del analista ───────────────────────────────────
	if req.Notes != "" {
		pdf.Ln(4)
		sectionHeader(pdf, "Analyst Notes")
		pdf.SetFont("Helvetica", "", 10)
		pdf.MultiCell(0, 6, req.Notes, "", "", false)
	}

	return pdf
}

// ── Helpers ──────────────────────────────────────────────────

func sectionHeader(pdf *gofpdf.Fpdf, title string) {
	pdf.SetFillColor(30, 41, 59)
	pdf.SetTextColor(255, 255, 255)
	pdf.SetFont("Helvetica", "B", 11)
	pdf.CellFormat(0, 8, "  "+title, "", 1, "L", true, 0, "")
	pdf.SetTextColor(0, 0, 0)
	pdf.Ln(2)
}

func infoRow(pdf *gofpdf.Fpdf, label, value string) {
	pdf.SetFont("Helvetica", "B", 10)
	pdf.Cell(45, 7, label+":")
	pdf.SetFont("Helvetica", "", 10)
	pdf.Cell(0, 7, value)
	pdf.Ln(7)
}

func classificationColor(classification string) (int, int, int) {
	switch classification {
	case "CRITICAL":
		return 185, 28, 28 // rojo
	case "HIGH":
		return 194, 65, 12 // naranja
	case "MEDIUM":
		return 161, 98, 7 // amarillo
	default:
		return 21, 128, 61 // verde
	}
}
