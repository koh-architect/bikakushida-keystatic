import { withKeystaticConfig } from "@keystatic/next";
import keystatic from "./keystatic.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default withKeystaticConfig(nextConfig, keystatic);