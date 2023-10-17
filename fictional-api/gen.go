package main

import (
	"bufio"
	"strconv"
	"math/rand"
	"os"
)

const (
	PLAC       = 54
	COUP       = 36
	SV         = 18
	LUX        = 10
	TrArctic   = "Арктика"
	TrPremium  = "Премиум"
	TrVolga    = "Волга"
	TrTypePlac = "Плацкарт"
	TrTypeCoup = "Купе"
	TrTypeSV   = "СВ"
	TrTypeLux  = "Люкс"
)

type Profile struct {
	Name   string `json:"first_name,omitempty"`
	Sex    string `json:"gender,omitempty"`
	Age    int    `json:"age,omitempty"`
	Number string `json:"phone,omitempty"`
}

type Departure struct {
	Train   string `json:"train_name"`
	Route   string `json:"route"`
	Station string `json:"station"`
}

type Train struct {
	Name   string `json:"name"`
	Route  string `json:"route"`
	Cars   []Car  `json:"cars"`
}

type Car struct {
	Number int    `json:"number"`
	Type   string `json:"type"`
	Seats  []Seat `json:"seats"`
}

type Seat struct {
	Reserved   bool   `json:"reserved"`
	Number     int    `json:"number"`
	Owner      Info   `json:"owner"`
}

type Info struct {
	ID        int      `json:"rzd_id"`
	Profile
	Interests []string `json:"interests,omitempty"`
	Job       string   `json:"job,omitempty"`
	BadHabits []string `json:"bad_habits,omitempty"`
	Sociality int      `json:"sociality,omitempty"`
}

var (
	names      = make(map[string][]string, 0)
	departures = make([]Departure, 0)
	people     = make([]Info, 1)

	badHabits = []string{
		"smoking", "drinking",
	}

	interests = []string{
		"tech", "science", "sport",
		"art", "music", "politics",
	}

	jobs = []string{
		"computers", "education", "medicine",
		"foundry", "finance", "government",
	}
)

// TODO: Use that to load user list, then unmarshal them on demand
func getData(filename string) ([]string, error) {
	array := make([]string, 0)

	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		array = append(array, scanner.Text())
	}

	err = scanner.Err()
	if err != nil {
		return nil, err
	}
	return array, nil
}

func genProfile() *Profile {
	profile := &Profile{}

	sexnum := rand.Intn(2) + 1

	sstr := func(x int) string {
		if x == 1 {
			return "female"
		} else {
			return "male"
		}
	}(sexnum)

	profile.Sex = sstr
	profile.Name = names[sstr][rand.Intn(len(names[sstr]))]
	profile.Age = rand.Intn(48) + 18 // sorry old folks
	profile.Number = "+7" + func() string {
		x := ""
		for i := 0; i < 10; i++ {
			x += strconv.Itoa(rand.Intn(10))
		}
		return x
	}()

	return profile
}

func genInfo() *Info {
	profile := genProfile()

	info := &Info{
		Profile: *profile,
	}


	info.BadHabits = *genFromArray(badHabits, rand.Intn(len(badHabits)))
	if len(info.BadHabits) == 0 {
		info.BadHabits = []string{"none"}
	}

	info.Interests = *genFromArray(interests, rand.Intn(len(interests)-1)+1)
	info.Job = jobs[rand.Intn(len(jobs))]

	info.Sociality = rand.Intn(5) + 1

	return info
}

func genFromArray[T comparable](array []T, num int) *[]T {
	newarr := make([]T, 0)
	for i := 0; i < num; {
		val := array[rand.Intn(len(array))]
		if !has(newarr, val) {
			newarr = append(newarr, val)
			i++
		}
	}
	return &newarr
}

func has[T comparable](array []T, elem T) bool {
	for _, v := range array {
		if v == elem {
			return true
		}
	}
	return false
}

func genSeats(n int) *[]Seat {
	seats := make([]Seat, 0)

	for i := 1; i <= n; i++ {
		seat := Seat{Number: i}	
		seat.Reserved = func() bool {
			if rand.Intn(6) == 0 {
				return false
			}
			return true
		}()
		if seat.Reserved {
			seat.Owner = Info{ID: people[rand.Intn(len(people))].ID}
		}

		seats = append(seats, seat)
	}

	return &seats
}

func genCars(name string) *[]Car {
	cars := make([]Car, 0)
	carcnt := 1

	switch name {
	case TrVolga:
		for i := 0; i < 8; i++ {
			cars = append(cars, Car{Type: TrTypePlac, Seats: *genSeats(PLAC), Number: carcnt})
			carcnt++
		}
		for i := 0; i < 7; i++ {
			cars = append(cars, Car{Type: TrTypeCoup, Seats: *genSeats(COUP), Number: carcnt})
			carcnt++
		}
		cars = append(cars, Car{Type: TrTypeSV, Seats: *genSeats(SV), Number: carcnt})
	case TrPremium:
		for i := 0; i < 10; i++ {
			cars = append(cars, Car{Type: TrTypeCoup, Seats: *genSeats(COUP), Number: carcnt})
			carcnt++
		}
		for i := 0; i < 2; i++ {
			cars = append(cars, Car{Type: TrTypeSV, Seats: *genSeats(SV), Number: carcnt})
			carcnt++
		}
		cars = append(cars, Car{Type: TrTypeLux, Seats: *genSeats(LUX), Number: carcnt})
	case TrArctic:
		for i := 0; i < 7; i++ {
			cars = append(cars, Car{Type: TrTypePlac, Seats: *genSeats(PLAC), Number: carcnt})
			carcnt++
		}
		for i := 0; i < 6; i++ {
			cars = append(cars, Car{Type: TrTypeCoup, Seats: *genSeats(COUP), Number: carcnt})
			carcnt++
		}
	}

	return &cars
}

func genTrain(name string, route string) *Train {
	train := &Train{Name: name, Route: route}
	train.Cars = *genCars(name)

	return train
}
