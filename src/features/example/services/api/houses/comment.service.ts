import "server-only";

import axios from "@/lib/http/interceptors";

import type { CreateCommentPayload } from "./house.service";

export const commentService = {
  create: async (payload: CreateCommentPayload) => {
    const response = await axios.post(
      "/comments",
      payload,
      {
        headers: {
          tokenNeeded: true,
        },
      },
    );

    return response.data;
  },
};