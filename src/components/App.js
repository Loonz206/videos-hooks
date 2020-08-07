import React, { Component } from "react";
import SearchBar from "../components/SearchBar";
import VideoDetail from '../components/VideoDetail';
import VideoList from '../components/VideoList';
import youtube from '../api/youtube';

class App extends Component {
  constructor(){
    super();
    this.state = { videos: [], selectedVideo: null}
  }

  componentDidMount(){
    this.onTermSubmit('Single origin coffee');
  }

  onVideoSelect = (video) => {
    this.setState({selectedVideo: video});
  }

  onTermSubmit = async term => {
    const response = await youtube.get("/search", {
      params: {
        q: term
      }
    });
    const { data } = response;
    console.log(data);
    this.setState(
      {
        videos: data.items,
        selectedVideo: data.items[0]
      })
  };

  render() {
    const { videos } = this.state;
    return (
      <div className="ui container">
        <SearchBar onFormSubmit={this.onTermSubmit}/>
        <div className="ui grid">
          <div className="ui row">
            <div className="eleven wide column">
              <VideoDetail video={this.state.selectedVideo}/>
            </div>
            <div className="five wide column">
              <VideoList videos={videos} onVideoSelect={this.onVideoSelect}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
