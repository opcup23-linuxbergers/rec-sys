package main

import (
	"log"
	"net/http"
	"encoding/json"
)

func main() {
	s := App{}
	s.RegisterAPI()

	deparr, err := getData("./data/departures")
	if err != nil {
		log.Fatal(err)
	}

	peoplearr, err := getData("./data/people")
	if err != nil {
		log.Fatal(err)
	}

	departures = func(x []string) []Departure {
		y := make([]Departure, 0)
		for i := 0; i < len(x) - 2; i += 3 {
			y = append(y, Departure{
				Train: x[i], 
				Route: x[i+1],
				Station: x[i+2],
			})
		}
		return y
	}(deparr)

	people = func(x []string) []Info{
		y := make([]Info, len(x))
		for i, v := range x {
			err := json.Unmarshal([]byte(v), &y[i])
			if err != nil {
				log.Println("skipping failed unmarshal..")
				continue
			}
			y[i].ID = i + 1
		}
		return y
	}(peoplearr)

	names["male"], err = getData("./data/names_male")
	if err != nil {
		log.Fatal(err)
	}

	names["female"], err = getData("./data/names_female")
	if err != nil {
		log.Fatal(err)
	}

	log.Println("listening on 18000..")
	log.Fatal(http.ListenAndServe(":18000", s))
}
