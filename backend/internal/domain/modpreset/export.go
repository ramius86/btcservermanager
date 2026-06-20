package modpreset

import (
	"bytes"
	"html/template"
	"regexp"
)

var presetNameCleanupRegex = regexp.MustCompile(`[^a-zA-Z0-9_ ]`)

type Exporter struct{}

func NewExporter() *Exporter {
	return &Exporter{}
}

const exportTemplate = `<html>
  <!--Created by BTC Server Manager: https://github.com/ramius86/btcservermanager_go-->
  <head>
    <meta name="arma:Type" content="list" />
    <meta name="arma:PresetName" content="{{.PresetName}}" />
    <meta name="generator" content="BTC Server Manager" />
    <title>Arma 3</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css" />
    <style>
body {
	margin: 0;
	padding: 0;
	color: #fff;
	background: #000;	
}

body, th, td {
	font: 95%/1.3 Roboto, Segoe UI, Tahoma, Arial, Helvetica, sans-serif;
}

td {
    padding: 3px 30px 3px 0;
}

h1 {
    padding: 20px 20px 0 20px;
    color: white;
    font-weight: 200;
    font-family: segoe ui;
    font-size: 3em;
    margin: 0;
}

em {
    font-variant: italic;
    color:silver;
}

.before-list {
    padding: 5px 20px 10px 20px;
}

.mod-list {
    background: #222222;
    padding: 20px;
}

.footer {
    padding: 20px;
    color:gray;
}

a {
    color: #D18F21;
    text-decoration: underline;
}

a:hover {
    color:#F1AF41;
    text-decoration: none;
}

.from-steam {
    color: #449EBD;
}
</style>
  </head>
  <body>
    <h1>Arma 3 Mods</h1>
    <p class="before-list">
      <em>To import this preset, drag this file onto the Launcher window. Or click the MODS tab, then PRESET in the top right, then IMPORT at the bottom, and finally select this file.</em>
    </p>
    <div class="mod-list">
      <table>
        {{range .Preset.Mods}}
        <tr data-type="ModContainer">
          <td data-type="DisplayName">{{.Name}}</td>
          <td>
            <span class="from-steam">Steam</span>
          </td>
          <td>
            <a href="https://steamcommunity.com/sharedfiles/filedetails/?id={{.ID}}" data-type="Link">https://steamcommunity.com/sharedfiles/filedetails/?id={{.ID}}</a>
          </td>
        </tr>
        {{end}}
      </table>
    </div>
    <div class="footer">
      <span>Created by BTC Server Manager.</span>
    </div>
  </body>
</html>
`

func (e *Exporter) Export(p *ModPreset) ([]byte, error) {
	tmpl, err := template.New("preset").Parse(exportTemplate)
	if err != nil {
		return nil, err
	}

	cleanName := presetNameCleanupRegex.ReplaceAllString(p.Name, "")

	data := struct {
		Preset     *ModPreset
		PresetName string
	}{
		Preset:     p,
		PresetName: cleanName,
	}

	var buf bytes.Buffer
	// Write XML declaration manually to avoid html/template escaping it
	buf.WriteString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n")

	if err := tmpl.Execute(&buf, data); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}
