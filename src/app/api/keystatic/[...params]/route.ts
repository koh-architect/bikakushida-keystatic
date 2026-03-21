import { makeAPIRouteHandler } from "@keystatic/next/api";
import config from "../../../../../keystatic.config";

export const { GET, POST } = makeAPIRouteHandler({ config });