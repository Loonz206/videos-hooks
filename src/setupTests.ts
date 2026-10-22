import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

(globalThis as { jest?: typeof vi }).jest = vi;
