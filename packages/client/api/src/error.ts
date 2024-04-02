/*
 * Copyright 2023 Dimensional Fun & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as LP from "lavalink-protocol";

export type LavalinkHTTPErrorReason = "DECODE" | "VALIDATION" | "HTTP" | "UNKNOWN" | "LAVALINK" | "ABORTED";

const REASON_MESSAGES: Record<LavalinkHTTPErrorReason, string> = {
    DECODE: "Unable to decode response body",
    HTTP: "Unable to execute HTTP request",
    LAVALINK: "Lavalink returned an error",
    UNKNOWN: "An unknown error occurred",
    VALIDATION: "Unable to validate input value.",
    ABORTED: "The request was aborted",
};

/**
 * Indicates that something went wrong while executing a Lavalink HTTP request.
 */
export class LavalinkHTTPError extends Error {
    readonly reason: LavalinkHTTPErrorReason;

    constructor(
        message?: string | null,
        { reason = "UNKNOWN", ...options }: ErrorOptions & { reason?: LavalinkHTTPErrorReason } = {},
    ) {
        super(message ?? REASON_MESSAGES[reason ?? "UNKNOWN"], options);
        this.reason = reason;
    }

    override get name() {
        return "LavalinkHTTPError";
    }
}

/**
 * Indicates that a Lavalink HTTP request failed due to an internal lavalink exception.
 */
export class LavalinkAPIError extends LavalinkHTTPError {
    constructor(readonly data: LP.Error) {
        super(`${data.path} returned ${data.status}: ${data.message}`, { cause: data.trace, reason: "LAVALINK" });
    }

    override get name() {
        return "LavalinkAPIError";
    }
}

export const isLavalinkHTTPError = (value: unknown): value is LavalinkHTTPError => {
    return value instanceof LavalinkHTTPError;
};

export const isLavalinkAPIError = (value: unknown): value is LavalinkAPIError => {
    return value instanceof LavalinkAPIError;
};

export const isNotFoundError = (value: unknown): value is LavalinkAPIError => {
    return isLavalinkAPIError(value) && value.data.status === 404;
};
