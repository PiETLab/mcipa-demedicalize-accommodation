import { handleFeedbackRequest, type WorkerEnv } from "./shared.ts"

export default {
  async fetch(request: Request, env: WorkerEnv) {
    return handleFeedbackRequest(request, env)
  },
}
