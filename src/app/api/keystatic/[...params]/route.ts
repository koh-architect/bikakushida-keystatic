import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
export const runtime = "nodejs";

export const { GET, POST } = makeRouteHandler({ config });