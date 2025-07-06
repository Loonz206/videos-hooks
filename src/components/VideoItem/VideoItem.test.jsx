import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VideoItem from "./VideoItem.jsx";

describe("VideoItem", () => {
  const video = {
    snippet: {
      title: "Test Video",
      description: "desc",
      thumbnails: { medium: { url: "test.jpg" } },
    },
  };

  test("renders video title and image", () => {
    render(<VideoItem video={video} onVideoSelect={jest.fn()} />);
    expect(screen.getByText("Test Video")).toBeInTheDocument();
    expect(screen.getByAltText("desc")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "test.jpg");
  });

  test("calls onVideoSelect with video when clicked", () => {
    const onVideoSelect = jest.fn();
    render(<VideoItem video={video} onVideoSelect={onVideoSelect} />);
    fireEvent.click(screen.getByText("Test Video"));
    expect(onVideoSelect).toHaveBeenCalledWith(video);
  });

  test("renders nothing if no video", () => {
    const { container } = render(
      <VideoItem video={null} onVideoSelect={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("does not throw if description is missing", () => {
    const videoNoDesc = {
      snippet: {
        title: "No Desc",
        thumbnails: { medium: { url: "test.jpg" } },
      },
    };
    render(<VideoItem video={videoNoDesc} onVideoSelect={jest.fn()} />);
    expect(screen.getByText("No Desc")).toBeInTheDocument();
  });
});
