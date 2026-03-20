import { makeRouteHandler } from "@keystatic/next/api";
import config from "../../../../keystatic.config";

export const { GET, POST } = makeRouteHandler({ config });