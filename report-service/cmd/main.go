package main

import (
	"fmt"
	"log"

	"github.com/AGhostp0wn/Sistema-Inteligencia-Amenazas/report-service/internal/config"
	"github.com/AGhostp0wn/Sistema-Inteligencia-Amenazas/report-service/internal/handlers"
	"github.com/AGhostp0wn/Sistema-Inteligencia-Amenazas/report-service/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	r := gin.Default()

	// CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// Health check — sin JWT para que Traefik/Docker lo use
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Rutas protegidas con JWT del Auth Service
	protected := r.Group("/report")
	protected.Use(middleware.JWTMiddleware(cfg.JWTSecret))
	{
		protected.POST("/pdf", handlers.GeneratePDFReport)
		protected.POST("/json", handlers.GenerateJSONReport)
	}

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Report Service corriendo en %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatal(err)
	}
}
