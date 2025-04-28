export class notFoundException extends Error {
  constructor(description: string) {
    super(description);
    this.name = "NOT_FOUND_ERROR";
  }
}

export class validationException extends Error {
  constructor(description: string) {
    super(description);
    this.name = "VALIDATION_ERROR";
  }
}

export class badRequestException extends Error {
  constructor(description: string) {
    super(description);
    this.name = "BAD_REQUEST_ERROR";
  }
}

export class internalServerException extends Error {
  constructor(description: string) {
    super(description);
    this.name = "INTERNAL_SERVER_ERROR";
  }
}
