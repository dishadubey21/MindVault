/**
 * Unified Successful API Response Standardizer
 * Ensures all non-exceptional API routes return structural symmetry.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP Status code (e.g. 200, 201)
   * @param {string} message - Descriptive response feedback text
   * @param {any} data - Content payload (object or list of records)
   * @param {object} [meta] - Metadata (e.g., pagination details)
   */
  constructor(statusCode, message, data = null, meta = {}) {
    this.success = true;
    this.status = 'success';
    this.statusCode = statusCode;
    this.message = message;
    
    if (data !== null) {
      this.data = data;
    }
    
    // Automatically flag array count helper for frontend processing
    if (data && Array.isArray(data)) {
      this.results = data.length;
    }
    
    // Merge any extra metadata (e.g., pagination keys)
    if (meta && Object.keys(meta).length > 0) {
      Object.assign(this, meta);
    }
  }

  /**
   * Sends the serialized JSON response through the Express response object.
   * @param {object} res - Express response object
   * @returns {object} Sent JSON payload
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = ApiResponse;
