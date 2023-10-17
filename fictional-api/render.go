package main

import (
	"net/http"
)

func (p *Profile) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

func (i *Info) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

type DepartureList struct {
	Departures []Departure `json:"departures"`
}

func (d *DepartureList) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

type TrainRequest struct {
	Name string `json:"train_name"`
	Route string `json:"route"`
}

func (t *TrainRequest) Bind(_ *http.Request) error {
	return nil
}

func (t *Train) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

func (c *Car) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}

func (s *Seat) Render(_ http.ResponseWriter, _ *http.Request) error {
	return nil
}
