/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                hostname: "kpngjc0hn0.ufs.sh"
            },
            {
                hostname: "utfs.io"
            }
        ]
    }
};

export default config;
