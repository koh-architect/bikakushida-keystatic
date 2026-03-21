import { makeAPIRouteHandler } from "@keystatic/next/api";
import config from "../../../../../keystatic.config";

const handler = makeAPIRouteHandler({ config });

export { handler as GET, handler as POST };