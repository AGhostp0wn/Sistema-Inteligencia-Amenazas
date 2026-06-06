package models

// SourceResult representa el resultado de un proveedor individual
type SourceResult struct {
	Source    string      `json:"source"`
	Supported bool        `json:"supported"`
	Error     *string     `json:"error,omitempty"`
	Data      interface{} `json:"-"`
}

// ThreatData es el payload que llega desde el Threat Service
type ThreatData struct {
	IOCType        string                   `json:"ioc_type"`
	IOCValue       string                   `json:"ioc_value"`
	RiskScore      int                      `json:"risk_score"`
	Classification string                   `json:"classification"` // LOW, MEDIUM, HIGH, CRITICAL
	Sources        []map[string]interface{} `json:"sources"`
	FromCache      bool                     `json:"from_cache"`
}

// ReportRequest es el body que recibe el report-service
type ReportRequest struct {
	AnalystName string     `json:"analyst_name"`
	Notes       string     `json:"notes"`
	ThreatData  ThreatData `json:"threat_data"`
}

// JSONReportResponse es la respuesta del endpoint /report/json
type JSONReportResponse struct {
	ReportID    string     `json:"report_id"`
	GeneratedAt string     `json:"generated_at"`
	Analyst     string     `json:"analyst_name"`
	Notes       string     `json:"notes"`
	ThreatData  ThreatData `json:"threat_data"`
}