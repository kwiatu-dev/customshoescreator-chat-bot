export class ApiResult {
  constructor(result = null, error = null) {
    this.result = result;
    this.error = error;
  }

  static success(data) {
    return new ApiResult(data, null)
  }

  static failed(error) {
    return new ApiResult(null, { status: error.status, message: error.message })
  }
}