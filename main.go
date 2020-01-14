package main

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/png"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/nfnt/resize"
	"github.com/oliamb/cutter"
)

var DATA_FILE_PATH = func() string {
	p := os.Getenv("DATA_FILE_PATH")
	if p != "" {
		return p
	}
	return filepath.Join(os.Getenv("HOME"), ".qlib")
}()

type Entry struct {
	PageTitle           string   `json:"pageTitle"`
	FaviconURL          string   `json:"faviconURL"`
	ScreenshotFilename  string   `json:"screenshotFilename"`
	Tags                []string `json:"tags"`
	TimestampUTCSeconds uint64   `json:"timestampUTCSeconds"`
	Notes               string   `json:"notes"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func main() {
	err := os.MkdirAll(DATA_FILE_PATH, 0644)
	if err != nil {
		panic(err)
	}

	http.HandleFunc("/url", func(resp http.ResponseWriter, req *http.Request) {
		type Body struct {
			PageTitle         string   `json:"pageTitle"`
			PageURL           string   `json:"pageURL"`
			FaviconURL        string   `json:"faviconURL"`
			ScreenshotDataURL string   `json:"screenshotDataURL"`
			Tags              []string `json:"tags"`
		}
		var body Body
		decodeJSONBody(req, &body)

		hash := sha256.Sum256([]byte(body.PageURL))

		entry := &Entry{
			PageTitle:           body.PageTitle,
			FaviconURL:          body.FaviconURL,
			ScreenshotFilename:  fmt.Sprintf("%0x.png", hash[:]),
			Tags:                body.Tags,
			TimestampUTCSeconds: uint64(time.Now().UTC().Unix()),
			Notes:               "",
		}

		err = saveBase64AsPNG(body.ScreenshotDataURL, entry.ScreenshotFilename)
		if err != nil {
			respondJSON(resp, ErrorResponse{err.Error()})
			return
		}

		data, err := getDataFile()
		if err != nil {
			respondJSON(resp, ErrorResponse{err.Error()})
			return
		}

		data[body.PageURL] = entry

		err = saveDataFile(data)
		if err != nil {
			respondJSON(resp, ErrorResponse{err.Error()})
			return
		}

		respondJSON(resp, struct {
			Success bool `json:"success"`
		}{true})
	})

	// GET /entries
	// fetches all of the user's saved pages
	http.HandleFunc("/entries", func(resp http.ResponseWriter, req *http.Request) {
		data, err := getDataFile()
		if err != nil {
			panic(err)
		}

		respondJSON(resp, data)
	})

	http.HandleFunc("/entry/title", func(resp http.ResponseWriter, req *http.Request) {
		type Body struct {
			URL   string `json:"url"`
			Title string `json:"title"`
		}
		var body Body
		decodeJSONBody(req, &body)

		data, err := getDataFile()
		if err != nil {
			panic(err)
		}

		data[body.URL].PageTitle = body.Title

		err = saveDataFile(data)
		if err != nil {
			panic(err)
		}

		respondJSON(resp, map[string]*Entry{
			body.URL: data[body.URL],
		})
	})

	http.HandleFunc("/entry/notes", func(resp http.ResponseWriter, req *http.Request) {
		type Body struct {
			URL   string `json:"url"`
			Notes string `json:"notes"`
		}
		var body Body
		decodeJSONBody(req, &body)

		data, err := getDataFile()
		if err != nil {
			panic(err)
		}

		data[body.URL].Notes = body.Notes

		err = saveDataFile(data)
		if err != nil {
			panic(err)
		}

		respondJSON(resp, map[string]*Entry{
			body.URL: data[body.URL],
		})
	})

	http.HandleFunc("/batch-edit", func(resp http.ResponseWriter, req *http.Request) {
		type Body struct {
			TagsToAdd    []string `json:"tagsToAdd"`
			TagsToRemove []string `json:"tagsToRemove"`
			URLs         []string `json:"urls"`
		}
		var body Body
		decodeJSONBody(req, &body)

		data, err := getDataFile()
		if err != nil {
			panic(err)
		}

		toReturn := make(map[string]*Entry)
		for _, url := range body.URLs {
			for _, tag := range body.TagsToAdd {
				data[url].Tags = StringSetAdd(data[url].Tags, tag)
			}
			for _, tag := range body.TagsToRemove {
				data[url].Tags = StringSetRemove(data[url].Tags, tag)
			}
			toReturn[url] = data[url]
		}

		err = saveDataFile(data)
		if err != nil {
			panic(err)
		}

		respondJSON(resp, data)
	})

	http.Handle("/image/", http.StripPrefix("/image/",
		http.FileServer(http.Dir(DATA_FILE_PATH)),
	))
	http.Handle("/", http.FileServer(assetFS()))

	http.ListenAndServe(":9919", nil)
}

func getDataFile() (map[string]*Entry, error) {
	var data map[string]*Entry

	dataBytes, err := ioutil.ReadFile(filepath.Join(DATA_FILE_PATH, "data.json"))
	if os.IsNotExist(err) {
		data = make(map[string]*Entry)
		return data, nil

	} else if err != nil {
		return nil, err
	}

	err = json.Unmarshal(dataBytes, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func saveDataFile(data map[string]*Entry) error {
	dataBytes, err := json.Marshal(data)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(filepath.Join(DATA_FILE_PATH, "data.json"), dataBytes, 0644)
	if err != nil {
		return err
	}
	return nil
}

var prefixLen = len("data:image/png;base64,")

func saveBase64AsPNG(s string, filename string) error {
	s = s[prefixLen:]

	img, err := png.Decode(
		base64.NewDecoder(base64.StdEncoding, strings.NewReader(s)),
	)
	if err != nil {
		return err
	}

	img, err = cutter.Crop(img, cutter.Config{
		Width:   3,
		Height:  2,
		Options: cutter.Ratio,
	})

	img = resize.Thumbnail(300, 200, img, resize.NearestNeighbor)
	if err != nil {
		return err
	}

	outputFile, err := os.Create(filepath.Join(DATA_FILE_PATH, filename))
	if err != nil {
		return err
	}
	defer outputFile.Close()

	return png.Encode(outputFile, img)
}

func decodeJSONBody(req *http.Request, data interface{}) {
	defer req.Body.Close()

	reqData, err := ioutil.ReadAll(req.Body)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(reqData, data)
	if err != nil {
		panic(err)
	}
}

func respondJSON(resp http.ResponseWriter, data interface{}) {
	resp.Header().Add("Content-Type", "application/json")

	err := json.NewEncoder(resp).Encode(data)
	if err != nil {
		panic(err)
	}
}
