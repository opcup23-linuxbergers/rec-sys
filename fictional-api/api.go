package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"github.com/go-chi/cors"
	"github.com/go-chi/chi/v5/middleware"
)

type App struct {
	*chi.Mux
}

func (a *App) RegisterAPI() {
	a.Mux = chi.NewRouter()

	a.Mux.Use(middleware.Logger)
	a.Mux.Use(middleware.Recoverer)
	a.Mux.Use(cors.AllowAll().Handler)
	a.Mux.Use(render.SetContentType(render.ContentTypeJSON))

	a.Mux.Get("/departures", listDepartures)
	a.Mux.Get("/departures/data", getTrainData)
	a.Mux.Get("/profile", getProfile)
	a.Mux.Get("/info", getInfo)
}

func listDepartures(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, &DepartureList{departures})	
}

func getTrainData(w http.ResponseWriter, r *http.Request) {
	data := &TrainRequest{}
	err := render.Bind(r, data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	train := genTrain(data.Name, data.Route)

	render.Render(w, r, train)
}

func getProfile(w http.ResponseWriter, r *http.Request) {
	profile := genProfile()
	render.Render(w, r, profile)
}

func getInfo(w http.ResponseWriter, r *http.Request) {
	info := genInfo()
	render.Render(w, r, info)
}
