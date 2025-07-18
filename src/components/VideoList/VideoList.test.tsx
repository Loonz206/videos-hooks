import { render, screen, fireEvent } from "@testing-library/react";
import VideoList from "./VideoList.tsx";

describe("VideoList", () => {
  test("renders no videos if empty", () => {
    render(<VideoList videos={[]} onVideoSelect={jest.fn()} />);
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });

  test("renders multiple videos", () => {
    const videos = [
      {
        id: { videoId: "1" },
        snippet: {
          title: "A",
          thumbnails: { medium: { url: "http://example.com/a.jpg" } },
        },
      },
      {
        id: { videoId: "2" },
        snippet: {
          title: "B",
          thumbnails: { medium: { url: "http://example.com/b.jpg" } },
        },
      },
    ];
    render(<VideoList videos={videos} onVideoSelect={jest.fn()} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  test("calls onVideoSelect with the correct id when a video is clicked", () => {
    const handleVideoSelect = jest.fn();
    const videos = [
      {
        id: { videoId: "1" },
        snippet: {
          title: "A",
          thumbnails: { medium: { url: "http://example.com/a.jpg" } },
        },
      },
      {
        id: { videoId: "2" },
        snippet: {
          title: "B",
          thumbnails: { medium: { url: "http://example.com/b.jpg" } },
        },
      },
    ];
    render(<VideoList videos={videos} onVideoSelect={handleVideoSelect} />);
    fireEvent.click(screen.getByText("A"));
    expect(handleVideoSelect).toHaveBeenCalledWith(videos[0]);
    fireEvent.click(screen.getByText("B"));
    expect(handleVideoSelect).toHaveBeenCalledWith(videos[1]);
  });
});
