package handlers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/AGhostp0wn/Sistema-Inteligencia-Amenazas/report-service/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GenerateJSONReport(c *gin.Context) {
	var req models.ReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Body inválido: %s", err.Error())})
		return
	}

	response := models.JSONReportResponse{
		ReportID:    uuid.New().String(),
		GeneratedAt: time.Now().UTC().Format(time.RFC3339),
		Analyst:     req.AnalystName,
		Notes:       req.Notes,
		ThreatData:  req.ThreatData,
	}

	c.JSON(http.StatusOK, response)
}
