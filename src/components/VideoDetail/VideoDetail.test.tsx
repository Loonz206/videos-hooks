import { render, screen } from "@testing-library/react";
import VideoDetail from "./VideoDetail.tsx";

describe("VideoDetail", () => {
  test("renders loading if no video", () => {
    render(<VideoDetail video={null} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders video details if video is provided", () => {
    const video = {
      id: { videoId: "abc123" },
      snippet: { title: "Test Title", description: "Test Desc" },
    };
    render(<VideoDetail video={video} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Desc")).toBeInTheDocument();
    expect(screen.getByTitle("video player")).toBeInTheDocument();
  });
});
