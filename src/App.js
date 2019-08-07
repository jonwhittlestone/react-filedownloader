import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import Helpers from './helpers.js';
class App extends Component {
  state = {
    loading: false,
    errors: null,
    file: ""
  };

  handleChange = event => {
    this.setState({
      // substring to is to limit to 3 characters
      file: event.currentTarget.value.substring(0, 3)
    });
  };

  handleSubmit = event => {
    this.setState(
      {
        errors: null,
        loading: true
      },
      () => {
        Helpers.httpRequest(
          `http://localhost:5001?file=${this.state.file}`,
          "get"
        )
          // 1. Convert the data into 'blob'
          .then(response => response.blob())
          .then(blob => {
            // 2. Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `sample.${this.state.file}`);
            // 3. Append to html page
            document.body.appendChild(link);
            // 4. Force download
            link.click();
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link);
            this.setState({
              loading: false
            });
          })
          .catch(error => {
            error.json().then(json => {
              this.setState({
                errors: json,
                loading: false
              });
            });
          });
      }
    );

    // prevent form submit
    event.preventDefault();
  };

  render() {
    const { loading,errors, file } = this.state;

    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row">
            <div className="col col-12">
              <header className="App-header">
                <h1 className="display-4 mt-4 mb-4">
                  React File Downloader
                </h1>
                <p>
                  This is to demonstrate the ability to download a file via
                  an API request and interpret that file to automatically
                  download on the client side.
                </p>
              </header>

              <main>
                <form onSubmit={this.handleSubmit}>
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text">sample.</span>
                    </div>
                    <input
                      className="form-control"
                      onChange={this.handleChange}
                      disabled={loading}
                      value={file}
                      type="text"
                      name="file"
                      placeholder="File type, ex csv, pdf, png, etc"
                      autoComplete="off"
                    />
                  </div>

                  {errors ? (
                    <div className="form-group">
                      <div className="alert alert-danger">
                        <strong>Error!</strong>{" "}
                        {errors.message || "Something went wrong."}
                      </div>
                    </div>
                  ) : null}
                  <div className="form-group">
                    <button disabled={loading} className="btn btn-primary">
                      {loading ? "Downloading..." : "Download"}
                    </button>
                  </div>
                </form>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
    
  }

}
export default App;